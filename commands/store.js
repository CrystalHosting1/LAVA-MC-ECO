module.exports = {
    name: 'store',
    description: 'Displays items available in the store, including admin-added items.',
    execute(message, args, db) {
        // Fetch all items from the store table
        db.all("SELECT * FROM store", (err, rows) => {
            if (err) {
                console.error(err);
                message.reply('There was an error retrieving the store items.');
                return;
            }

            // Check if the store is empty
            if (rows.length === 0) {
                message.reply('The store is currently empty.');
                return;
            }

            // Create a message listing all items in the store with their ID, name, and price
            let storeItems = 'Items available in the store:\n';
            rows.forEach(row => {
                storeItems += `ID: ${row.item_id}, Name: ${row.item_name}, Price: ${row.price} coins\n`;
            });

            // Send the list of items to the user
            message.reply(storeItems);
        });
    }
};
