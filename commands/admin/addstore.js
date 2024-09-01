module.exports = {
    name: 'addstore',
    description: 'Add an item to the store (admin only).',
    execute(message, args, db) {
        // Check if the admin provided both an item name and a price
        if (!args[0] || !args[1] || isNaN(args[1])) {
            message.reply('Usage: LME!addstore <item_name> <price>');
            return;
        }

        // Retrieve item name and price from the command arguments
        const itemName = args[0];
        const itemPrice = parseInt(args[1]);

        // Insert the new item into the store table
        db.run("INSERT INTO store (item_name, price) VALUES (?, ?)", [itemName, itemPrice], function (err) {
            if (err) {
                console.error(err);
                message.reply('There was an error adding the item to the store.');
                return;
            }

            // Retrieve the last inserted row ID (item_id)
            const itemId = this.lastID; // 'this' refers to the statement context

            // Confirm that the item was added successfully and display the item ID
            message.reply(`Item "${itemName}" added to the store with ID: ${itemId} and price: ${itemPrice} coins.`);
        });
    }
};
