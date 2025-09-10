-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS penjualan;
USE penjualan;

-- Create products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create transactions table
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATE NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price INT NOT NULL,
    total INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Seed initial data for products
INSERT INTO products (name, price) VALUES
('Gas LPG 3kg', 20000),
('Galon Aqua', 20000),
('Galon Le Minerale', 22000),
('Galon Pristine', 24000),
('Galon Air Isi Ulang', 5000);

-- Note: The `transactions` table will be populated via the API.
