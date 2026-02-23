/* Core Modules */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Manager = require('../Database/OwnerCord_Manager')
const Auths = require('../Database/OwnerCord_Auths')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setFooter({
          text: `Powered by OwnerCord`
        })
        .setTimestamp()

    }
}