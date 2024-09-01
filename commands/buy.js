module.exports = {
    name: 'buy',
    description: 'Buy an item from the store.',
    execute(message, args, db) {
        if (args.length === 0) {
            message.reply('Please specify the item ID you want to buy.');
            return;
        }

        const itemId = parseInt(args[0]);
        const userId = message.author.id;

        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, userRow) => {
            if (err) {
                console.error(err);
                message.reply('There was an error retrieving your data.');
                return;
            }

            if (!userRow) {
                message.reply('You do not have an account yet. Use !earn to get started.');
                return;
            }

            db.get("SELECT * FROM store WHERE item_id = ?", [itemId], (err, itemRow) => {
                if (err) {
                    console.error(err);
                    message.reply('There was an error retrieving the store data.');
                    return;
                }

                if (!itemRow) {
                    message.reply('That item does not exist in the store.');
                    return;
                }

                if (userRow.coins < itemRow.price) {
                    message.reply(`You do not have enough coins to buy this item. You need ${itemRow.price - userRow.coins} more coins.`);
                    return;
                }

                // Deduct the price from user's coins
                const newCoins = userRow.coins - itemRow.price;
                const newItems = userRow.items ? userRow.items + ',' + itemRow.item_name : itemRow.item_name;

                db.run("UPDATE users SET coins = ?, items = ? WHERE id = ?", [newCoins, newItems, userId], (err) => {
                    if (err) {
                        console.error(err);
                        message.reply('There was an error completing the purchase.');
                        return;
                    }

                    message.reply(`You have successfully bought ${itemRow.item_name} for ${itemRow.price} coins! You have ${newCoins} coins left.`);
                });
            });
        });
    }
};
