const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

module.exports = {
    name: 'whitelistremove',
    description: 'Removes a user from the whitelist.',
    async execute(message, args) {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.reply('You do not have permission to use this command.');
        }

        const user = message.mentions.users.first() || await message.client.users.fetch(args[0]);
        if (!user) return message.reply('Please provide a valid user.');

        db.get('SELECT id FROM whitelist WHERE id = ?', [user.id], (err, row) => {
            if (err) {
                console.error('Database error:', err);
                return message.reply('An error occurred while accessing the database.');
            }
            if (!row) {
                return message.reply('User is not in the whitelist.');
            }

            db.run('DELETE FROM whitelist WHERE id = ?', [user.id], (err) => {
                if (err) {
                    console.error('Database error:', err);
                    return message.reply('An error occurred while accessing the database.');
                }
                message.reply(`${user.tag} has been removed from the whitelist.`);
            });
        });
    }
};
