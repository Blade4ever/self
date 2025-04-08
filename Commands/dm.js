module.exports = {
    name: 'dm',
    description: 'Send a direct message to a user!',
    owner: true,
    async execute(message, args) {
      if (!args.length) {
        return message.reply('You need to specify a user ID and a message!');
      }
  
      const userId = args.shift();
      const dmMessage = args.join(' ');
  
      if (!dmMessage) {
        return message.reply('You need to provide a message to send!');
      }
  
      try {
        const user = await message.client.users.fetch(userId);
        if (!user) {
          return message.reply('Could not find a user with that ID!');
        }
  
        // Check if the bot (or self-bot) can send DMs to the user
        const dmChannel = await user.createDM().catch(() => null);
        if (!dmChannel) {
          return message.reply('Failed to send the message. The user may have DMs disabled or has blocked you.');
        }
  
        await user.send(dmMessage);
        message.reply(`Message successfully sent to <@${user.id}>!`);
      } catch (error) {
        console.error("DM Error:", error);
        message.reply(`Failed to send DM: ${error.message}`);
      }
    },
  };
  