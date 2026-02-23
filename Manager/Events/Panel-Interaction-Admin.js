/* Core Modules */
const Discord = require('discord.js')

/* Core Database */
const Bots = require('../Database/OwnerCord_Bots')
const Manager = require('../Database/OwnerCord_Manager')
const Auths = require('../Database/OwnerCord_Auths')

let adminBot = new Discord.Collection()
const moment = require('moment')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        .setFooter({
          text: `Powered by OwnerCord`
        })
        .setTimestamp()

        if(!global.developers.includes(interaction.user.id)) return;

        //* Fonksiyonlarım
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

        //? Button için
        if(interaction.isButton()) {
          //? Blacklist User
          if(interaction.customId === "blacklistuser") {
            const modals = new Discord.ModalBuilder()
            .setCustomId(`modalblacklistuser`)
            .setTitle(`Blacklist User`)

            const enterID = new Discord.TextInputBuilder()
            .setCustomId('userid')
            .setLabel("Enter a id")
            .setStyle(Discord.TextInputStyle.Short);

            let row = new Discord.ActionRowBuilder().addComponents(enterID)
            modals.addComponents(row)

            await interaction.showModal(modals)
          }
          //? Blacklist Server
          if(interaction.customId === "blacklistserver") {
            const modals = new Discord.ModalBuilder()
            .setCustomId(`modalblacklistserver`)
            .setTitle(`Blacklist Server`)

            const enterID = new Discord.TextInputBuilder()
            .setCustomId('serverid')
            .setLabel("Enter a server id")
            .setStyle(Discord.TextInputStyle.Short);

            let row = new Discord.ActionRowBuilder().addComponents(enterID)
            modals.addComponents(row)

            await interaction.showModal(modals)
          }
          //? Whitelist Server
          if(interaction.customId === "whitelistserver") {

            const modals = new Discord.ModalBuilder()
            .setCustomId(`modalwhitelistserver`)
            .setTitle(`Whitelist Server`)

            const enterID = new Discord.TextInputBuilder()
            .setCustomId('serverid')
            .setLabel("Enter a server id")
            .setStyle(Discord.TextInputStyle.Short);

            let row = new Discord.ActionRowBuilder().addComponents(enterID)
            modals.addComponents(row)

            await interaction.showModal(modals)

          }
          //? Plan Settings
          if(interaction.customId === "plan") {

            const modals = new Discord.ModalBuilder()
            .setCustomId(`modalplan`)
            .setTitle(`Plan Settings for Bot`)

            const enterID = new Discord.TextInputBuilder()
            .setCustomId('botid')
            .setLabel("Enter a bot id")
            .setStyle(Discord.TextInputStyle.Short);

            let row = new Discord.ActionRowBuilder().addComponents(enterID)
            modals.addComponents(row)

            await interaction.showModal(modals)

          }

          //? Plan Settings with Button
          let startRow = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("VIP")
            .setLabel("VIP Plan")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("Premium")
            .setLabel("Premium Plan")
            .setStyle(Discord.ButtonStyle.Secondary)
          )

          let lifePlan = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("lifeVIP")
            .setLabel("VIP Plan (Life Time)")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("lifePremium")
            .setLabel("Premium Plan (Life Time)")
            .setStyle(Discord.ButtonStyle.Secondary)
          )

          let positiveMonthRow = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("pos1month")
            .setLabel("1 Month")
            .setEmoji("➕")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("pos3month")
            .setLabel("3 Month")
            .setEmoji("➕")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("pos6month")
            .setLabel("6 Month")
            .setEmoji("➕")
            .setStyle(Discord.ButtonStyle.Secondary)
          )

          let negativeMonthRow = new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
            .setCustomId("neg1month")
            .setLabel("1 Month")
            .setEmoji("✖")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("neg3month")
            .setLabel("3 Month")
            .setEmoji("✖")
            .setStyle(Discord.ButtonStyle.Secondary),
            new Discord.ButtonBuilder()
            .setCustomId("neg6month")
            .setLabel("6 Month")
            .setEmoji("✖")
            .setStyle(Discord.ButtonStyle.Secondary)
          )
         

          if(interaction.customId === "VIP") {

            let bot = adminBot.get(interaction.user.id) ?? { username: "Unknown", id: "1234567890"}

            let Data = await Bots.findOne({ id: bot.id })
              
            let user = await interaction.client.users.fetch(Data.Owners)

            await interaction.update({ components: [lifePlan, positiveMonthRow, negativeMonthRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${bot.id}> (**${bot.username}**) bot.
              
            - Bot Name: **${bot.username}**
            - Bot ID: **${bot.id}**
            - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
            - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
            - Bot Plan Expires: ${Data.typeTime === null ? "Life time" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` **VIP** membership was granted to the **${bot.username}**.`)]})

            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { type: "1", typeTime: moment().add(30, "days")}}, { upsert: true })

          }
          if(interaction.customId === "Premium") {

            let bot = adminBot.get(interaction.user.id) ?? { username: "Unknown", id: "1234567890"}

            let Data = await Bots.findOne({ id: bot.id })
              
            let user = await interaction.client.users.fetch(Data?.Owners)

            await interaction.update({ components: [lifePlan, positiveMonthRow, negativeMonthRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${bot.id}> (**${bot.username}**) bot.
              
            - Bot Name: **${bot.username}**
            - Bot ID: **${bot.id}**
            - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
            - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
            - Bot Plan Expires: ${Data.typeTime === null ? "Life time" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` **Premium** membership was granted to the **${bot.username}**.`)]})

            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { type: "2", typeTime: moment().add(30, "days") }}, { upsert: true })

          }

          if(interaction.customId === "lifeVIP") {

            let bot = adminBot.get(interaction.user.id) ?? { username: "Unknown", id: "1234567890"}

            let Data = await Bots.findOne({ id: bot.id })
              
            let user = await interaction.client.users.fetch(Data.Owners)

            await interaction.update({ components: [lifePlan, positiveMonthRow, negativeMonthRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${bot.id}> (**${bot.username}**) bot.
              
            - Bot Name: **${bot.username}**
            - Bot ID: **${bot.id}**
            - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
            - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
            - Bot Plan Expires: ${Data.typeTime === null ? "Life time" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` **VIP** membership was granted to the **${bot.username}**.`)]})

            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { type: "1" }}, { upsert: true })

          }
          if(interaction.customId === "lifePremium") {

            let bot = adminBot.get(interaction.user.id) ?? { username: "Unknown", id: "1234567890"}

            let Data = await Bots.findOne({ id: bot.id })
              
            let user = await interaction.client.users.fetch(Data.Owners)

            await interaction.update({ components: [lifePlan, positiveMonthRow, negativeMonthRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${bot.id}> (**${bot.username}**) bot.
              
            - Bot Name: **${bot.username}**
            - Bot ID: **${bot.id}**
            - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
            - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
            - Bot Plan Expires: ${Data.typeTime === null ? "Life time" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` **Premium** membership was granted to the **${bot.username}**.`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { type: "2"}}, { upsert: true })

          }

          if(interaction.customId === "pos1month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The **${bot.username}** bot was given an extra **1 month.**`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).add(30, "days") }}, { upsert: true })

          }
          if(interaction.customId === "pos3month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The **${bot.username}** bot was given an extra **3 month.**`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).add(90, "days") }}, { upsert: true })

          }
          if(interaction.customId === "pos6month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The **${bot.username}** bot was given an extra **6 month.**`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).add(180, "days") }}, { upsert: true })
         
          }

          if(interaction.customId === "neg1month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The extra **1 month** that is in the **${bot.username}** bot is undone.`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).subtract(30, "days") }}, { upsert: true })

          }
          if(interaction.customId === "neg3month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The extra **3 month** that is in the **${bot.username}** bot is undone.`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).subtract(90, "days") }}, { upsert: true })

          }
          if(interaction.customId === "neg6month") {

            let bot = adminBot.get(interaction.user.id)

            let Data = await Bots.findOne({ id: bot.id })

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`🔱\` The extra **6 month** that is in the **${bot.username}** bot is undone.`)]})
           
            await Bots.findOneAndUpdate({ id: bot.id}, { $set: { typeTime: moment(Data.typeTime).subtract(180, "days") }}, { upsert: true })

          }

          if(interaction.customId === "deletebot") {

            const modals = new Discord.ModalBuilder()
            .setCustomId(`deleteidbot`)
            .setTitle(`Delete Bot`)

            const enterID = new Discord.TextInputBuilder()
            .setCustomId('botid')
            .setLabel("Enter a bot id")
            .setStyle(Discord.TextInputStyle.Short);

            let row = new Discord.ActionRowBuilder().addComponents(enterID)
            modals.addComponents(row)

            await interaction.showModal(modals)

          }

        }

        //? Modals için
        if(interaction.isModalSubmit()) {
          
          //? Blacklist User Modals
          if(interaction.customId === "modalblacklistuser") {

            try {

            let selectedUserId = interaction.fields.getTextInputValue("userid")
            let _user = await interaction.client.users.fetch(selectedUserId)

            let Data = await Manager.findOne({ id: interaction.client.user.id })
            
            if(Data.Blacklist_User.includes(selectedUserId)) await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $pull: { Blacklist_User: selectedUserId } }, { upsert: true })
            else await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $push: { Blacklist_User: selectedUserId } }, { upsert: true })

            Data = await Manager.findOne({ id: interaction.client.user.id })

            await interaction.update({ embeds: [embed.setDescription(`Hello ${interaction.member} 👋, Welcome to the developer control.
            
            - \`👮\` Blacklist User
            ${Data && Data.Blacklist_User?.length > 0 ? await fetchBlacklistUsers(Data) : ` - \`🔱\` There is no data in the database.`}
            - \`🕵️‍♂️\` Blacklist Server
            ${Data && Data.Blacklist_Server?.length > 0 ? `${Data.Blacklist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`🔱\` Whitelist Server
            ${Data && Data.Whitelist_Server?.length > 0 ? `${Data.Whitelist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`💎\` Plan Settings
             - \`0️⃣\` Free Plan
             - \`1️⃣\` VIP Plan
             - \`2️⃣\` Premium Plan
            - \`🗑️\` Delete Bot
             - \`🔱\` The bot deletes the database.`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Blacklist User`).setDescription(`${Data.Blacklist_User.includes(selectedUserId) ? `\`✅\` Eklendi ${_user.globalName ?? _user?.username}` : `\`❌\` çıkartıldı. ${_user.globalName ?? _user.username}`}`)]})

          } catch (error) {
            if(error.code === 10013) {
                return interaction.reply({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Blacklist User`).setDescription(`\`❌\` The specified member could not be found.`)]})
            } else {
                console.log(error)
            }
         }

         }

          //? Blacklist Server Modals
          if(interaction.customId === "modalblacklistserver") {

            let selectedServerId = interaction.fields.getTextInputValue("serverid")

            let Data = await Manager.findOne({ id: interaction.client.user.id })
            
            if(Data.Blacklist_Server.includes(selectedServerId)) await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $pull: { Blacklist_Server: selectedServerId } }, { upsert: true })
            else await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $push: { Blacklist_Server: selectedServerId } }, { upsert: true })

            Data = await Manager.findOne({ id: interaction.client.user.id })

            await interaction.update({ embeds: [embed.setDescription(`Hello ${interaction.member} 👋, Welcome to the developer control.
            
            - \`👮\` Blacklist User
            ${Data && Data.Blacklist_User?.length > 0 ? await fetchBlacklistUsers(Data) : ` - \`🔱\` There is no data in the database.`}
            - \`🕵️‍♂️\` Blacklist Server
            ${Data && Data.Blacklist_Server?.length > 0 ? `${Data.Blacklist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`🔱\` Whitelist Server
            ${Data && Data.Whitelist_Server?.length > 0 ? `${Data.Whitelist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`💎\` Plan Settings
             - \`0️⃣\` Free Plan
             - \`1️⃣\` VIP Plan
             - \`2️⃣\` Premium Plan
            - \`🗑️\` Delete Bot
             - \`🔱\` The bot deletes the database.`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Blacklist Server`).setDescription(`${Data.Blacklist_Server.includes(selectedServerId) ? `\`✅\` Eklendi ${selectedServerId}` : `\`❌\` çıkartıldı. ${selectedServerId}`}`)]})

          }

          //? Whitelist Server Modals
          if(interaction.customId === "modalwhitelistserver") {

            let selectedServerId = interaction.fields.getTextInputValue("serverid")

            let Data = await Manager.findOne({ id: interaction.client.user.id })
            
            if(Data.Whitelist_Server.includes(selectedServerId)) await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $pull: { Whitelist_Server: selectedServerId } }, { upsert: true })
            else await Manager.findOneAndUpdate({ id: interaction.client.user.id }, { $push: { Whitelist_Server: selectedServerId } }, { upsert: true })

            Data = await Manager.findOne({ id: interaction.client.user.id })

            await interaction.update({ embeds: [embed.setDescription(`Hello ${interaction.member} 👋, Welcome to the developer control.
            
            - \`👮\` Blacklist User
            ${Data && Data.Blacklist_User?.length > 0 ? await fetchBlacklistUsers(Data) : ` - \`🔱\` There is no data in the database.`}
            - \`🕵️‍♂️\` Blacklist Server
            ${Data && Data.Blacklist_Server?.length > 0 ? `${Data.Blacklist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`🔱\` Whitelist Server
            ${Data && Data.Whitelist_Server?.length > 0 ? `${Data.Whitelist_Server.map(x => ` - Guild ID: ${x}`)}` : ` - \`🔱\` There is no data in the database.`}
            - \`💎\` Plan Settings
             - \`0️⃣\` Free Plan
             - \`1️⃣\` VIP Plan
             - \`2️⃣\` Premium Plan
            - \`🗑️\` Delete Bot
             - \`🔱\` The bot deletes the database.`)]})

            interaction.followUp({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Whitelist Server`).setDescription(`${Data.Whitelist_Server.includes(selectedServerId) ? `\`✅\` Eklendi ${selectedServerId}` : `\`❌\` çıkartıldı. ${selectedServerId}`}`)]})

          }

          //? Plan Settings for User Bot
          if(interaction.customId === "modalplan") {

            let startRow = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
              .setCustomId("VIP")
              .setLabel("VIP Plan")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("Premium")
              .setLabel("Premium Plan")
              .setStyle(Discord.ButtonStyle.Secondary)
            )

            let lifePlan = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
              .setCustomId("lifeVIP")
              .setLabel("VIP Plan (Life Time)")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("lifePremium")
              .setLabel("Premium Plan (Life Time)")
              .setStyle(Discord.ButtonStyle.Secondary)
            )

            let positiveMonthRow = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
              .setCustomId("pos1month")
              .setLabel("1 Month")
              .setEmoji("➕")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("pos3month")
              .setLabel("3 Month")
              .setEmoji("➕")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("pos6month")
              .setLabel("6 Month")
              .setEmoji("➕")
              .setStyle(Discord.ButtonStyle.Secondary)
            )

            let negativeMonthRow = new Discord.ActionRowBuilder()
            .addComponents(
              new Discord.ButtonBuilder()
              .setCustomId("neg1month")
              .setLabel("1 Month")
              .setEmoji("✖")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("neg3month")
              .setLabel("3 Month")
              .setEmoji("✖")
              .setStyle(Discord.ButtonStyle.Secondary),
              new Discord.ButtonBuilder()
              .setCustomId("neg6month")
              .setLabel("6 Month")
              .setEmoji("✖")
              .setStyle(Discord.ButtonStyle.Secondary)
            )

            let selectedBotId = interaction.fields.getTextInputValue("botid")
            try {

              let bot = await interaction.client.users.fetch(selectedBotId)
              if(!bot.bot) return interaction.reply({ embeds: [embed.setDescription(`\`❌\` `)]})
              
              adminBot.set(interaction.user.id, bot)

              let bot_name = bot?.username || 'Unknown Bot'
              let Data = await Bots.findOne({ id: selectedBotId })
              
              let user = await interaction.client.users.fetch(Data?.Owners)
            
              if(!user) {
                return interaction.reply({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`❌\` The bot owner could not be found.`)]})
              }
            
              //? Start plan

              if(Data.type === "0") {
  
              return interaction.reply({ components: [lifePlan, startRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${selectedBotId}> (**${bot_name}**) bot.
              
              - Bot Name: **${bot_name}**
              - Bot ID: **${bot.id}**
              - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
              - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
              - Bot Plan Expires: ${Data.typeTime === null ? "No Premium" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})
  
              }

              //? Change month
              interaction.reply({ components: [lifePlan, positiveMonthRow, negativeMonthRow], ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`Hello ${interaction.member} 👋, You are currently viewing the plan of the <@${selectedBotId}> (**${bot_name}**) bot.
              
              - Bot Name: **${bot_name}**
              - Bot ID: **${bot.id}**
              - Bot Holder: **${user?.globalName ?? user?.username}** (\`${user?.id}\`)
              - Bot Plan: **${Data.type.replace("0", "Free").replace("1", "VIP",).replace("2", "Premium")}**
              - Bot Plan Expires: ${Data.typeTime === null ? "Life time" : `<t:${Math.floor(Data.typeTime / 1000)}> (<t:${Math.floor(Data.typeTime / 1000)}:R>)`}`)]})

            } catch (error) {
              interaction.reply({ ephemeral: true, embeds: [embed.setTitle(`OwnerCord - Plan Settings`).setDescription(`\`❌\` An error occurred while using the command.`)]})
              console.log(error)
            }

          }

          //? Delete bot with Modals
          if(interaction.customId === "deleteidbot") {

            let selectedBotId = interaction.fields.getTextInputValue("botid")

            let bot = await interaction.client.users.fetch(selectedBotId, { force: true })
            if(!bot?.bot) return interaction.reply({ embeds: [embed.setDescription(`\`❌\` No such bot has been found.`)] })
            let pBot = await Bots.findOne({ id: selectedBotId })

            await interaction.reply({ embeds: [embed.setDescription(`The bot was successfully deleted from the database.\n\n- **Bot Informations:**\n- Bot Name: **${bot?.username || "Unknown Bot"}**\n- Bot ID: **${bot?.id}**\n- Bot Holder: <@${pBot.Owners}>`)]})

            await Bots.deleteOne({ id: selectedBotId }, { upsert: true })
            await Auths.deleteMany({ bot: selectedBotId });

          }

        }

    }
}