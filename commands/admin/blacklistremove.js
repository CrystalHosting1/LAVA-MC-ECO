const sqlite3 = require('sqlite3').verbose();

module.exports = {
    name: 'blacklistremove',
    description: 'Removes a user from the blacklist.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const userId = args[0];
        if (!userId) return message.reply('Please provide a valid user ID.');

        // Initialize database
        const db = new sqlite3.Database('./database.sqlite');

        // Check if user is in the blacklist
        db.get('SELECT * FROM blacklist WHERE user_id = ?', [userId], (err, row) => {
            if (err) {
                console.error(err);
                return message.reply('There was an error checking the blacklist.');
            }

            if (!row) {
                return message.reply('This user is not in the blacklist.');
            }

            // Remove user from blacklist
            db.run('DELETE FROM blacklist WHERE user_id = ?', [userId], (err) => {
                if (err) {
                    console.error(err);
                    return message.reply('There was an error removing the user from the blacklist.');
                }

                message.reply('User has been removed from the blacklist.');
            });
        });

        // Close database connection
        db.close();
    }
};
