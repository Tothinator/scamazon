DROP DATABASE IF EXISTS scamazonDB;
CREATE DATABASE scamazonDB;

USE scamazonDB;

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    product_sales DECIMAL(10,2) DEFAULT 0,
    product_department VARCHAR(50) NOT NULL,
    product_price DECIMAL(10, 2) NOT NULL,
    product_stock INT NOT NULL,
    PRIMARY KEY (product_id)
);