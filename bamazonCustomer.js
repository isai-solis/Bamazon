var mysql=require("mysql");
var inquirer=require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "root",
    database: "bamazon_DB"
  });
  
  // connect to the mysql server and sql database
  connection.connect(function(err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
  });
  
function start(){
    console.log("Retrieving list of products, please wait...\n");
    connection.query("SELECT item_id, product_name, price, stock_quantity FROM products", function(err, res){
        if (err) throw err;
        for (var i=0; i<res.length; i++){
            console.log(
                "Item Id: " +
                res[i].item_id +
                " Product Name: " +
                res[i].product_name +
                " Price: " + 
                res[i].price +
                " Product Quantity: " +
                res[i].stock_quantity
            );
        };    
    
        // askUser();
        inquirer.prompt({
            name: "askId", 
            type: "list",
            choices: function(){
                var itemArray = [];
                for (var i=0; i<res.length; i++){
                    itemArray.push(res[i].item_id);
                }
                return itemArray;
            },
            message: "Select the ID of the product you would like to buy."
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
        }).then(function(answer){
            var chosenId;
            for(var i=0; i<res.length; i++){
                if (res[i].item_id === answer.askId){
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
                        start();
                    }

                );
            }
            else{
                console.log("We do not have that amount in our inventory. Let us try again.");
                start();
            }
        });
    });
};    

// // =====================================================
// var itemArray = [];

// var itemList = function(){
//     connection.query("SELECT item_id FROM products", function(err, res){
//         if (err) throw err;
//         for (var i=0; i<res.length; i++){
//             itemArray = res[i].item_id;
//         };
//     })
// }
// //=======================================================
// function askUser(){
//     connection.query("SELECT item_id,  FROM products", function(err, res){
//         if (err) throw err;
        
//     })
//     inquirer.prompt({
//         name: "askId", 
//         type: "list",
//         choices: function(){
//             var itemArray = [];
//             for (var i=0; i<res.length; i++){
//                 itemArray.push(res[i].item_id);
//             }
//             return itemArray;
//         },
//         message: "Select the ID of the product you would like to buy."
//     },
//     {
//         name: "askQuantity",
//         type: "input",
//         message: "How many units would you like to purchase?", 
//         validate: function(value){
//             if(isNaN(value)===false){
//                 return true;
//             }
//             return false;
//         }
//     }).then

// }
//=========================================================
//   // function which prompts the user for what action they should take
//   function start() {
//     inquirer
//       .prompt({
//         name: "postOrBid",
//         type: "rawlist",
//         message: "Would you like to [POST] an auction or [BID] on an auction?",
//         choices: ["POST", "BID"]
//       })
//       .then(function(answer) {
//         // based on their answer, either call the bid or the post functions
//         if (answer.postOrBid.toUpperCase() === "POST") {
//           postAuction();
//         }
//         else {
//           bidAuction();
//         }
//       });
//   }
  
//   // function to handle posting new items up for auction
//   function postAuction() {
//     // prompt for info about the item being put up for auction
//     inquirer
//       .prompt([
//         {
//           name: "item",
//           type: "input",
//           message: "What is the item you would like to submit?"
//         },
//         {
//           name: "category",
//           type: "input",
//           message: "What category would you like to place your auction in?"
//         },
//         {
//           name: "startingBid",
//           type: "input",
//           message: "What would you like your starting bid to be?",
//           validate: function(value) {
//             if (isNaN(value) === false) {
//               return true;
//             }
//             return false;
//           }
//         }
//       ])
//       .then(function(answer) {
//         // when finished prompting, insert a new item into the db with that info
//         connection.query(
//           "INSERT INTO auctions SET ?",
//           {
//             item_name: answer.item,
//             category: answer.category,
//             starting_bid: answer.startingBid,
//             highest_bid: answer.startingBid
//           },
//           function(err) {
//             if (err) throw err;
//             console.log("Your auction was created successfully!");
//             // re-prompt the user for if they want to bid or post
//             start();
//           }
//         );
//       });
//   }
  
//   function bidAuction() {
//     // query the database for all items being auctioned
//     connection.query("SELECT * FROM auctions", function(err, results) {
//       if (err) throw err;
//       // once you have the items, prompt the user for which they'd like to bid on
//       inquirer
//         .prompt([
//           {
//             name: "choice",
//             type: "rawlist",
//             choices: function() {
//               var choiceArray = [];
//               for (var i = 0; i < results.length; i++) {
//                 choiceArray.push(results[i].item_name);
//               }
//               return choiceArray;
//             },
//             message: "What auction would you like to place a bid in?"
//           },
//           {
//             name: "bid",
//             type: "input",
//             message: "How much would you like to bid?"
//           }
//         ])
//         .then(function(answer) {
//           // get the information of the chosen item
//           var chosenItem;
//           for (var i = 0; i < results.length; i++) {
//             if (results[i].item_name === answer.choice) {
//               chosenItem = results[i];
//             }
//           }
  
//           // determine if bid was high enough
//           if (chosenItem.highest_bid < parseInt(answer.bid)) {
//             // bid was high enough, so update db, let the user know, and start over
//             connection.query(
//               "UPDATE auctions SET ? WHERE ?",
//               [
//                 {
//                   highest_bid: answer.bid
//                 },
//                 {
//                   id: chosenItem.id
//                 }
//               ],
//               function(error) {
//                 if (error) throw err;
//                 console.log("Bid placed successfully!");
//                 start();
//               }
//             );
//           }
//           else {
//             // bid wasn't high enough, so apologize and start over
//             console.log("Your bid was too low. Try again...");
//             start();
//           }
//         });
//     });
//   }
  


// var connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,

//   // Your username
//   user: "root",

//   // Your password
//   password: "",
//   database: "ice_creamDB"
// });

// connection.connect(function(err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId + "\n");
//   createProduct();
// });

// function createProduct() {
//   console.log("Inserting a new product...\n");
//   var query = connection.query(
//     "INSERT INTO products SET ?",
//     {
//       flavor: "Rocky Road",
//       price: 3.0,
//       quantity: 50
//     },
//     function(err, res) {
//       console.log(res.affectedRows + " product inserted!\n");
//       // Call updateProduct AFTER the INSERT completes
//       updateProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function updateProduct() {
//   console.log("Updating all Rocky Road quantities...\n");
//   var query = connection.query(
//     "UPDATE products SET ? WHERE ?",
//     [
//       {
//         quantity: 100
//       },
//       {
//         flavor: "Rocky Road"
//       }
//     ],
//     function(err, res) {
//       console.log(res.affectedRows + " products updated!\n");
//       // Call deleteProduct AFTER the UPDATE completes
//       deleteProduct();
//     }
//   );

//   // logs the actual query being run
//   console.log(query.sql);
// }

// function deleteProduct() {
//   console.log("Deleting all strawberry icecream...\n");
//   connection.query(
//     "DELETE FROM products WHERE ?",
//     {
//       flavor: "strawberry"
//     },
//     function(err, res) {
//       console.log(res.affectedRows + " products deleted!\n");
//       // Call readProducts AFTER the DELETE completes
//       readProducts();
//     }
//   );
// }

// function readProducts() {
//   console.log("Selecting all products...\n");
//   connection.query("SELECT * FROM products", function(err, res) {
//     if (err) throw err;
//     // Log all results of the SELECT statement
//     console.log(res);
//     connection.end();
//   });
// }
