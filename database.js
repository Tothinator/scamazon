// user read
// update quantity <--- manager & user
var mysql = require('mysql');
const cTable = require('console.table');

var Database = function() {

    this.connection = mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,
      
        // Your username
        user: "toth",
      
        // Your password
        password: "bootcamp",
        database: "scamazonDB"
    });

    this.connect = function(mainMenu) {
        // console.log("Connecting...");
        var myConnection = this.connection;
        this.connection.connect(function(err) {
            if (err) throw err;
            // console.log(myConnection.threadId);
            mainMenu();
        })
    }

    this.close = function () {
        // console.log("Closing...");
        this.connection.end();
    };

    this.readProducts = function(callback) {
        
        this.connection.query(
                'SELECT * from products',
                
                function(err, res) {
                    if (err) throw err;
                    // console.log(res);

                    var productsArray = [];

                    for (var i = 0; i < res.length; i ++) {
                        var id = res[i].product_id;
                        var name = res[i].product_name;
                        var sales = res[i].product_sales;
                        var department = res[i].product_department;
                        var price = res[i].product_price;
                        var stock = res[i].product_stock;

                        productsArray.push([id, name, sales, department, price, stock]);
                    }

                    console.table(['Product Id', 'Product Name', 'Product Sales' , 'Department', 'Price', 'Stock'], productsArray);

                    callback(productsArray);
                }
            );
    };

    this.readProductsLow = function(callback) {
        
        this.connection.query(
                'SELECT * from products where product_stock <= 5',
                
                function(err, res) {
                    if (err) throw err;
                    // console.log(res);

                    var productsArray = [];

                    for (var i = 0; i < res.length; i ++) {
                        var id = res[i].product_id;
                        var name = res[i].product_name;
                        var sales = res[i].product_name;
                        var department = res[i].product_department;
                        var price = res[i].product_price;
                        var stock = res[i].product_stock;

                        productsArray.push([id, name, department, price, stock]);
                    }

                    if (productsArray.length === 0){
                        console.log("No Items are low!");
                    } else {
                        console.table(['Product Id', 'Product Name', 'Product Sales' , 'Department', 'Price', 'Stock'], productsArray);
                    }

                    callback();
                }
            );
    };

    this.readProductsUser = function(callback) {
        
        var mainMenu = this.mainMenu;
        this.connection.query(
                'SELECT product_id, product_name, product_department, product_price, product_stock from products',
                
                function(err, res) {
                    if (err) throw err;
                    // console.log(res);

                    var productsArray = [];

                    for (var i = 0; i < res.length; i ++) {
                        var id = res[i].product_id;
                        var name = res[i].product_name;
                        var department = res[i].product_department;
                        var price = res[i].product_price;
                        var stock = res[i].product_stock;

                        productsArray.push([id, name, department, price, stock]);
                    }

                    console.table(['Product Id', 'Product Name', 'Department', 'Price', 'Stock'], productsArray);

                    callback(productsArray);
                }
            );
    };

    this.updateQuantity = function(mainMenu, id, newQuantity, salesChange = 0) {
        // console.log("Updating");

        updateProductSales = this.updateProductSales.bind(this);

        this.connection.query(
            'UPDATE products SET ? WHERE ?',
            [{
                product_stock: newQuantity
            },
            {
                product_id: id
            }],
            
            function(err, res) {

                if (salesChange > 0){
                    updateProductSales(mainMenu, id, salesChange);
                } else {
                    mainMenu();
                }
                

            });

    }

    this.updateProductSales = function (mainMenu, id, salesChange) {
        // console.log(salesChange);

        this.connection.query(
            'UPDATE products SET ? WHERE ?',
            [{
                product_sales: salesChange
            },
            {
                product_id: id
            }],
            
            function(err, res) {

                mainMenu();

            });
    }

    this.insertProduct = function (mainMenu, newProduct) {

        this.connection.query(
            'INSERT INTO products SET ?',
            {
                product_name: newProduct.name,
                product_department: newProduct.department,
                product_price: newProduct.price,
                product_stock: newProduct.stock
            },

            function(err, res) {
                if (err) throw err;
                // console.log(res);
                mainMenu();
            }
        );
    }

};

module.exports = Database;