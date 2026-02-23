/* Core Module */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Manager = require('../Database/OwnerCord_Manager')
const Auths = require('../Database/OwnerCord_Auths')

/* Core Utils Module */
const children = require('child_process');

let clients = new Map();

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('panel')
    .setDescription('Panel'),
    async execute(interaction, client) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setFooter({
          text: `Powered by OwnerCord`
        })
        .setTimestamp()

        async function fetchBlacklistUsers(Data) {
            if(!Data) return;
            const ownerUsernames = [];
            
            for (const userId of Data?.Blacklist_User) {
                try {

                const user = await client.users.fetch(userId);
                ownerUsernames.push(` - ${user.globalName ?? user.username} (\`${user.id}\`)`);
                } catch (error) {
                    console.log(error)
                }
            }
            
            return `${ownerUsernames.join("\n")}`
        }

        try {
        if(global.developers.includes(interaction.user.id)) {

            let row = new Discord.ActionRowBuilder()
            .addComponents(
                new Discord.ButtonBuilder()
                .setCustomId("blacklistuser")
                .setEmoji("👮")
                .setLabel("Blacklist User")
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId("blacklistserver")
                .setEmoji("🕵️‍♂️")
                .setLabel("Blacklist Server")
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId("whitelistserver")
                .setEmoji("🔱")
                .setLabel("Whitelist Server")
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId("plan")
                .setEmoji("💎")
                .setLabel("Plan Settings")
                .setStyle(Discord.ButtonStyle.Secondary),
                new Discord.ButtonBuilder()
                .setCustomId("deletebot")
                .setEmoji("🗑️")
                .setLabel("Delete Bot")
                .setStyle(Discord.ButtonStyle.Secondary)
            )

            embed.setTitle(`OwnerCord - Developer Control`)

            let ManageBots = await Manager.findOne({ id: interaction.client.user.id  })

            interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`Hello ${interaction.member} 👋, Welcome to the developer control.
            
            - \`👮\` Blacklist User
            ${ManageBots && ManageBots.Blacklist_User?.length > 0 ? await fetchBlacklistUsers(ManageBots) : ` - \`🔱\` There is no data in the database.`}
            - \`🕵️‍♂️\` Blacklist Server
            ${ManageBots && ManageBots.Blacklist_Server?.length > 0 ? `${ManageBots.Blacklist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`🔱\` Whitelist Server
            ${ManageBots && ManageBots.Whitelist_Server?.length > 0 ? `${ManageBots.Whitelist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`💎\` Plan Settings
             - \`0️⃣\` Free Plan
             - \`1️⃣\` VIP Plan
             - \`2️⃣\` Premium Plan
            - \`🗑️\` Delete Bot
             - \`🔱\` The bot deletes the database.`)], components: [row] })


        } else {

            embed.setTitle(`OwnerCord - User Control`)

            let OwnerBots = await Bots.find({ Owners: interaction.user.id })
            if(!OwnerBots || OwnerBots.length === 0) return interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` The bot you have has not been found.`)]})

            let options = await Promise.all(OwnerBots.map(async (bot) => {

                try {
                    let _bot = await client.users.fetch(bot.id);
                    let _bot_name = _bot?.tag || 'Unknown Bot';
                
                    let _botAuth = await Auths.find({ bot: bot.id })
    
                    let sanitizedValue = `${bot.id}`.slice(0, 25).replace(/[^\w]/g, '');
    
                    if (!sanitizedValue) sanitizedValue = `${bot.id}`.slice(0, 25).replace(/[^\w]/g, '');
    
                    global.shortID.set(sanitizedValue, bot.id)
    
                    return {
                        label: `${_bot_name}`,
                        description: `Auths: ${_botAuth.length}`,
                        value: sanitizedValue,
                    };
    
                } catch (error) {
                    console.log(`Botlar yüklenirken bir hata oluştu Bot ID: ${bot.id}`)
                    return null
                }

            }));

            options = options.filter(option => option !== null);

            let row = new Discord.ActionRowBuilder().addComponents(
                new Discord.StringSelectMenuBuilder()
                    .setCustomId(`${interaction?.user?.id}-bot`)
                    .setPlaceholder(`⚒️ Select a bot.`)
                    .setOptions(options) 
            );

            await interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`🔱\` Select which bot you want to display.`)], components: [row] })

        }
        } catch(err) {
            console.log(err)
        }
    }
}