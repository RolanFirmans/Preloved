const pool = require("../config/database");

const createTransaksi = async (req, res) => {
    const customer = req.body?.customer;
    const items = req.body?.items;
    const name = typeof customer?.nama_customer === "string" ? customer.nama_customer.trim() : "";
    const email = typeof customer?.email_customer === "string" ? customer.email_customer.trim() : "";
    const phone = typeof customer?.telpon_customer === "string" ? customer.telpon_customer.trim() : "";
    const address = typeof customer?.alamat_customer === "string" ? customer.alamat_customer.trim() : "";

    if (!name || !email || !phone || !address || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({
            success: false,
            message: "Data pembeli dan minimal satu produk wajib diisi"
        });
    }

    if (name.length > 100 || email.length > 100 || phone.length > 20 || address.length > 255 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: "Data pembeli tidak valid" });
    }

    const quantities = new Map();
    for (const item of items) {
        const id = Number(item?.id_produk);
        const quantity = Number(item?.qty);
        if (!Number.isInteger(id) || id < 1 || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({ success: false, message: "Daftar produk atau jumlah tidak valid" });
        }
        quantities.set(id, (quantities.get(id) || 0) + quantity);
    }

    if (quantities.size > 50) {
        return res.status(400).json({ success: false, message: "Maksimal 50 jenis produk per transaksi" });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query("BEGIN");
        // These legacy tables lack ID sequences, so serialize MAX(id) allocation within this transaction.
        await client.query("LOCK TABLE customer, transaksi, detail_transaksi IN EXCLUSIVE MODE");

        const products = [];
        for (const [id, qty] of [...quantities.entries()].sort(([first], [second]) => first - second)) {
            const result = await client.query(
                "SELECT id_produk, nama_produk, harga, stok FROM produk WHERE id_produk = $1 FOR UPDATE",
                [id]
            );
            if (result.rows.length === 0) {
                await client.query("ROLLBACK");
                return res.status(404).json({
                    success: false,
                    message: `Produk dengan ID ${id} tidak ditemukan`
                });
            }
            const product = result.rows[0];
            if (Number(product.stok) < qty) {
                await client.query("ROLLBACK");
                return res.status(409).json({
                    success: false,
                    message: `Stok ${product.nama_produk} tidak mencukupi`
                });
            }
            products.push({ ...product, qty, unitPrice: Number(product.harga) });
        }

        const total = products.reduce((sum, product) => sum + product.unitPrice * product.qty, 0);
        const customerIdResult = await client.query(
            "SELECT COALESCE(MAX(id_customer), 0) + 1 AS id_customer FROM customer"
        );
        const customerId = Number(customerIdResult.rows[0].id_customer);
        await client.query(`
            INSERT INTO customer (id_customer, nama_customer, email_customer, telpon_customer, alamat_customer)
            VALUES ($1, $2, $3, $4, $5)
        `, [customerId, name, email, phone, address]);

        const transactionIdResult = await client.query(
            "SELECT COALESCE(MAX(id_transaksi), 0) + 1 AS id_transaksi FROM transaksi"
        );
        const transactionId = Number(transactionIdResult.rows[0].id_transaksi);
        const transactionResult = await client.query(`
            INSERT INTO transaksi (id_transaksi, id_customer, id_admin, total_pembayaran)
            VALUES ($1, $2, $3, $4)
            RETURNING id_transaksi, status_transaksi, total_pembayaran
        `, [transactionId, customerId, null, total]);
        const transaction = transactionResult.rows[0];

        const detailIdResult = await client.query(
            "SELECT COALESCE(MAX(id_detail), 0) + 1 AS id_detail FROM detail_transaksi"
        );
        let detailId = Number(detailIdResult.rows[0].id_detail);
        for (const product of products) {
            await client.query(`
                INSERT INTO detail_transaksi (id_detail, id_transaksi, id_produk, qty, harga_satuan)
                VALUES ($1, $2, $3, $4, $5)
            `, [detailId, transaction.id_transaksi, product.id_produk, product.qty, product.unitPrice]);
            detailId += 1;
            await client.query(
                "UPDATE produk SET stok = stok - $1 WHERE id_produk = $2",
                [product.qty, product.id_produk]
            );
        }

        await client.query("COMMIT");
        return res.status(201).json({
            success: true,
            message: "Pesanan berhasil dibuat",
            data: {
                ...transaction,
                id_customer: customerId,
                items: products.map(({ id_produk, nama_produk, qty, unitPrice }) => ({
                    id_produk,
                    nama_produk,
                    qty,
                    harga_satuan: unitPrice
                }))
            }
        });
    } catch (error) {
        if (client) await client.query("ROLLBACK");
        console.error("Error creating transaction:", error);
        return res.status(500).json({ success: false, message: "Gagal memproses pesanan" });
    } finally {
        if (client) client.release();
    }
};

module.exports = { createTransaksi };
