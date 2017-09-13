var mysql=require("mysql");
var inquirer=require("inquirer");
var Table = require('cli-table');
var table = new Table({
    head: ['ID', 'Name', 'Price'],
    colWidths: [5, 40, 10]
});

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon_DB"
  }); 
  connection.connect(function(err) {
    if (err) throw err;
    initialize();
  });
function initialize(){
    inquirer.prompt(
        {
            name: "firstQ",
            type: "list",
            choices: ["Start Shopping", "Quit App"],
            message: "Welcome, What would you like to do?"
        }           
    )
    .then(function(answer){
        if(answer.firstQ === "Start Shopping"){
            startShopping();
        }else if(answer.firstQ === "Quit App"){
            console.log("Until next time. Goodbye!")
            setTimeout(function(){
                connection.end();
            }, 3000);
        };
    });
};  
function startShopping(){
    console.log("Retrieving list of products, please wait...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        for (var i=0; i<res.length; i++){
            table.push([res[i].item_id, res[i].product_name, res[i].price]);
        }; 
        console.log(table.toString());   
        // console.log(res);
        // askUser();
        inquirer.prompt([
        {
            name: "askId", 
            type: "input",
            message: "Select the ID of the product you would like to buy.",
            validate: function(value){
                if(isNaN(value)===false){
                    return true;
                }
                return false;
            }
        },
        {
            name: "askQuantity",
            type: "input",
            message: "How many units would you like to purchase?",
            validate: function(value){
                if(isNaN(value)===false){
                    return true;
                }
                return false;
            }
      
        }]       
        ).then(function(answer){
            var chosenId;
            for(var i=0; i<res.length; i++){
                if (res[i].item_id == parseInt(answer.askId)){
                    chosenId = res[i];
                }
            }
            if(chosenId.stock_quantity > parseInt(answer.askQuantity)){
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                        stock_quantity: (chosenId.stock_quantity - answer.askQuantity)
                         
                        },
                        {
                            item_id: answer.askId
                        }
                    ],
                    function(error){
                        if (error) throw err;
                        console.log("Thank you for your purchase.");
                        initialize();
                    }

                );
            }
            else{
                console.log("We do not have that amount in our inventory. Let us try again.");
                initialize();
            }
        });
    });
};    