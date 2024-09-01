module.exports = {
    name: 'kick',
    description: 'Kicks a user with a reason.',
    async execute(message, args, db) {
        if (!message.member.permissions.has('KICK_MEMBERS')) {
            return message.reply('You do not have permission to use this command.');
        }

        const user = message.mentions.users.first() || await message.client.users.fetch(args[0]);
        if (!user) return message.reply('Please provide a valid user.');

        const reason = args.slice(1).join(' ') || 'No reason provided';

        const member = message.guild.members.cache.get(user.id);
        if (!member) return message.reply('The user is not a member of this server.');

        try {
            await member.kick(reason);
            message.reply(`Kicked ${user.tag} with reason: ${reason}`);
        } catch (error) {
            console.error(error);
            message.reply('There was an error trying to kick the user.');
        }
    }
};
