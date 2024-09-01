module.exports = {
    name: 'earn',
    description: 'Earn some coins.',
    execute(message, args, db) {
        const userId = message.author.id;
        const username = message.author.username;

        db.get("SELECT * FROM users WHERE id = ?", [userId], (err, row) => {
            if (err) {
                console.error(err);
                return;
            }
            let coins = row ? row.coins + 10 : 10; // Default earn 10 coins
            if (row) {
                db.run("UPDATE users SET coins = ? WHERE id = ?", [coins, userId]);
            } else {
                db.run("INSERT INTO users (id, username, coins, items) VALUES (?, ?, ?, ?)", [userId, username, coins, '']);
            }
            message.reply(`You earned 10 coins! You now have ${coins} coins.`);
        });
    }
};
