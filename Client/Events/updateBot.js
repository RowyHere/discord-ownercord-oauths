/* Core Modules */
const Discord = require('discord.js')
const Request = require('../Utils/Request')
const request = new Request()

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')
const Manage = require('../Database/OwnerCord_Manager')

/* Core Utils Modules */
const { CronJob } = require('cron')
const wait = (ms) => new Promise((res) => setTimeout(res, ms));
const timeBetweenAuths = 1;
const moment = require('moment')
const color = require('colors')

let row = new Discord.ActionRowBuilder()
.addComponents(
  new Discord.ButtonBuilder()
  .setLabel("⭐ Powered by OwnerCord")
  .setStyle(Discord.ButtonStyle.Link)
  .setURL(global.ownercord || "http://youtube.com/RowyHere")
)

module.exports = {
    name: 'ready',
    async execute(client) {

        let Data = await Bots.findOne({ id: client.user.id })

        try {
            
            if(Data && Data.Log_Command) {
                let webhook = new Discord.WebhookClient({ url: Data.Log_Command })
                
                webhook.send({ 
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    content: `@everyone [Read Terms of Service](https://discord.gg/oauths)`,
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor('#2c2c34')
                        .setTitle(`${global.client.user.username} has been restarted!`)
                        .setThumbnail(global.client.user.avatarURL())
                        .setDescription(`New features have been added to our bots, some of the added features are:
                        
                        - There are no new features.`)
                        .setFooter({ 
                            text: `Powered by OwnerCord`
                        })
                        .setTimestamp()
                    ]
                })
            
            }

        } catch (error) {
            
        }


    }
}
