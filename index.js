var Customer = require('./customer');
var Manager = require('./manager');
var Database = require('./database');
var inquirer = require('inquirer');
var chalk = require('chalk');

var db = new Database();
var customer = new Customer(db);
var manager = new Manager(db);

db.connect(main);

function main () {

    inquirer.prompt([
        {
            name: 'login',
            type: 'list',
            choices: ['Customer', 'Manager', 'Supervisor', 'Quit']
        }
    ]).then(function(res) {
        switch (res.login) {
            case 'Customer':
                customer.menu();                
                break;
            
            case 'Manager':
                manager.menu();
                break;
            
            case 'Supervisor':
                console.log(chalk.blue('Coming Never... Try another login'));
                main();
                break;
        
            default:
                db.close();
                break;
        }
    });

}