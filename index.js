const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('Bot Is Working Well!'));
app.listen(port, () => console.log(`listening at http://localhost:${port}`));

// Bot setup
const { Client, Collection } = require('discord.js-selfbot-v13');
const { joinVoiceChannel } = require('@discordjs/voice');
const client = new Client({ checkUpdate: false });

const fs = require('fs');
const { Manager } = require('erela.js');
const Spotify = require('erela.js-spotify');
const { 
  token,
  ownerid,
  nodes,
  SpotifyID,
  SpotifySecret,
  userToReact,
  emoji,
  trackedUser
} = require('./config.json');

if (!token || !ownerid) {
    console.log('Please Fill Out Config file');
    process.exit();
}

// Setting up the manager
client.manager = new Manager({
  nodes: nodes,
  plugins: [
    new Spotify({
      clientID: SpotifyID,
      clientSecret: SpotifySecret
    }),
  ],
  send(id, payload) {
    const guild = client.guilds.cache.get(id);
    if (guild) guild.shard.send(payload);
  },
});

client.commands = new Collection();
this.aliases = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const command = require(`./Commands/${file}`);
  client.commands.set(command.name, command);
}

// Load events
fs.readdirSync('./events/Client/').forEach(file => {
  const event = require(`./events/Client/${file}`);
  client.on(event.name, (...args) => event.execute(client, ...args));
});

fs.readdirSync('./events/Lavalink/').forEach(file => {
  const event = require(`./events/Lavalink/${file}`);
  let eventName = file.split('.')[0];
  client.manager.on(eventName, event.bind(null, this));
});

// Handle bot ready
client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);
  await client.user.setStatus('online');
  client.user.setActivity('Blade ♡', {
    type: 'STREAMING',
    url: 'https://www.twitch.tv/leekbeats'
  });
});

// Auto-react feature
client.on('messageCreate', async (message) => {
  if (message.author.id === userToReact) {
    try {
      await message.react(emoji);
    } catch (error) {
      console.error('Failed to react:', error);
    }
  }

  // Send message command
  if (message.content.startsWith('send ') && message.author.id === ownerid) {
    const msgToSend = message.content.slice(5);
    if (!msgToSend) return message.reply('❌ Please provide a message to send.');
    try {
      await message.channel.send(msgToSend);
      message.reply('✅ Message sent successfully.');
    } catch (error) {
      console.error('Failed to send message:', error);
      message.reply('❌ Failed to send message due to an error.');
    }
  }
});

// Voice channel join tracking
client.on('voiceStateUpdate', async (oldState, newState) => {
  if (newState.member?.id === trackedUser && newState.channelId && oldState.channelId !== newState.channelId) {
    try {
      const connection = joinVoiceChannel({
        channelId: newState.channelId,
        guildId: newState.guild.id,
        adapterCreator: newState.guild.voiceAdapterCreator,
        selfDeaf: false,
      });
      console.log(`Joined ${newState.channel.name} to follow user ${trackedUser}`);
    } catch (error) {
      console.error('Failed to join voice channel:', error);
    }
  }
});

// Handle unhandled rejections
process.on('unhandledRejection', (reason, promise) => {
  try {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason.stack || reason);
  } catch {
    console.error(reason);
  }
});

// Log in the bot
client.login(token);
