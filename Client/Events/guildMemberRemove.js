/* Core Modules */
const Discord = require('discord.js')
const client = global.client

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

module.exports = {
    name: 'guildMemberRemove',
    async execute(member) {

        let Data = await Bots.findOne({ id: client.user.id })
        let uData = await Auths.findOne({ id: member.user.id, bot: client.user.id })
        let Joiner = Data?.Features?.find(x => x.Joiner)?.Joiner
        if(!Joiner?.force_member || !uData) return;

        let gData = client.guilds.cache.get(Data?.Features[0] && Data?.Features[0]?.Joiner.guild)
        if(!gData) return;

        let webhook = new Discord.WebhookClient({ url: Data.Log_Command })
        if(!webhook) return;

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setTitle(`${client.user.username} - Force Member`)
        .setFooter({
            text: `Powered by OwnerCord`
        })
        .setTimestamp()

        try {
            await gData.members.add(member.user.id, { accessToken: uData.access_token })
            await webhook.send({
                username: client.user.username,
                avatarURL: client.user.avatarURL(),
                embeds: [embed.setDescription(`\`🔱\` User **${member.user.username}** was successfully added back to server **${gData.name}**.`)]
            })
        } catch (error) {
            await webhook.send({
                username: client.user.username,
                avatarURL: client.user.avatarURL(),
                embeds: [embed.setDescription(`\`🔱\` User **${member.user.username}** could not be added back to server **${gData.name}**.`)]
            })
        }

    }
}