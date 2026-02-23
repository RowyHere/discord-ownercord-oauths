/* Core Modules */
const Discord = require('discord.js')

/* Database Modules */
const Bots = require('../Database/OwnerCord_Bots')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        
        if (interaction.isChatInputCommand()) {
        
        const command = global.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction, interaction.client);
        } catch (error) {
            console.log(error)
        }
        } else if(interaction.isAutocomplete()) {
            const command = global.commands.get(interaction.commandName);
            if (!command) return;
    
            try {
                await command.autocomplete(interaction, interaction.client);
            } catch (error) {
                console.log(error)
            }
        }
    }
}