const fs = require("fs/promises");
const path = require("path");
const pool = require("../config/database");

const uploadDirectory = path.resolve(__dirname, "../../uploads/products");
const uploadedNames = (files) => Object.values(files || {}).flat().map((file) => file.filename);

const removeFiles = async (fileNames) => {
    const results = await Promise.allSettled(
        [...new Set(fileNames.filter(Boolean))].map((fileName) =>
            fs.unlink(path.join(uploadDirectory, path.basename(fileName)))
        )
    );

    results.filter((result) => result.status === "rejected").forEach((result) => {
        if (result.reason.code !== "ENOENT") {
            console.error("Gagal menghapus file produk:", result.reason);
        }
    });

    return results.some((result) =>
        result.status === "rejected" && result.reason.code !== "ENOENT"
    );
};

const validId = (id) => /^\d+$/.test(id) && Number(id) > 0;
const validProductFields = ({ nama_produk, kategori_produk, harga, stok, grade_produk, deskripsi_produk }) => (
    typeof nama_produk === "string" && Boolean(nama_produk.trim()) && nama_produk.trim().length <= 150 &&
    typeof kategori_produk === "string" && Boolean(kategori_produk.trim()) && kategori_produk.trim().length <= 50 &&
    Number.isFinite(Number(harga)) &&
    Number(harga) > 0 &&
    Number(harga) <= 9999999999.99 &&
    Math.round(Number(harga) * 100) === Number(harga) * 100 &&
    Number.isInteger(Number(stok)) &&
    Number(stok) >= 0 &&
    Number(stok) <= 2147483647 &&
    typeof grade_produk === "string" && Boolean(grade_produk.trim()) && grade_produk.trim().length <= 50 &&
    typeof deskripsi_produk === "string" && Boolean(deskripsi_produk.trim())
);

const getAllProduk = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                p.id_produk,
                p.id_admin,
                p.nama_produk,
                p.kategori_produk,
                p.stok,
                p.harga,
                p.gambar_produk,
                p.grade_produk,
                p.deskripsi_produk,
                r.rating,
                COALESCE(r.review_count, 0)::int AS review_count
            FROM produk p
            LEFT JOIN (
                SELECT id_produk, ROUND(AVG(rating)::numeric, 1) AS rating, COUNT(*) AS review_count
                FROM review
                GROUP BY id_produk
            ) r ON r.id_produk = p.id_produk
            ORDER BY p.id_produk DESC
        `);

        res.status(200).json({
            success: true,
            data: result.rows.map((produk) => ({
                ...produk,
                gambar_produk: produk.gambar_produk
                    ? `${req.protocol}://${req.get("host")}/uploads/products/${produk.gambar_produk}`
                    : null
            }))
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Gagal mengambil data produk"
        });
    }
};

const getProdukById = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ success: false, message: "ID produk tidak valid" });
    }

    try {
        const produkQuery = await pool.query(`
            SELECT
                p.*,
                r.rating,
                COALESCE(r.review_count, 0)::int AS review_count
            FROM produk p
            LEFT JOIN (
                SELECT id_produk, ROUND(AVG(rating)::numeric, 1) AS rating, COUNT(*) AS review_count
                FROM review
                GROUP BY id_produk
            ) r ON r.id_produk = p.id_produk
            WHERE p.id_produk = $1
        `, [req.params.id]);

        if (produkQuery.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }

        const produk = produkQuery.rows[0];
        const gambarQuery = await pool.query(
            "SELECT id_gambar, nama_file_gambar FROM produk_gambar WHERE id_produk = $1 ORDER BY id_gambar",
            [req.params.id]
        );

        res.status(200).json({
            success: true,
            data: {
                ...produk,
                gambar_produk: produk.gambar_produk
                    ? `${req.protocol}://${req.get("host")}/uploads/products/${produk.gambar_produk}`
                    : null,
                galeri_foto: gambarQuery.rows.map((gambar) => ({
                    id_gambar: gambar.id_gambar,
                    nama_file_gambar: `${req.protocol}://${req.get("host")}/uploads/products/${gambar.nama_file_gambar}`
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching product detail:", error);
        res.status(500).json({ success: false, message: "Gagal mengambil detail produk" });
    }
};

const createProduk = async (req, res) => {
    const files = uploadedNames(req.files);
    let client;

    try {
        if (!validProductFields(req.body)) {
            await removeFiles(files);
            return res.status(400).json({
                success: false,
                message: "Isi nama, kategori, harga, stok, grade, dan deskripsi produk dengan benar"
            });
        }

        if (!req.files?.gambar_produk?.[0]) {
            await removeFiles(files);
            return res.status(400).json({
                success: false,
                message: "Gambar utama produk wajib diupload"
            });
        }

        client = await pool.connect();
        await client.query("BEGIN");

        const insertProduk = await client.query(`
            INSERT INTO produk (
                id_admin, nama_produk, kategori_produk, harga, stok, grade_produk, deskripsi_produk, gambar_produk
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [
            1,
            req.body.nama_produk.trim(),
            req.body.kategori_produk.trim(),
            Number(req.body.harga),
            Number(req.body.stok),
            req.body.grade_produk.trim(),
            req.body.deskripsi_produk.trim(),
            req.files.gambar_produk[0].filename
        ]);

        const product = insertProduk.rows[0];
        for (const file of req.files.galeri || []) {
            await client.query(
                "INSERT INTO produk_gambar (id_produk, nama_file_gambar) VALUES ($1, $2)",
                [product.id_produk, file.filename]
            );
        }

        await client.query("COMMIT");
        return res.status(201).json({
            success: true,
            message: "Produk berhasil ditambahkan",
            data: product
        });
    } catch (error) {
        if (client) await client.query("ROLLBACK");
        await removeFiles(files);
        console.error("Error create produk:", error);
        return res.status(500).json({ success: false, message: "Gagal menambahkan produk" });
    } finally {
        if (client) client.release();
    }
};

const updateProduk = async (req, res) => {
    const files = uploadedNames(req.files);
    let client;

    if (!validId(req.params.id)) {
        await removeFiles(files);
        return res.status(400).json({ success: false, message: "ID produk tidak valid" });
    }

    if (!validProductFields(req.body)) {
        await removeFiles(files);
        return res.status(400).json({
            success: false,
            message: "Isi nama, kategori, harga, stok, grade, dan deskripsi produk dengan benar"
        });
    }

    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const existing = await client.query(
            "SELECT gambar_produk FROM produk WHERE id_produk = $1 FOR UPDATE",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            await client.query("ROLLBACK");
            await removeFiles(files);
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }

        const oldFiles = [];
        const newMain = req.files?.gambar_produk?.[0]?.filename;
        const replaceGallery = req.body.replace_gallery === "true";
        const galleryFiles = req.files?.galeri || [];

        if (newMain) oldFiles.push(existing.rows[0].gambar_produk);
        if (replaceGallery) {
            const oldGallery = await client.query(
                "SELECT nama_file_gambar FROM produk_gambar WHERE id_produk = $1",
                [req.params.id]
            );
            oldFiles.push(...oldGallery.rows.map((row) => row.nama_file_gambar));
            await client.query("DELETE FROM produk_gambar WHERE id_produk = $1", [req.params.id]);
        }

        const updated = await client.query(`
            UPDATE produk
            SET nama_produk = $1, kategori_produk = $2, harga = $3, stok = $4,
                grade_produk = $5, deskripsi_produk = $6,
                gambar_produk = COALESCE($7, gambar_produk)
            WHERE id_produk = $8
            RETURNING *
        `, [
            req.body.nama_produk.trim(),
            req.body.kategori_produk.trim(),
            Number(req.body.harga),
            Number(req.body.stok),
            req.body.grade_produk.trim(),
            req.body.deskripsi_produk.trim(),
            newMain || null,
            req.params.id
        ]);

        for (const file of galleryFiles) {
            await client.query(
                "INSERT INTO produk_gambar (id_produk, nama_file_gambar) VALUES ($1, $2)",
                [req.params.id, file.filename]
            );
        }

        await client.query("COMMIT");
        const cleanupWarning = await removeFiles(oldFiles.filter((file) => !files.includes(file)));
        return res.status(200).json({
            success: true,
            message: cleanupWarning
                ? "Produk berhasil diperbarui, tetapi sebagian file lama gagal dihapus"
                : "Produk berhasil diperbarui",
            data: updated.rows[0]
        });
    } catch (error) {
        if (client) await client.query("ROLLBACK");
        await removeFiles(files);
        console.error("Error update produk:", error);
        return res.status(500).json({ success: false, message: "Gagal memperbarui produk" });
    } finally {
        if (client) client.release();
    }
};

const deleteProduk = async (req, res) => {
    if (!validId(req.params.id)) {
        return res.status(400).json({ success: false, message: "ID produk tidak valid" });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");

        const product = await client.query(
            "SELECT gambar_produk FROM produk WHERE id_produk = $1 FOR UPDATE",
            [req.params.id]
        );
        if (product.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Produk tidak ditemukan" });
        }

        const gallery = await client.query(
            "SELECT nama_file_gambar FROM produk_gambar WHERE id_produk = $1",
            [req.params.id]
        );
        await client.query("DELETE FROM produk WHERE id_produk = $1", [req.params.id]);
        await client.query("COMMIT");

        const cleanupWarning = await removeFiles([
            product.rows[0].gambar_produk,
            ...gallery.rows.map((row) => row.nama_file_gambar)
        ]);
        return res.status(200).json({
            success: true,
            message: cleanupWarning
                ? "Produk berhasil dihapus, tetapi sebagian file gambar gagal dihapus"
                : "Produk berhasil dihapus"
        });
    } catch (error) {
        if (client) await client.query("ROLLBACK");
        if (error.code === "23503") {
            return res.status(409).json({
                success: false,
                message: "Produk tidak dapat dihapus karena sudah tercatat dalam transaksi"
            });
        }
        console.error("Error delete produk:", error);
        return res.status(500).json({ success: false, message: "Gagal menghapus produk" });
    } finally {
        if (client) client.release();
    }
};

module.exports = {
    getAllProduk,
    getProdukById,
    createProduk,
    updateProduk,
    deleteProduk
};
