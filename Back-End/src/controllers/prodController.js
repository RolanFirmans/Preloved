const pool = require("../config/database");

const getAllProduk = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                id_produk,
                id_admin,
                nama_produk,
                kategori_produk,
                stok,
                harga,
                gambar_produk,
                grade_produk,
                deskripsi_produk
            FROM produk
            ORDER BY id_produk ASC
        `);

        const data = result.rows.map((produk) => ({
            ...produk,
            gambar_produk: produk.gambar_produk
                ? `${req.protocol}://${req.get("host")}/uploads/products/${produk.gambar_produk}`
                : null
        }));

        res.status(200).json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error("Error fetching products:", error);

        res.status(500).json({
            success: false,
            message: "Gagal mengambil data produk"
        });
    }
};


const createProduk = async (req, res) => {
    try {
        const {
            nama_produk,
            kategori_produk,
            harga,
            stok,
            grade_produk,
            deskripsi_produk
        } = req.body;

        // Sementara sebelum sistem login admin dibuat
        const id_admin = 1;

        if (
            !nama_produk ||
            !kategori_produk ||
            !harga ||
            stok === undefined ||
            !grade_produk ||
            !deskripsi_produk
        ) {
            return res.status(400).json({
                success: false,
                message: "Semua data produk wajib diisi"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Gambar produk wajib diupload"
            });
        }

        const gambar_produk = req.file.filename;

        const result = await pool.query(
            `
            INSERT INTO produk (
                id_admin,
                nama_produk,
                kategori_produk,
                harga,
                stok,
                grade_produk,
                deskripsi_produk,
                gambar_produk
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
            `,
            [
                id_admin,
                nama_produk,
                kategori_produk,
                harga,
                stok,
                grade_produk,
                deskripsi_produk,
                gambar_produk
            ]
        );

        res.status(201).json({
            success: true,
            message: "Produk berhasil ditambahkan",
            data: result.rows[0]
        });

    } catch (error) {
        console.error("Error create produk:", error);

        res.status(500).json({
            success: false,
            message: "Gagal menambahkan produk"
        });
    }
};


module.exports = {
    getAllProduk,
    createProduk
};