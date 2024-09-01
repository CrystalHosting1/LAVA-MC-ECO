module.exports = {
    name: 'addmoney',
    description: 'Add money to a user account (admin only).',
    execute(message, args, db) {
        if (!args[0] || isNaN(args[1])) {
            message.reply('Usage: LME!addmoney <user_id> <amount>');
            return;
        }

        const userId = args[0];
        const amount = parseInt(args[1]);

        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
            if (err) {
                console.error(err);
                message.reply('There was an error retrieving the user data.');
                return;
            }

            if (!row) {
                message.reply('User not found.');
                return;
            }

            const newCoins = row.coins + amount;
            db.run("UPDATE users SET coins = ? WHERE id = ?", [newCoins, userId], (err) => {
                if (err) {
                    console.error(err);
                    message.reply('There was an error updating the user\'s coins.');
                    return;
                }

                message.reply(`Added ${amount} coins to ${row.username}. They now have ${newCoins} coins.`);
            });
        });
    }
};
