const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'leaderboard',
    description: 'Displays a leaderboard of users with their earnings.',
    async execute(message, args, db) {
        // Create the embed message
        const embed = new EmbedBuilder()
            .setColor('#0fffd3')
            .setTitle('Leaderboard')
            .setDescription('Choose an option to view the leaderboard:\n\n- **All Users**: View the earnings of all users in all servers.\n- **Current Server**: View the earnings of users in the current server.');

        // Create buttons
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('all_users')
                    .setLabel('All Users')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('current_server')
                    .setLabel('Current Server')
                    .setStyle(ButtonStyle.Secondary)
            );

        // Send the embed with buttons
        await message.channel.send({ embeds: [embed], components: [row] });
    },
};
