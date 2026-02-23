/* Core Modules */
const Discord = require('discord.js')

/* Database Modules */
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')
const Manage = require('../Database/OwnerCord_Manager')

const moment = require('moment')

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {

        let embed = new Discord.EmbedBuilder()
        .setColor('#2c2c34')
        
        let row = new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
          .setLabel("⭐ Powered by OwnerCord")
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(global.ownercord || "http://youtube.com/RowyHere")
        )

        if (interaction.isChatInputCommand()) {
        
        let Management = await Manage.findOne({ id: global.managerID })
        
        if(Management?.Blacklist_User.includes(interaction.user.id)) return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Blacklist User`).setDescription(`\`❌\` Your access to our bots is restricted because you are attached to the blacklist.\n- [If you think this is a problem, please contact admin.](https://discord.gg/oauths)`)], ephemeral: true })

       // if(global.commandsBlocked) return interaction.reply({ embeds: [embed.setDescription(`\`❌\` OAuth members refreshing, commands temporarily disabled.\n>>> ETA: ${global.estim}`)]})
        let Bot = await Bots.findOne({ id: interaction.client.user.id })
        if(!Bot?.Secret && interaction.commandName !== "bot") return interaction.reply({ components: [row], ephemeral: true, embeds: [embed.setTitle(`${interaction.client.user.username} - Configuration`).setDescription(`\`❌\` Your bot secret is not setted up please update them or you will lose your auth members. (\`/bot secret\`)`)]})

        switch(interaction.commandName) {

            case "bot":

                if(![Bot?.Owners, ...global.developers].includes(interaction.user.id)) {
                    return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Access`).setDescription(`\`❌\` You do not have access to this command.`)], ephemeral: true })
                }

            break;

            case "whitelist":

                if(![...Bot?.Whitelist_Owners, Bot?.Owners, ...global.developers].includes(interaction.user.id)) {
                    return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Access`).setDescription(`\`❌\` You do not have access to this command.`)], ephemeral: true })
                }

            break;

            case "authoriseserver":

                if(![...Bot?.Whitelist_Owners, Bot?.Owners, ...global.developers].includes(interaction.user.id)) {
                    return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Access`).setDescription(`\`❌\` You do not have access to this command.`)], ephemeral: true })
                }

            break;

            case "features":

                if(![...Bot?.Whitelist_Owners, Bot?.Owners, ...global.developers].includes(interaction.user.id)) {
                    return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Access`).setDescription(`\`❌\` You do not have access to this command.`)], ephemeral: true })
                }

            break;

            case "oauth":

                if(![...Bot?.Whitelist_Owners, Bot?.Owners, ...global.developers, ...Bot?.Whitelist].includes(interaction.user.id)) {
                    return interaction.reply({ components: [row], embeds: [embed.setTitle(`${interaction.client.user.username} - Access`).setDescription(`\`❌\` You do not have access to this command.`)], ephemeral: true })
                }

            break;

        }

        const command = global.commands.get(interaction.commandName);
        if (!command) return;
        
        try {
            await command.execute(interaction, interaction.client);

            if(Bot.typeTime !== null && moment(Bot.typeTime).isBefore(moment())) {
                    await Bots.findOneAndUpdate({ id: interaction.client.user.id}, { $set: { typeTime: null, type: 0, Features: []}}, { upsert: true })
                    interaction.followUp({ ephemeral: true, embeds: [embed.setTitle("OwnerCord - Plan").setDescription(`\`🔱\` You have unpaid receipt until you pay, the bot plan has changed to Standart(Free) plan.`)], components: [row] })
            }

            if(Bot && Bot?.Log_Command) {
            let webhook = new Discord.WebhookClient({ url: Bot?.Log_Command })
            if(webhook && !global.developers.includes(interaction.user.id)) {
                webhook.send({
                    username: interaction.client.user.username,
                    avatarURL: interaction.client.user.avatarURL(),
                    embeds: [embed.setTitle(`${client.user.username} - Command Log`).setDescription(`
                    \`🔱\` \`${interaction}\`
                    \`🏠\` Server Name: \`${interaction.guild.name}\` (\`${interaction.guild.id}\`)
                    \`🎅\` Author: \`${interaction.user.username}\` (\`${global.owners.includes(interaction.user.id) ? `Bot Owner` : Bot?.Whitelist_Owners.includes(interaction.user.id) ? `Bot Owner (Whitelist)` : `Whitelist Access`}\`)`)]
                })
            }
            }

        } catch (error) {
            console.log(error)
        }
        } else if(interaction.isAutocomplete()) {
            const command = global.commands.get(interaction.commandName);
            if (!command) return;
    
            try {
                await command.autocomplete(interaction, interaction.client);
            } catch (error) {
                console.log(error)
            }
        }
    }
}