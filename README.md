# Bamazon
This is an Amazon-like app using MySQL that will take in orders from customers and deplete stock from the store's inventory.

**Products Tabe Content:**
  * **Item Id** - unique id number of the item
  * **Product Name** - name of the products in inventory
  * **Department Name** - name of the department under which the product tracked 
  * **Price** - price of the product in dollars
  * **Stock Quantity** - quantity of the product currently in inventory

**Instructions:**

Open the bamazonCustomer.js file using node in the terminal.  

![Broken Link: /images/openfile.png](/images/openfile.png)

A message will inform that the products list is being retrieved and the list will subsequently display.

![Broken Link: /images/displayInventory.png](/images/displayInventory.png)

The user will be prompted to select "Start Shopping" or "Quit App."  If the user selects "Start Shopping,"...

![Broken Link: /images/initialQuestion.png](/images/initialQuestion.png)

the user will be prompted to select the unique ID of the product desired. Afterwards, select the quantity of units desired.

![Broken Link: /images/askHowMany.png](/images/askHowMany.png)

The app will verify the quantity available,...

![Broken Link: /images/initialTable.png](/images/initialTable.png)

and will complete the purchase if there is sufficient inventory.  The app will then redirect to the initial message prompt.

![Broken Link: /images/completedPurchase.png](/images/completedPurchase.png)

Behind the scenes, the database will be updated appropriately with the new quantity.

![Broken Link: /images/adjustedTable.png](/images/adjustedTable.png)

If the quantity request cannot be met, the user will be informed appropriately and redirected to initial message prompt.

![Broken Link: /images/notQuantMsg.png](/images/notQuantMsg.png)

If the user decides to "Quit App,"...

![Broken Link: /images/quitApp.png](/images/quitApp.png)

the user will receive a goodbye message,...

![Broken Link: /images/goodbyeMessage.png](/images/goodbyeMessage.png)

and the connection will time out after three seconds.

![Broken Link: /images/connectionCloses.png](/images/connectionCloses.png)


