module.exports = {
  name: 'join',
  description: 'Join a voice channel!',
  player: false,
  inVoiceChannel: true,
  sameVoiceChannel: false,
  owner: true,
  async execute(message, args) {
    const { client, member, guild, channel } = message;

    // Check if the member is in a voice channel
    const userVoiceChannel = member.voice.channel;
    if (!userVoiceChannel && !args.length) {
      return message.reply('You need to be in a voice channel or provide a channel ID to use this command!');
    }

    // Resolve the target channel
    let targetChannel = userVoiceChannel; // Default to user's voice channel
    if (args.length) {
      const channelIdentifier = args.join(' ');
      targetChannel = guild.channels.cache.get(channelIdentifier) || 
        guild.channels.cache.find((ch) => ch.name === channelIdentifier && ch.type === 'GUILD_VOICE');

      if (!targetChannel) {
        return message.reply(`Could not find a voice channel with ID or name "${channelIdentifier}".`);
      }
    }

    // Check if the target channel is a voice channel
    if (targetChannel.type !== 'GUILD_VOICE') {
      return message.reply('The specified channel is not a voice channel!');
    }

    // Create a player for the target channel
    const player = client.manager.create({
      guild: guild.id,
      voiceChannel: targetChannel.id,
      textChannel: channel.id,
      volume: 80,
      selfDeafen: true,
    });

    // Connect the player if it's not already connected
    if (player && player.state !== 'CONNECTED') {
      player.connect();
      message.reply(`<:Weed_Pink:1339014890106523708> **Joined the voice channel **: ${targetChannel.name}`);
    } else {
      message.reply('<:Weed_Pink:1339014890106523708> **Already connected to a voice channel**');
    }
  },
};
