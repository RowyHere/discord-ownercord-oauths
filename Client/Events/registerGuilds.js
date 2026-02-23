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
    
      const guilds = await client.guilds.fetch()
      let Bot = await Bots.findOne({ id: client.user.id })

      let Management = await Manage.findOne({ id: global.managerID })

      guilds.forEach(async guild => {

        if(Management?.Blacklist_Server.length > 0) {
          if(Management.Blacklist_Server.includes(guild.id)) {
            guild.leave()
            await Bots.findOneAndUpdate({ id: client.user.id }, { $pull: { AuthoriseServer: guild.id }}, { upsert: true })
            console.log(`🔱 ${client.user.username}: ${guild.name} (${guild.id}) verisi karalistede ekli olduğu için otomatik çıkartıldı. (Events/registerGuilds.js)`)
          }
        }

        if(!Bot?.AuthoriseServer?.includes(guild.id)) {
          await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { AuthoriseServer: guild.id }}, { upsert: true })
          console.log(`🔱 ${client.user.username}: ${guild.name} (${guild.id}) verisi kaydetildi. (Events/registerGuilds.js)`)
        }
      })

    }
}
