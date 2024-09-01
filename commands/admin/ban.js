const { PermissionsBitField } = require('discord.js');
const ms = require('ms'); // For time formatting

module.exports = {
    name: 'ban',
    description: 'Bans a user for a specified time with a reason.',
    async execute(message, args, db) {
        // Check if the user has the permission to ban members
        if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return message.reply('You do not have permission to use this command.');
        }

        // Get the user to ban
        const user = message.mentions.users.first() || await message.client.users.fetch(args[0]);
        if (!user) return message.reply('Please provide a valid user.');
        
        // Get the time and reason for the ban
        const time = args[1];
        const reason = args.slice(2).join(' ') || 'No reason provided';

        // Check if the time is valid
        if (!time || !ms(time)) return message.reply('Please provide a valid time format (e.g., 10m, 1h).');

        // Check if the user is a member of the guild
        const member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('The user is not a member of this server.');

        try {
            // Ban the user
            await member.ban({ reason });
            message.reply(`Banned ${user.tag} for ${time} with reason: ${reason}`);
            
            // Unban the user after the specified time
            setTimeout(async () => {
                try {
                    await message.guild.members.unban(user.id);
                    message.channel.send(`${user.tag} has been unbanned.`);
                } catch (error) {
                    console.error('Failed to unban the user:', error);
                    message.channel.send(`Failed to unban ${user.tag}.`);
                }
            }, ms(time));
        } catch (error) {
            console.error('Error banning the user:', error);
            message.reply('There was an error trying to ban the user.');
        }
    }
};
