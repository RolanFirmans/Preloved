const pool = require("../config/database");

const getReviewsByProduct = async (req, res) => {
    if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
        return res.status(400).json({ success: false, message: "ID produk tidak valid" });
    }

    try {
        const result = await pool.query(`
            SELECT
                r.id_review,
                r.id_customer,
                r.rating,
                r.komentar,
                c.nama_customer
            FROM review r
            JOIN customer c ON c.id_customer = r.id_customer
            WHERE r.id_produk = $1
            ORDER BY r.id_review DESC
        `, [req.params.id]);

        const rating = result.rows.length
            ? Number((result.rows.reduce((sum, row) => sum + Number(row.rating), 0) / result.rows.length).toFixed(1))
            : null;

        return res.status(200).json({
            success: true,
            data: { rating, review_count: result.rows.length, reviews: result.rows }
        });
    } catch (error) {
        console.error("Error fetching product reviews:", error);
        return res.status(500).json({ success: false, message: "Gagal mengambil ulasan produk" });
    }
};

const createReview = async (req, res) => {
    const idCustomer = Number(req.body?.id_customer);
    const idProduct = Number(req.body?.id_produk);
    const rating = Number(req.body?.rating);
    const comment = typeof req.body?.komentar === "string" ? req.body.komentar.trim() : "";

    if (!Number.isInteger(idCustomer) || idCustomer < 1 ||
        !Number.isInteger(idProduct) || idProduct < 1 ||
        !Number.isInteger(rating) || rating < 1 || rating > 5 ||
        !comment || comment.length > 2000) {
        return res.status(400).json({
            success: false,
            message: "ID pelanggan, produk, rating 1-5, dan komentar (maksimal 2000 karakter) wajib diisi"
        });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");
        // review.id_review has no sequence default in the current database schema.
        await client.query("LOCK TABLE review IN EXCLUSIVE MODE");
        const purchase = await client.query(`
            SELECT 1
            FROM detail_transaksi d
            JOIN transaksi t ON t.id_transaksi = d.id_transaksi
            WHERE t.id_customer = $1 AND d.id_produk = $2
            LIMIT 1
        `, [idCustomer, idProduct]);
        if (purchase.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(403).json({
                success: false,
                message: "Ulasan hanya dapat dikirim setelah produk dibeli"
            });
        }

        const idResult = await client.query(
            "SELECT COALESCE(MAX(id_review), 0) + 1 AS id_review FROM review"
        );
        const reviewId = Number(idResult.rows[0].id_review);
        const result = await client.query(`
            INSERT INTO review (id_review, id_customer, id_produk, rating, komentar)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id_review, id_customer, id_produk, rating, komentar
        `, [reviewId, idCustomer, idProduct, rating, comment]);
        await client.query("COMMIT");

        return res.status(201).json({
            success: true,
            message: "Ulasan berhasil dikirim",
            data: result.rows[0]
        });
    } catch (error) {
        if (client) await client.query("ROLLBACK");
        if (error.code === "23503") {
            return res.status(404).json({
                success: false,
                message: "Pelanggan atau produk tidak ditemukan"
            });
        }
        console.error("Error creating product review:", error);
        return res.status(500).json({ success: false, message: "Gagal mengirim ulasan" });
    } finally {
        if (client) client.release();
    }
};

module.exports = { getReviewsByProduct, createReview };
