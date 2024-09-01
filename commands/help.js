const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'Displays a list of available commands.',
    async execute(message) {
        // List of commands
        const commands = [
            { name: 'buy', description: 'Buy something from the store.' },
            { name: 'earn', description: 'Earn money in the game.' },
            { name: 'leaderboard', description: 'Displays the leaderboard of users with their earnings.' },
            { name: 'store', description: 'Shows the store with available items.' },
            { name: 'uptime', description: 'Displays the bot\'s uptime.' },
            { name: 'addmoney', description: 'Adds money to a user\'s account. (Admin only)' },
            { name: 'addstore', description: 'Adds items to the store. (Admin only)' },
            { name: 'blacklistremove', description: 'Removes a user from the blacklist. (Admin only)' },
            { name: 'whitelistadd', description: 'Adds a user to the whitelist. (Admin only)' },
            { name: 'whitelistremove', description: 'Removes a user from the whitelist. (Admin only)' },
            { name: 'ban', description: 'Bans a user for a specified time with a reason. (Admin only)' }
        ];

        // Create the embed message
        const embed = new EmbedBuilder()
            .setColor('#0fffd3')
            .setTitle('Help - Command List')
            .setDescription('Here are the available commands:')
            .addFields(commands.map(cmd => ({
                name: `L!${cmd.name}`,
                value: cmd.description
            })))
            .setFooter({ text: 'Use L!commandname for more details on each command.' });

        // Send the embed message
        await message.channel.send({ embeds: [embed] });
    }
};
