const fs = require('fs');
const { prefix } = require('../config.json'); // Import prefix from config.json

module.exports = {
    name: 'help',
    description: 'List all commands available with descriptions.',
    async execute(message, args) {
        try {
            // Check if the message starts with the prefix and the command name
            if (!message.content.startsWith(prefix) || !message.content.slice(prefix.length).trim().startsWith(this.name)) {
                return;
            }

            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            const commands = commandFiles.map(file => {
                const command = require(`./${file}`);
                return `- **<:devsss:1338998950916522071> ${command.name}**: ${command.description || 'No description provided.'}`;
            });

            const response = `**<:black_rules:1338995254229073941> Available Commands:**\n${commands.join('\n')} `;
            await message.reply(response); // Send a plain text response
        } catch (error) {
            console.error('Error loading commands:', error);
            await message.reply('An error occurred while loading the commands list.');
        }
    },
};
