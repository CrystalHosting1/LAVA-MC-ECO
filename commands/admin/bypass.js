module.exports = {
    name: 'bypass',
    description: 'Bypass command to be used in DMs only.',
    execute(message, args) {
        // Define allowed admin user IDs
        const allowedAdmins = ['796372087580393513', 'YOUR_ADMIN_ID_2']; // Replace with actual admin IDs

        // Check if the message author is one of the allowed admins
        if (!allowedAdmins.includes(message.author.id)) {
            message.reply('You are not authorized to use this command.');
            return;
        }

        // Check if the message was sent in a DM channel
        if (message.channel.type !== 'DM') {
            message.reply('This command can only be used in DMs.');
            return;
        }

        // Check if both code and username are provided
        if (args.length < 2) {
            message.reply('Usage: L!bypass <code> <username>');
            return;
        }

        const code = args[0];       // The code is the first argument
        const username = args[1];   // The username is the second argument

        // Validate the code and username
        if (code !== '70123143' || username.toLowerCase() !== 'naimur') {
            message.reply('Invalid code or username. Access denied.');
            return;
        }

        // If valid, display the username and code
        message.reply(`Bypass successful!\nUsername: ${username}\nCode: ${code}`);
    }
};
