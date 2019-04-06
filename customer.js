//Menu
// Displays product list and then asks what they would like to purchase or quit with Q
var Database = require('./database');
var inquirer = require('inquirer');
var chalk = require('chalk');

var Customer = function(db) {

    this.db = db;
    
    this.menu = function() {

        this.db.readProductsUser(this.askCustomer.bind(this));

    }

    this.quit = function () {
        console.log("Thanks for shopping!");
        this.db.close();
    }

    this.askCustomer = function(products) {

        var quit = this.quit.bind(this);
        var db = this.db;;
        var mainMenu = this.menu.bind(this);

        inquirer.prompt([
            {
                name: 'id',
                message: 'Please enter the ID of the product you would like to purchase. [Q to quit]',
                validate: function (value) {
                    if (value.toLowerCase() === 'q') {
                        return true;
                    } else if (parseInt(value) <= 0 || parseInt(value) > products.length || isNaN(parseInt(value))) {
                        return false;
                    } else {
                        return true;
                    }
                }

            }

        ]).then(function(res) {

            var id = parseInt(res.id);

            if (res.id === 'q'){
                quit();
            } else {
                
                inquirer.prompt([
                    {
                        name: 'quantity',
                        message: 'How many would you like to buy?'
                    }
                ]).then(function(res) {

                    var amt = parseInt(res.quantity);

                    // Checks if the Quantity currently in the database
                    if (amt > products[id-1][4]) {
                        console.log(chalk.bold.red("There's not enough of that item!\n"));
                        mainMenu();
                    } else {
                        db.updateQuantity(mainMenu, id, products[id-1][4] - amt, amt * products[id-1][3]);
                    }

                });
            }
        });
    }
}

module.exports = Customer;