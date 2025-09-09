const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./db');

const app = express();
const port = process.env.PORT || 5000;
const SECRET_KEY = 'your_secret_key';

app.use(cors());
app.use(express.json());

// auth middleware and endpoint
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak tersedia.' });
    }
    try {
        const decoded = JsonWebTokenError.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token tidak valid.' });
    }
};

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password ===  'admin') {
        const token = jwt.sign({ username: 'admin' }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).json({ message: 'Username atau password salah.' });
    }
});

// Products API endpoints
app.get('/api/products', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products ORDER BY name ASC');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data produk.', error: error.message });
    }
});

app.post('/api/products', authMiddleware, async (req, res) => {
    const { name, price } = req.body;
    if (!name || !price) {
        return res.status(400).json({ message: 'Nama dan harga produk harus diisi.' });
    }
    try {
        const [result] = await db.query('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
        res.status(201).json({ id: result.insertId, name, price });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan produk.', error: error.message });
    }
});

app.put('/api/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, price } = req.body;
    try {
        const [result] = await db.query('UPDATE products SET name = ?, price = ? WHERE id = ?', [name, price, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json({ message: 'Produk berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui produk.', error: error.message });
    }
});

app.delete('/api/products/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan.' });
        }
        res.json({ message: 'Produk berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus produk.', error: error.message });
    }
});

//  Transactions API endpoints
app.get('/api/trasnactions', authMiddleware, async (req, res) => {
     try {
        const query = `
            SELECT t.*, p.name AS productName
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            ORDER BY t.created_at DESC
        `;
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data transaksi.', error: error.message });
    }
});

app.post('/api/transactions', authMiddleware, async (req, res) => {
    const { transaction_date, product_id, quantity, price, total } = req.body;
    if (!transaction_date || !product_id || !quantity || !price || !total) {
        return res.status(400).json({ message: 'Semua kolom transaksi harus diisi.' });
    }
    try {
        const [result] = await db.query(
            'INSERT INTO transactions (transaction_date, product_id, quantity, price, total) VALUES (?, ?, ?, ?, ?)',
            [transaction_date, product_id, quantity, price, total]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menambahkan transaksi.', error: error.message });
    }
});

app.put('/api/transactions/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { transaction_date, product_id, quantity, price, total } = req.body;
    try {
        const [result] = await db.query(
            'UPDATE transactions SET transaction_date = ?, product_id = ?, quantity = ?, price = ?, total = ? WHERE id = ?',
            [transaction_date, product_id, quantity, price, total, id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }
        res.json({ message: 'Transaksi berhasil diperbarui.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal memperbarui transaksi.', error: error.message });
    }
});

app.delete('transactions/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM transactions WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Transaksi tidak ditemukan.' });
        }
        res.json({ message: 'Transaksi berhasil dihapus.' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus transaksi.', error: error.message });
    }
});

// Dashboard endpoint
app.get('/api/dashboard', authMiddleware, async (req, res) => {
    try {
        // Total revenue for today, week, and month
        const [omsetRows] = await db.query(`
            SELECT
                SUM(CASE WHEN transaction_date = CURDATE() THEN total ELSE 0 END) AS today_omset,
                SUM(CASE WHEN transaction_date >= CURDATE() - INTERVAL 7 DAY THEN total ELSE 0 END) AS week_omset,
                SUM(CASE WHEN transaction_date >= CURDATE() - INTERVAL 30 DAY THEN total ELSE 0 END) AS month_omset,
                SUM(quantity) AS total_units_sold
            FROM transactions
        `);
        const { today_omset, week_omset, month_omset, total_units_sold } = omsetRows[0];

        // Sales per product for the chart
        const [productSalesRows] = await db.query(`
            SELECT p.name, SUM(t.quantity) AS total_sold
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            GROUP BY p.name
        `);

        // Best-selling product
        const [bestSellingRow] = await db.query(`
            SELECT p.name
            FROM transactions t
            JOIN products p ON t.product_id = p.id
            GROUP BY p.name
            ORDER BY SUM(t.quantity) DESC
            LIMIT 1
        `);
        const bestSellingProduct = bestSellingRow.length > 0 ? bestSellingRow[0].name : null;

        res.json({
            today_omset: today_omset || 0,
            week_omset: week_omset || 0,
            month_omset: month_omset || 0,
            total_units_sold: total_units_sold || 0,
            product_sales: productSalesRows,
            best_selling_product: bestSellingProduct
        });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data dashboard.', error: error.message });
    }
});

// start the server
app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});