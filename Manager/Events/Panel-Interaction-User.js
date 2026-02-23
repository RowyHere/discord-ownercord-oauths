/* Core Modules */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Manager = require('../Database/OwnerCord_Manager')
const Auths = require('../Database/OwnerCord_Auths')

/* Core Utils Modules */
const randomstring = require('randomstring')
const axios = require('axios')
const children = require('child_process');

/* Core Utils Procces */
let clients = new Map()
let maxOwner = 3

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setFooter({
          text: `Powered by OwnerCord`
        })
        .setTimestamp()

        async function fetchOwnerUsernames(Data) {
            if(!Data) return;
            const ownerUsernames = [];
            
            for (const userId of Data?.Whitelist_Owners) {
                try {

                const user = await client.users.fetch(userId);
                ownerUsernames.push(` - ${user.globalName ?? user.username} (\`${user.id}\`)`);
                } catch (error) {
                    console.log(error)
                }
            }
            
            return `${ownerUsernames.join("\n")}`
        }

        //? String Select Menu için.

        if(interaction.isStringSelectMenu()) {
            
            if(interaction.customId === `${interaction.user.id}-bot`) {

                embed.setTitle("OwnerCord - User Control")

                let selectedBotId = interaction.values[0]
                clients.set(interaction.user.id, selectedBotId)

                let _bot = await interaction.client.users.fetch(selectedBotId)
                let _bot_name = _bot?.username || 'Unknown Bot'

                let BotData = await Bots.findOne({ id: selectedBotId })

                let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-switchkey`)
                    .setLabel("Switch Key")
                    .setEmoji("🔐")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(BotData && BotData.switchKey == null || !BotData.switchKey ? false : true),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-ownerwhitelist`)
                    .setLabel("Owner Whitelist")
                    .setEmoji("👥")
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-botsettings`)
                    .setLabel("Bot Settings")
                    .setEmoji("🤖")
                    .setStyle(Discord.ButtonStyle.Secondary)
                )

                interaction.update({ components: [row], embeds: [embed.setDescription(`
                Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${_bot_name}**) bot.
                
                - \`🔐\` ${BotData && BotData.switchKey == null || !BotData.switchKey ? `Switch Key` : ` Switch Key (Created)`}${BotData && BotData.switchKey == null || !BotData.switchKey ? `\n - \`🔱\` There is no switch key in the **${_bot_name}** bot. Please create the switch key.` : "" }
                - \`👥\` Owner Whitelist
                ${BotData && BotData.Whitelist_Owners?.length > 0 ? await fetchOwnerUsernames(BotData) : " - \`🔱\` There is no data in the database."}
                - \`🤖\` Bot Settings`)]})

            }

        }

        //? Button için
        if(interaction.isButton()) {
             
            //? Switch key sistemi
            if(interaction.customId === `${interaction.user.id}-switchkey`) {

                let selectedBotId = clients.get(interaction.user.id)

                let key = `OC-${randomstring.generate(16)}`

                let updateRow = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-switchkey`)
                    .setLabel("Switch Key")
                    .setEmoji("\🔐")
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(true),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-ownerwhitelist`)
                    .setLabel("Owner Whitelist")
                    .setEmoji("👥")
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-botsettings`)
                    .setLabel("Bot Settings")
                    .setEmoji("🤖")
                    .setStyle(Discord.ButtonStyle.Secondary)
                )

               //! console.log(interaction.message.embeds[0].description)
                
               //! console.log(interaction.message.components[0].components[0])
                    
               let _bot = await interaction.client.users.fetch(selectedBotId)
               let _bot_name = _bot?.username || 'Unknown Bot'
               let BotData = await Bots.findOne({ id: selectedBotId })

               await Bots.findOneAndUpdate({ id: selectedBotId }, { switchKey: key }, { upsert: true })

               await interaction.update({ components: [updateRow], embeds: [embed.setDescription(`
               Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${_bot_name}**) bot.
               
               - \`🔐\` Switch Key (Created)
               - \`👥\` Owner Whitelist
               ${BotData && BotData.Whitelist_Owners?.length > 0 ? await fetchOwnerUsernames(BotData) : " - \`🔱\` There is no data in the database."}
               - \`🤖\` Bot Settings`)]})

               interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`Hello ${interaction.member} 👋, you are curenntly **managing and overseeing** the <@${_bot.id}> (**${_bot_name}**) bot.\n\n- \`🔐\` ||${key}||\n\n\`🔱\` Please save this **switch key** and do not share it with anyone else.`)]})

            }

            //? Owner Whitelist
            if(interaction.customId === `${interaction.user.id}-ownerwhitelist`) {

                let selectedBotId = clients.get(interaction.user.id)
                let _bot = await interaction.client.users.fetch(selectedBotId)
                let _bot_name = _bot?.username || 'Unknown Bot'

                const modals = new Discord.ModalBuilder()
                .setCustomId(`${interaction.user.id}-modalwhitelist`)
                .setTitle(`Owner Whitelist`)

                const enterID = new Discord.TextInputBuilder()
                .setCustomId('ownerid')
                .setLabel("Enter a id")
                .setStyle(Discord.TextInputStyle.Short);

                let row = new Discord.ActionRowBuilder().addComponents(enterID)
                modals.addComponents(row)

                await interaction.showModal(modals)

            }

            //? Bot Settings
            if(interaction.customId === `${interaction.user.id}-botsettings`) {

                let selectedBotId = clients.get(interaction.user.id)

                let _bot = await interaction.client.users.fetch(selectedBotId)
                let _bot_name = _bot?.username || 'Unknown Bot'

                let row = new Discord.ActionRowBuilder()
                .addComponents(
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-botname`)
                    .setLabel("Bot Name")
                    .setEmoji("📝")
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-botavatar`)
                    .setLabel("Bot Avatar")
                    .setEmoji("🎨")
                    .setStyle(Discord.ButtonStyle.Secondary),
                    new Discord.ButtonBuilder()
                    .setCustomId(`${interaction.user.id}-botrestart`)
                    .setLabel("Bot Restart")
                    .setEmoji("🔄")
                    .setStyle(Discord.ButtonStyle.Secondary)
                )

                interaction.update({ components: [row], embeds: [embed.setDescription(`Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${_bot_name}**) bot.
                
                \`⚠️\` Please update the bot name and avatar **every 12 hours**, otherwise your bot will be **permanently blocked** from our system.
                
                - \`📝\` Bot Name\n - Make an update every 12 hours.
                - \`🎨\` Bot Avatar\n - Make an update every 12 hours.
                - \`🔄\` Bot Restart\n - The restart process may take an average of 3 minutes.`)]})

            }

            //? Bot Name
            if(interaction.customId === `${interaction.user.id}-botname`) {

                const modals = new Discord.ModalBuilder()
                .setCustomId(`${interaction.user.id}-changename`)
                .setTitle(`Bot Name`)

                const enterID = new Discord.TextInputBuilder()
                .setCustomId('botname')
                .setLabel("Write a bot name")
                .setStyle(Discord.TextInputStyle.Short);

                let row = new Discord.ActionRowBuilder().addComponents(enterID)
                modals.addComponents(row)

                await interaction.showModal(modals)

            }
            
            //? Bot Avatar
            if(interaction.customId === `${interaction.user.id}-bot`) {

                const modals = new Discord.ModalBuilder()
                .setCustomId(`${interaction.user.id}-changeavatar`)
                .setTitle(`Bot Avatar`)

                const enterID = new Discord.TextInputBuilder()
                .setCustomId('botavatar')
                .setLabel("Write a bot avatar url")
                .setStyle(Discord.TextInputStyle.Short);

                let row = new Discord.ActionRowBuilder().addComponents(enterID)
                modals.addComponents(row)

                await interaction.showModal(modals)

            }
            
            //? Bot Restart
            if(interaction.customId === `${interaction.user.id}-botrestart`) {

                let selectedBotId = clients.get(interaction.user.id)

                let _bot = await interaction.client.users.fetch(selectedBotId)
                let _bot_name = _bot?.username || 'Unknown Bot'

                children.exec(`pm2 restart "OwnerCord-${selectedBotId}"`)

                interaction.reply({ ephemeral: true, embeds: [embed.setDescription(`\`✅\` The **${_bot_name}** bot has been successfully restarted, this may take a few minutes.`)]})

            }

        }

        //? Modals için
        if(interaction.isModalSubmit()) {
            //? Owner Whitelist Modal
            if(interaction.customId === `${interaction.user.id}-modalwhitelist`) {

                let selectedBotId = clients.get(interaction.user.id)
                let _bot = await interaction.client.users.fetch(selectedBotId)
                let _bot_name = _bot?.username || 'Unknown Bot'

                let selectedUserId = interaction.fields.getTextInputValue("ownerid")
                
                let Data = await Bots.findOne({ id: selectedBotId })

                try {

                let _user = await interaction.client.users.fetch(selectedUserId)

                if(Data.Whitelist_Owners.includes(_user.id)) await Bots.findOneAndUpdate({ id: selectedBotId }, { $pull: { Whitelist_Owners: _user.id } }, { upsert: true })
                else await Bots.findOneAndUpdate({ id: selectedBotId }, { $push: { Whitelist_Owners: _user.id } }, { upsert: true })
                
                //? new checking data
                Data = await Bots.findOne({ id: selectedBotId })

                await interaction.update({ embeds: [embed.setDescription(`
                Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${_bot_name}**) bot.
                
                - \`🔐\` ${Data && Data.switchKey == null || !Data.switchKey ? `Switch Key` : ` Switch Key (Created)`}${Data && Data.switchKey == null || !Data.switchKey ? `\n - \`🔱\` There is no switch key in the **${_bot_name}** bot. Please create the switch key.` : "" }
                - \`👥\` Owner Whitelist
                ${Data && Data.Whitelist_Owners?.length > 0 ? await fetchOwnerUsernames(Data) : " - \`🔱\` There is no data in the database."}
                - \`🤖\` Bot Settings`)]})
                                    
                interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Owner Whitelist`).setDescription(`${Data.Whitelist_Owners.includes(selectedUserId) ? `\`✅\` **${_user.globalName ?? _user?.username}** successfully added owner whitelist.` : `\`❌\` **${_user.globalName ?? _user.username}** was successfully removed from owner whitelist.`}`)]})
                
                } catch (error) {
                    if(error.code === 10013) {
                        return interaction.reply({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Owner Whitelist`).setDescription(`\`❌\` The specified member could not be found.`)]})
                    } else {
                        console.log(error)
                    }
                }

            }

            //? Bot Name
            if(interaction.customId === `${interaction.user.id}-changename`) {

                let selectedBotId = clients.get(interaction.user.id)

                let Data = await Bots.findOne({ id: selectedBotId })

                let newUsername = interaction.fields.getTextInputValue("botname")
                
                axios.patch(
                    'https://discord.com/api/v10/users/@me',
                    {
                      username: newUsername
                    },
                    {
                      headers: {
                        'Authorization': `Bot ${Data.Token}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(async response => {
                    if (response.status === 200) {
                        await interaction.update({ embeds: [embed.setDescription(`Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${newUsername}**) bot.
                
                        \`⚠️\` Please update the bot name and avatar **every 12 hours**, otherwise your bot will be **permanently blocked** from our system.
                        
                        - \`📝\` Bot Name\n - Make an update every 12 hours.
                        - \`🎨\` Bot Avatar\n - Make an update every 12 hours.
                        - \`🔄\` Bot Restart\n - The restart process may take an average of 3 minutes.`)]})

                        interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`✅\` The bot name has been successfully set to **${newUsername}**`)]})
                    } else {
                        interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` There was a problem while setting the bot name. Contact the support team!`)]})
                    }
                  })
                  .catch(error => {
                    interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` There was a problem while setting the bot name. Contact the support team!`)]})
                   });

            }
            
            //? Bot Avatar
            if(interaction.customId === `${interaction.user.id}-changeavatar`) {

                let selectedBotId = clients.get(interaction.user.id)

                let Data = await Bots.findOne({ id: selectedBotId })

                let imageURI = interaction.fields.getTextInputValue("botavatar")
                

                const fetchImageAsBase64 = async (url) => {
                    const response = await axios.get(url, { responseType: 'arraybuffer' });
                    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
                    return `data:image/png;base64,${base64Image}`;
                };

                let base64Image = await fetchImageAsBase64(imageUrl);

                await axios.patch(
                    'https://discord.com/api/v10/users/@me',
                    {
                        avatar: base64Image
                    },
                    {
                      headers: {
                        'Authorization': `Bot ${Data.Token}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  )
                  .then(async response => {
                    if (response.status === 200) {
                        await interaction.update({ embeds: [embed.setDescription(`Hello ${interaction.member} 👋 You are currently viewing the <@${selectedBotId}> (**${newUsername}**) bot.
                
                        \`⚠️\` Please update the bot name and avatar **every 12 hours**, otherwise your bot will be **permanently blocked** from our system.
                        
                        - \`📝\` Bot Name\n - Make an update every 12 hours.
                        - \`🎨\` Bot Avatar\n - Make an update every 12 hours.
                        - \`🔄\` Bot Restart\n - The restart process may take an average of 3 minutes.`)]})

                        interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`✅\` The bot avatar has been successfully adjusted.`).setImage(imageURI)]})
                    } else {
                        interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` There was a problem while setting the bot avatar. Contact the support team!`)]})
                    }
                  })
                  .catch(error => {
                    interaction.followUp({ ephemeral: true, embeds: [embed.setDescription(`\`❌\` There was a problem while setting the bot avatar. Contact the support team!`)]})
                   });

            }
        }

    }
}