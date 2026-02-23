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
    
        async function fetchOwnerUsernames() {
        const ownerUsernames = [];
        
        for (const userId of global.owners) {
            try {
            const user = await client.users.fetch(userId);
            ownerUsernames.push(`${user.username}`);
            } catch (error) {
            }
        }
        
        return `${ownerUsernames.join(", ")}`
        }

        async function fetchOwnerUsernames23() {
            const ownerUsernames = [];
          
            for (const userId of global.owners) {
              try {
                const user = await client.users.fetch(userId);
                ownerUsernames.push(`[\`${user.username}\`](https://lookup.guru/${userId})`);
              } catch (error) {
              }
            }
          
            return `${ownerUsernames.join(", ")}`
          }

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
                            [${color.magenta("#")}] ${color.white("Bot Owners:")}      ${color.red(`${await fetchOwnerUsernames()}`)}

                            [${color.blue("+")}] ${color.white("Settings Views:")}
                            [${color.magenta("#")}] ${color.white("Redirect URI:")}    ${color.red(`${global.redirecturi}`)}
                            [${color.magenta("#")}] ${color.white("Redirect Port:")}   ${color.red(`${global.redirecturi.replace("/callback", "").split(":")[2] === "80" ? `80 ${color.green("Default Port")}` : global.redirecturi.replace("/callback", "").split(":")[2]}`)}\n`)

console.log(`${color.yellow("------------------------")} ${color.white("https://github.com/RowyHere/")} ${color.cyan("&")} ${color.white("https://github.com/iLxlo/")} ${color.yellow("-------------------------")} `)
        

          let updatePresence = async () => {

            let Core = await Bots.findOne({ id: client.user.id })

            client.user.setPresence({ activities: [{
              name: Core?.Status[0].name.replace("-username-", client.user.username),
            }],
            status: Core?.Status[0].status
            })
  
          }

        setTimeout(() => {
          updatePresence()
        }, 5 * 1000)

    }
}
