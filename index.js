const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
require('dotenv').config(); // Load environment variables

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.DirectMessages, 
        GatewayIntentBits.MessageContent // Required to read message content
    ], 
    partials: [Partials.Channel]
});

client.commands = new Collection();
client.adminCommands = new Collection();

const db = new sqlite3.Database('./database.sqlite');

// Initialize the database with tables if they don't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, username TEXT, coins INTEGER, items TEXT, server_id TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS blacklist (id TEXT PRIMARY KEY)");
    db.run("CREATE TABLE IF NOT EXISTS store (item_id INTEGER PRIMARY KEY AUTOINCREMENT, item_name TEXT, price INTEGER)");
});

// Load all normal commands
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.log(`Loaded command: ${command.name}`); // Debugging log
}

// Load all admin commands
const adminCommandFiles = fs.readdirSync('./commands/admin').filter(file => file.endsWith('.js'));
for (const file of adminCommandFiles) {
    const command = require(`./commands/admin/${file}`);
    client.adminCommands.set(command.name, command);
    console.log(`Loaded admin command: ${command.name}`); // Debugging log
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setActivity('Type L!help for commands', { type: 'PLAYING' });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Define command prefix
    const prefix = 'L!';

    // Check if message starts with the prefix
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const commandName = args.shift().toLowerCase();

    console.log(`Command received: ${commandName}`); // Debugging log

    // Handle bypass command separately
    if (commandName === 'bypass') {
        const bypassCommand = client.adminCommands.get('bypass');
        if (bypassCommand) {
            try {
                await bypassCommand.execute(message, args);
                console.log(`Executed bypass command: ${args[0]}`); // Debugging log
            } catch (error) {
                console.error(error);
                message.reply('There was an error executing that command!');
            }
        }
        return;
    }

    // Handle admin commands
    if (client.adminCommands.has(commandName)) {
        const command = client.adminCommands.get(commandName);
        try {
            await command.execute(message, args, db);
            console.log(`Executed admin command: ${commandName}`); // Debugging log
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
        return;
    }

    // Handle normal commands
    if (client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        try {
            await command.execute(message, args, db);
            console.log(`Executed command: ${commandName}`); // Debugging log
        } catch (error) {
            console.error(error);
            message.reply('There was an error executing that command!');
        }
    } else {
        console.log(`Command not found: ${commandName}`); // Debugging log
    }
});

// Handle button interactions
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    const { customId } = interaction;
    if (customId === 'all_users') {
        // Query the database for all users' earnings
        db.all("SELECT username, coins FROM users ORDER BY coins DESC", [], (err, rows) => {
            if (err) {
                console.error(err.message);
                interaction.reply('There was an error fetching the leaderboard data.');
                return;
            }

            let leaderboard = 'All Users Leaderboard:\n\n';
            rows.forEach((row, index) => {
                leaderboard += `${index + 1}. **${row.username}**: ${row.coins} coins\n`;
            });

            if (leaderboard === 'All Users Leaderboard:\n\n') {
                leaderboard = 'No users found in the leaderboard.';
            }

            // Send the leaderboard
            interaction.reply({ content: leaderboard, ephemeral: true });
        });

    } else if (customId === 'current_server') {
        // Query the database for users' earnings in the current server
        const guildId = interaction.guildId;
        db.all("SELECT username, coins FROM users WHERE id IN (SELECT id FROM users WHERE server_id = ?) ORDER BY coins DESC", [guildId], (err, rows) => {
            if (err) {
                console.error(err.message);
                interaction.reply('There was an error fetching the leaderboard data.');
                return;
            }

            let leaderboard = 'Current Server Leaderboard:\n\n';
            rows.forEach((row, index) => {
                leaderboard += `${index + 1}. **${row.username}**: ${row.coins} coins\n`;
            });

            if (leaderboard === 'Current Server Leaderboard:\n\n') {
                leaderboard = 'No users found in this server leaderboard.';
            }

            // Send the leaderboard
            interaction.reply({ content: leaderboard, ephemeral: true });
        });
    }
});

// Log in to Discord with the bot token from .env file
client.login(process.env.BOT_TOKEN);
