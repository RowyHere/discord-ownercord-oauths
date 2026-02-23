/* Core Modules */
const Discord = require('discord.js')
const client = global.client

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

module.exports = {
    name: 'guildDelete',
    async execute(guild) {

        if (!guild || !guild?.available) return;
        
        try {
            let Data = await Bots.findOne({ id: client.user.id })

            if(Data?.AuthoriseServer && Data?.AuthoriseServer?.includes(guild.id)) {
            if(Data && Data?.Log_Command) {
            let webhook = new Discord.WebhookClient({ url: Data?.Log_Command })
            if(!webhook) return;
    
                webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor('#2c2c34')
                        .setTitle(`${global.client.user.username} - Authorise Server`)
                        .setDescription(`\`⚠️\` Your bot has been removed from the authorized **${guild.name}** (**${guild.id}**) server.`)
                        .setFooter({
                            text: `Powered by OwnerCord`
                        })
                        .setTimestamp()
                    ]
                })
            }
            if(Data?.AuthoriseServer && Data?.AuthoriseServer.includes(guild.id)) await Bots.findOneAndUpdate({ id: client.user.id }, { $pull: { AuthoriseServer: guild.id }}, { upsert: true })
            console.log(`🔱 ${client.user.username}: ${guild} (${guild.id}) verisi silindi. (Events/guildLeave.js)`)
            }
        } catch (error) {
            console.log(error)
        }
    }
}
