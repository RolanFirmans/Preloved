const pool = require("../config/database");

const getAllKateg = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT DISTINCT kategori_produk
            FROM produk
            WHERE kategori_produk IS NOT NULL
            ORDER BY kategori_produk ASC
        `);
        res.json({
            success: true,
            data: result.rows
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    getAllKateg
};