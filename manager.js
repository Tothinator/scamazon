//Menu
// View Products for Sale
// View Low Inventory <= 5
// Add to Inventory
// Add New Product 
// Quit

var Database = require('./database');
var inquirer = require('inquirer');
var chalk = require('chalk');


var Manager = function(db) {

    this.db = db;
    
    this.menu = function() {

        var that = this;

        inquirer.prompt([
            {
                name: 'action',
                type: 'list',
                choices: ['View Products for Sale', 'View Low Inventory', 
                            'Add to Inventory', 'Add New Product', 'Quit']
            }
        ]).then(function(res) {
            switch (res.action) {
                case 'View Products for Sale':
                    that.db.readProducts(that.menu.bind(that));
                    break;

                case 'View Low Inventory':
                    that.db.readProductsLow(that.menu.bind(that));
                    break;
                
                case 'Add to Inventory':
                    that.db.readProducts(that.askManagerAddInventory.bind(that));
                    break;

                case 'Add New Product':
                    that.askManagerNewProduct();
                    break;

                case 'Quit':
                    that.quit();
                    break;
            
                default:
                    console.log(chalk.yellow("How are you here?!?"));
                    break;
            }
        });

    }

    this.askManagerNewProduct = function() {

        var that = this;

        inquirer.prompt([
            {
                name: 'name',
                message: 'What is the name of the product you want to add?'
            },
            {
                name: 'department',
                message: 'What department is this product in?'
            },
            {
                name: 'price',
                message: 'How much does it cost?',
                validate: function(value) {
                    var price = parseFloat(value);
                    if (typeof price === 'number' && price > 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            {
                name: 'stock',
                message: 'What is the starting stock?',
                validate: function(value) {
                    var stock = parseInt(value);
                    if (typeof stock === 'number' && stock >= 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]).then(function(res) {

            var name = res.name;
            var department = res.department;
            var price = parseFloat(res.price);
            var stock = Math.floor(parseInt(res.stock));

            var newProduct = {
                name: name,
                department: department,
                price: price,
                stock: stock
            };

            that.db.insertProduct(that.menu.bind(that), newProduct);
        });
    }

    this.askManagerAddInventory = function(products) {

        var that = this;

        inquirer.prompt([
            {
                name: 'id',
                message: 'What is the Id of the product you want to add to?',
                validate: function (value) {
                if (parseInt(value) <= 0 || parseInt(value) > products.length || isNaN(parseInt(value))) {
                    return false;
                    } else {
                        return true;
                    }
                }
            },
            {
                name: 'quantity',
                message: 'How much do you want to add?',
                validate: function (value) {
                    var quantity = parseInt(value);
                    if (quantity >= 1  && typeof quantity === 'number'){
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        ]).then(function(res) {

            var id = Math.floor(parseInt(res.id));
            var quantity = Math.floor(parseInt(res.quantity));

            that.db.updateQuantity(that.menu.bind(that), id, quantity + products[id-1][5]);
        });
    }

    this.quit = function () {
        console.log("Okay bye!");
        this.db.close();
    }

}

module.exports = Manager;