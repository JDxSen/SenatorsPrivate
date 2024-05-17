const { Client, Intents, Collection } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });
const commands = [];
const vcleaderboard = new Collection(); // Map to store user VC time

client.once('ready', () => {
    console.log('Bot is ready!');
});

client.on('voiceStateUpdate', (oldState, newState) => {
    const userId = newState.member.id;
    const guildId = newState.guild.id;
    if (oldState.channelId === newState.channelId) return; // Ignore mute/deafen changes

    if (oldState.channelId) { // User left voice channel
        const endTime = new Date();
        const startTime = vcleaderboard.get(`${guildId}-${userId}`);
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds
        // Update total time in leaderboard
        vcleaderboard.set(`${guildId}-${userId}`, startTime + duration);
    }

    if (newState.channelId) { // User joined voice channel
        vcleaderboard.set(`${guildId}-${userId}`, new Date()); // Store join time
    }
});

// Command to set up the VC leaderboard
commands.push({
    name: 'setup',
    description: 'Set up the voice channel leaderboard',
    async execute(interaction) {
        // Logic to set up the leaderboard
        await interaction.reply('Voice channel leaderboard set up!');
    },
});

// Command to get user's VC activity
commands.push({
    name: 'user',
    description: 'Get user\'s voice channel activity',
    options: [
        {
            name: 'user',
            type: 'USER',
            description: 'The user to get activity for',
            required: true,
        },
    ],
    async execute(interaction) {
        const user = interaction.options.get('user').user;
        const guildId = interaction.guildId;
        const startTime = vcleaderboard.get(`${guildId}-${user.id}`);
        if (!startTime) {
            await interaction.reply(`${user.username} hasn't joined any voice channels.`);
            return;
        }
        const endTime = new Date();
        const duration = (endTime - startTime) / 1000; // Calculate duration in seconds
        await interaction.reply(`${user.username} has spent ${duration} seconds in voice channels.`);
    },
});

// Register commands with Discord
const rest = new REST({ version: '9' }).setToken('MTI0MDA3MzM3NTk4OTIzOTgyOA.G4E4E-.YxR4sWBvKa30TExUPQOOkGthdRIW9K0QgIZbUY');

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands('1240073375989239828', '869559746347298826'), // Replace with your client ID and guild ID
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();

client.login('MTI0MDA3MzM3NTk4OTIzOTgyOA.G4E4E-.YxR4sWBvKa30TExUPQOOkGthdRIW9K0QgIZbUY'); // Replace with your bot token
