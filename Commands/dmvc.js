module.exports = {
    name: 'dmvc',
    description: 'Send a direct message to all users in your voice channel!',
    owner: true,
    async execute(message, args) {
      if (!args.length) {
        return message.reply('You need to specify a message to send!');
      }
  
      const dmMessage = args.join(' ');
  
      if (!dmMessage) {
        return message.reply('You need to provide a message to send!');
      }
  
      // Get the voice channel the user is in
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply('You need to be in a voice channel to use this command!');
      }
  
      // Get all members in the voice channel
      const members = voiceChannel.members;
  
      if (members.size === 0) {
        return message.reply('There are no members in the voice channel!');
      }
  
      // Send DM to all members in the voice channel
      let successCount = 0;
      let failureCount = 0;
  
      for (const [memberId, member] of members) {
        try {
          // Check if the bot can send DM to the user
          const dmChannel = await member.createDM().catch(() => null);
          if (!dmChannel) {
            failureCount++;
            continue; // Skip if the bot can't DM the user
          }
  
          await member.send(dmMessage);
          successCount++;
        } catch (error) {
          console.error("DM Error:", error);
          failureCount++;
        }
      }
  
      // Provide feedback on the success/failure of the operation
      message.reply(`Successfully sent messages to ${successCount} members. Failed to send messages to ${failureCount} members.`);
    },
  };
  