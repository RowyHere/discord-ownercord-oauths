/* Core Modules */
const Discord = require('discord.js')

/* Database Modules */
const Bots = require('../Database/OwnerCord_Bots')
const Auths = require('../Database/OwnerCord_Auths')
const Manager = require('../Database/OwnerCord_Manager')

/* Core Utils Modules */
const fetch = require('node-fetch')
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
        /* for gui */
        async function fetchOwnerUsernames() {
        const ownerUsernames = [];
        
        for (const userId of global.developers) {
            try {
            const user = await client.users.fetch(userId);
            ownerUsernames.push(`${user.username}`);
            } catch (error) {
            }
        }
        
        return `${ownerUsernames.join(", ")}`
        }
        /* for refresh bot holders */
          /* maybe.. */

          let pBot = await Bots.find()
          let pAuths = await Auths.find()

        let title = `
               ██████╗ ██╗    ██╗███╗   ██╗███████╗██████╗      ██████╗ ██████╗ ██████╗ ██████╗
              ██╔═══██╗██║    ██║████╗  ██║██╔════╝██╔══██╗    ██╔════╝██╔═══██╗██╔══██╗██╔══██╗
              ██║   ██║██║ █╗ ██║██╔██╗ ██║█████╗  ██████╔╝    ██║     ██║   ██║██████╔╝██║  ██║
              ██║   ██║██║███╗██║██║╚██╗██║██╔══╝  ██╔══██╗    ██║     ██║   ██║██╔══██╗██║  ██║
              ╚██████╔╝╚███╔███╔╝██║ ╚████║███████╗██║  ██║    ╚██████╗╚██████╔╝██║  ██║██████╔
               ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝     ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝`                               

console.log(`${title}`)
console.log(`${color.yellow("---------------------------------------------")} ${color.white("Rowycim")} ${color.cyan("&")} ${color.white("ilxlo")} ${color.yellow("---------------------------------------------")} `)
console.log(`
                            [${color.blue("+")}] ${color.white("Bot Informations:")}
                            [${color.magenta("#")}] ${color.white("Logged in as:")}    ${color.red(`${client.user?.username}`)}
                            [${color.magenta("#")}] ${color.white("Bot ID:")}          ${color.red(`${client.user?.id}`)}
                            [${color.magenta("#")}] ${color.white("Developers:")}      ${color.red(`${await fetchOwnerUsernames()}`)}

                            [${color.blue("+")}] ${color.white("Auths Informations:")}
                            [${color.magenta("#")}] ${color.white("Bot:")}             ${color.red(`${pBot.length || "0"}`)}
                            [${color.magenta("#")}] ${color.white("Users:")}           ${color.red(`${pAuths.length || "0"}`)}\n`)

console.log(`${color.yellow("------------------------")} ${color.white("https://github.com/RowyHere/")} ${color.cyan("&")} ${color.white("https://github.com/iLxlo/")} ${color.yellow("-------------------------")} `)

        let updatePresence = async () => {

          let gBot = await Bots.find()
          let gAuth = await Auths.find()

          let Bot = gBot.length || 0
          let Auth = gAuth.length || 0

          client.user.setPresence({ activities: [{
            name: `${Bot} bots with a total of ${Auth} oauths`,
            type: Discord.ActivityType.Watching
          }],
          status: "idle"
          })

        }

       // updatePresence()
        setInterval(() => { 
          updatePresence()
        }, 10 * 1000)        

        let Data = await Manager.findOne({ id: client.user.id })
        if(!Data) {
          new Manager({
            id: client.user.id,
            Blacklist_Server: [],
            Blacklist_User: [],
          }).save().catch(() => {
            console.log("Veri oluşturulurken hata meydana geldi. 0x0001")
          })
        }

    }
}
