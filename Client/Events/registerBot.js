/* Core Modules */
const Discord = require('discord.js')
const Request = require('../Utils/Request')
const request = new Request()

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

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
        if(!Data) {
          new Bots({
            id: client.user.id,
            Token: client.token,
            Owners: global.owners[0],
            Status: [{
              name: "Verification of -username-",
              idle: "idle"
            }]
          }).save().catch(() => {
            console.log("An error occured while creating bot, Code error: 0x0007")
          })
        }
        
        //! If the bot has data and there is no token or owner, it saves data.
        if(Data && !Data?.Token) await Bots.findOneAndUpdate({ id: client.user.id }, { $set: { Token: client.token }}, { upsert: true })
        if(Data && !Data?.Owners) await Bots.findOneAndUpdate({ id: client.user.id }, { $set: { Owners: global.owners[0] }}, { upsert: true })
     
    }
}
