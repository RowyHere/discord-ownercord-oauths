/* Core Modules */
const Discord = require('discord.js')
const client = global.client

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')
const Manage = require('../Database/OwnerCord_Manager')

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        if (!guild || !guild?.available) return;

        try {
            //? Check if the bot is blacklisted in the server.
            let Management = await Manage.findOne({ id: global.managerID })
            let Data = await Bots.findOne({ id: client.user.id })
            if(Management.Blacklist_Server.length > 0) {
                if(Management.Blacklist_Server.includes(guild.id)) {
                  await Bots.findOneAndUpdate({ id: client.user.id }, { $pull: { AuthoriseServer: guild.id }}, { upsert: true })
                  console.log(`🔱 ${client.user.username}: ${guild.name} (${guild.id}) verisi karalistede ekli olduğu için çıkartıldı. (Events/guildCreate.js)`)

                    await guild.leave()
                    if(Data && Data?.Log_Command) {
                        let webhook = new Discord.WebhookClient({ url: Data?.Log_Command })
                        if(!webhook) return;
                
                        webhook.send({
                            username: global.client.user.username,
                            avatarURL: global.client.user.avatarURL(),
                            embeds: [
                                new Discord.EmbedBuilder()
                                .setColor('#2c2c34')
                                .setTitle(`${global.client.user.username} - Blacklist Server`)
                                .setDescription(`\`⚠️\` Your bot has been added to blacklisted **${guild.name}** (**${guild.id}**) server.\n- [If you think this is a problem, please contact admin.](https://discord.gg/oauths)`)
                                .setFooter({
                                    text: `Powered by OwnerCord`
                                })
                                .setTimestamp()
                            ]
                        })
                        
                        return;
                }

                }
            }

            if(Data?.Owners == guild.ownerId && !Data?.AuthoriseServer?.includes(guild.id)) {
                await Bots.findOneAndUpdate({ id: client.user.id }, { $push: { AuthoriseServer: guild.id }}, { upsert: true })
                return console.log(`🔱 ${client.user.username}: ${guild.name} (${guild.id}) verisi kaydetildi. (Event/guildCreate.js)`)
            }
            if(Data?.AuthoriseServer && !Data?.AuthoriseServer?.includes(guild.id)){
                await guild.leave()
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
                            .setDescription(`\`⚠️\` Your bot has been added to unauthorized **${guild.name}** (**${guild.id}**) server.`)
                            .setFooter({
                                text: `Powered by OwnerCord`
                            })
                            .setTimestamp()
                        ]
                    })
                    }
                    return;
            }
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
                    .setDescription(`\`⚠️\` Your bot has been added to authorized **${guild.name}** (**${guild.id}**) server.`)
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
