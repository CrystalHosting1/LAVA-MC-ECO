const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: 'whitelistadd',
    description: 'Adds a user to the whitelist.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const userId = args[0];
        if (!userId || !/^\d+$/.test(userId)) {
            return message.reply('Please provide a valid user ID.');
        }

        // Initialize database
        const db = new sqlite3.Database('./database.sqlite');

        // Add user to whitelist
        db.run('INSERT INTO whitelist (user_id) VALUES (?)', [userId], function (err) {
            if (err) {
                console.error(err);
                return message.reply('An error occurred while accessing the database.');
            }

            message.reply('User has been added to the whitelist.');
        });

        // Close database connection
        db.close();
    }
};
