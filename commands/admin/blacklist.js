module.exports = {
    name: 'blacklist',
    description: 'Blacklist a user (admin only).',
    execute(message, args, db) {
        if (!args[0]) {
            message.reply('Usage: LME!blacklist <user_id>');
            return;
        }

        const userId = args[0];

        db.run("INSERT INTO blacklist (id) VALUES (?)", [userId], (err) => {
            if (err) {
                console.error(err);
                message.reply('There was an error blacklisting the user.');
                return;
            }

            message.reply(`User with ID ${userId} has been blacklisted.`);
        });
    }
};
