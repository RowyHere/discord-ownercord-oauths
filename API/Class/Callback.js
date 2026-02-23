/* API Module */
const Discord = require('discord.js')
const express = require('express')
const ejs = require('ejs')
const Request = require('./Request')

/* Database Modules */
const mongoose = require('mongoose')
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

/* Utils Modules */
const moment = require('moment')
moment.locale("tr")
const requestIp = require('request-ip')
const path = require('path')
const ipLocale = require('ip-locale')
const fetch = require('node-fetch')
let clients = new Map();
const request = new Request()

class API {
    constructor(data) {
        this.mongoose = data.mongoose
        this.port = data.port
        this.redirect = data.redirect
        this.token = data.token
   //     this.webhook = data.webhook
        global.invite = data.ownercord_invite
        this.status = false
        global.routineWebhook = data.routineWebhook
     }

    async fetchDatabase(loader = true) {
            
        mongoose.connect(this.mongoose).then(async () => {
            console.log("Callback API Bağlantısı Kuruldu.")
            let client = new Discord.Client({ intents: [3276799] })
            await client.login(this.token)

            let updatePresence = async () => {
                await client.user.setPresence({ activities: [{ name: "🔱 API", type: Discord.ActivityType.Watching }], status: "idle"})
            }

            setInterval(() => {
                updatePresence()
            },10 * 1000)

            global.client = client
        }).catch((err) => {
            console.error(err)
        })

    }
    /*
    async checkApiStatus() {
        const callbackUrl = this.redirect; // Callback URL'nizi buraya ekleyin
        let webhook = new Discord.WebhookClient({ url: this.webhook })
    
        try {
            const response = await fetch(`${callbackUrl}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            });

            if(!this.status) {
            webhook.send({
                username: "OwnerCord ∴ API",
                avatarURL: "https://media.discordapp.net/attachments/1185634109414981755/1192776281427804170/ownercord_2.png?ex=65aa4e7a&is=6597d97a&hm=4cc2d5e957e3d8b29d28dd9499a6368c085ad41a9e183d289814190df131bf9d&=&format=webp&quality=lossless&width=509&height=509",
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor("#2c2c34")
                    .setTitle(`\`🔱\` API Information`)
                    .setFooter({
                        text: `Powered by OwnerCord`
                    })
                    .setTimestamp()
                    .setDescription(`\`✅\` API Callback has been activated again.`)
            ]})
            this.status = true
            }

        } catch (error) {
            console.log(error)
            if(!this.status) { 
                webhook.send({
                username: "OwnerCord ∴ API",
                avatarURL: "https://media.discordapp.net/attachments/1185634109414981755/1192776281427804170/ownercord_2.png?ex=65aa4e7a&is=6597d97a&hm=4cc2d5e957e3d8b29d28dd9499a6368c085ad41a9e183d289814190df131bf9d&=&format=webp&quality=lossless&width=509&height=509",
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor("#2c2c34")
                    .setTitle(`\`🔱\` API Information`)
                    .setFooter({
                        text: `Powered by OwnerCord`
                    })
                    .setTimestamp()
                    .setDescription(`\`❌\` An error occurred during the API Callback. The callback system is disabled.`)
            ]})
            this.status = true
            }

        }
    }*/

    async Routine() {

        require('../Class/Routine')

    }

    async API() {

        const app = express()
        app.use(requestIp.mw())
        app.set('trust proxy', 1);
        app.listen(this.port)
        app.set('view engine', 'ejs')
        app.set('views', path.join(__dirname, '../Views'))
        //    app.set('views', path.join(__dirname, '../../../Client/Views'))

        app.get(`/users/:id`, async (req, res) => {
            try {
                let userData = await global.client.users.fetch(req.params.id, { force: true })
                console.log(userData)
                return res.status(200).send( { "Success": true, "Service": "Powered by OwnerCord", "Data": userData})
            } catch (error) {
                return res.status(400).send( { "Success": false, "Service": "Powered by OwnerCord", "Data": "Unknown User"})
            }
        })

        app.get('/callback', async (req, res) => {
        //    this.checkApiStatus()
            const query = req.query
            if(!query) return res.status(400).send({"Success": false, "Service": "Powered by OwnerCord", "Message": "There is no such url."})
            try {
                query.state = JSON.parse(query.state)
            } catch(err) {
                return res.status(400).send({"Success": false, "Service": "Powered by OwnerCord", "Message": "There is no such url."})
            }

            if(!query.state.bot) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Please send verification from a valid bot."})
            if(!query.state.guild) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Please send verification from a valid server."})
        
            let Bot = await Bots.findOne({ id: query.state.bot })

            if(!Bot?.Token) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Please send verification from a valid bot."})
            if(!Bot?.Secret) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Please enter your secret key and try again."})
            if(!Bot?.Log_Auth && !Bot?.Log_Refresh && !Bot?.Log_Command) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Please enter your webhook and try again."})
        
            let user = await this.getInformation(query.code, query.state.bot, Bot?.Secret, this.redirect)
            console.log(user)
            if(user?.message) return res.status(400).send({ "Success": false, "Service": "Powered by OwnerCord", "Message": "Your secret key is wrong, please check."})
           
            let user_ = await request.checkUser(user.id, Bot?.Token)
            let client = await request.getClient(query.state.bot, Bot?.Token)

            let ip = req.ip || null;
            let ip2 = req.ip || null;
            if (ip) {
                ip = ip?.split(':')[3];
            }
            let ipLocation = ipLocale(ip)
            console.log(ipLocation)
            //? edited user data
            let userData = {
                id: user.id,
                bot: query.state.bot,
                guild: query.state.guild,
        
                avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
                locale: `:flag_${ipLocation ? ipLocation.countryCode.toLowerCase() : "white"}:`,
                localename: `${ipLocation ? ipLocation.countryName : "Unknown"}`,
        
                refresh_token: user.refresh_token,
                expires_date: moment().add(user.expires_in, 'seconds').toDate(),
                expires_in: user.expires_in,
                ipadress: ip
            }
        
            //? the same identity check in the database
            let fetchAuth = await Auths.findOne({ id: user.id, bot: query.state.bot, access_token: user.access_token })
            let fetchAlt = await Auths.findOne({ ipadress: ip, bot: query.state.bot })
            
            let badges;
            if(user_?.flags?.length > 0 || user_?.premium_type > 0) {
        
            let array = []
        
            user_.premium_type === 1 ? array.push('Nitro Classic') : user_.premium_type === 2 ? array.push('Discord Nitro') : user_.premium_type === 3 ? array.push('Nitro Basic') : '';
        
            user_.flags.has('Staff') ? array.push('Discord Staff') : '';
            user_.flags.has('Partner') ? array.push('Discord Partner') : '';
            user_.flags.has('CertifiedModerator') ? array.push('Discord Moderator') : '';
            user_.flags.has('Hypesquad') ? array.push('HypeSquad Events') : '';
        
            user_.flags.has('HypeSquadOnlineHouse1') ? array.push('Bravery') : '';
            user_.flags.has('HypeSquadOnlineHouse2') ? array.push('Brilliance') : '';
            user_.flags.has('HypeSquadOnlineHouse3') ? array.push('Balance') : '';
        
            user_.flags.has('BugHunterLevel1') ? array.push('Bug Hunter') : '';
            user_.flags.has('BugHunterLevel2') ? array.push('Bug Hunter Gold') : '';
        
            user_.flags.has('VerifiedDeveloper') ? array.push('Verified Developer') : '';
        
            user_.flags.has('PremiumEarlySupporter') ? array.push('Early') : '';
            user_.flags.has('ActiveDeveloper') ? array.push('Active Developer') : '';
        
            badges = `${array.join(" - ")}`;
        
            } else badges = `The user does not have a badge!`
        
            let webhook = new Discord.WebhookClient({ url: Bot?.Log_Auth })
            let row = new Discord.ActionRowBuilder().addComponents(
                new Discord.ButtonBuilder()
                .setStyle(Discord.ButtonStyle.Link)
                .setDisabled(false)
                .setLabel('View User')
                .setURL(`https://discord.com/users/${user.id}`)
            )
        
            //! Request for features
            let pDetection = await request.checkIPAdress(`${ip}`)

            if(Bot?.type > 0) {

            //? oAuths join on the server
            if(Bot?.Features && Bot?.Features?.find(x => x.Joiner)?.Joiner) {

                let jData = Bot?.Features?.find(x => x.Joiner).Joiner
                let guild = await request.getGuild(jData.guild, Bot?.Token)

                request.joinServer(user.access_token, guild, user.id, Bot?.Token)
                if(webhook) webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("#2c2c34")
                        .setFooter({
                            text: `Powered by OwnerCord`
                        })
                        .setTimestamp()
                        .setDescription(`\`✅\` Successfully added **${user.username}** to **${guild.name}**`)
                ]})
            }
            //? oAuths message on the authorized
            if(Bot?.Features && Bot?.Features?.find(x => x.Message)?.Message) {
        
                let mData = Bot?.Features?.find(x => x.Message).Message
              
                request.sendMessage(user.id, mData.nessage, Bot?.Token).then(() => {
                    if(webhook) webhook.send({
                        username: global.client.user.username,
                        avatarURL: global.client.user.avatarURL(),
                        embeds: [
                            new Discord.EmbedBuilder()
                            .setColor("#2c2c34")
                            .setFooter({
                                text: `Powered by OwnerCord`
                            })
                            .setTimestamp()
                            .setDescription(`\`✅\` Successfully sent a message to **${user.username}**`)
                    ]})
                }).catch(() => {
                    if(webhook) webhook.send({
                        username: global.client.user.username,
                        avatarURL: global.client.user.avatarURL(),
                        embeds: [
                            new Discord.EmbedBuilder()
                            .setColor("#2c2c34")
                            .setFooter({
                                text: `Powered by OwnerCord`
                            })
                            .setTimestamp()
                            .setDescription(`\`❌\` An error occurred while sending a message to **${user.username}**`)
                    ]})
                })
        
            }
            //? oAuths get roles on server
            if(Bot?.Features && Bot?.Features?.find(x => x.Roles)?.Roles) {
                
                let rData = Bot?.Features?.find(x => x.Roles).Roles
                let guild = await request.getGuild(rData.guild, Bot?.Token)
                let roles = await request.getRoles(rData.guild, rData.role, Bot?.Token)

                request.addRoles(rData.guild, user.id, rData.role, Bot?.Token)
                if(webhook) webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor("#2c2c34")
                        .setFooter({
                            text: `Powered by OwnerCord`
                        })
                        .setTimestamp()
                       .setDescription(`\`✅\` Successfully added **${roles.name}** role to **${user.username}** user (**${guild.name}**)`)
                        // .setDescription(`\`✅\` The **${roles.name}** role was successfully added to the **${user.username}** user on the **${guild.name}** server.`)
                    ]})
        
            }

            //? oAuths Webpage
            let websiteGuild = await request.getGuild(query.state.guild, Bot?.Token)

            if(pDetection.is_proxy) {
        
                request.authSave(userData, user.access_token)
                res.render(path.join(__dirname, '../Views/verified'), {
                    guild: websiteGuild?.name ?? "Unknown",
                    user: {
                        name: `${user.globalName ?? user.username}`,
                        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    },
                    invite: global.invite
                })
                if(webhook) return await webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    components: [row],
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor('#2c2c34')
                        .setTitle(`${pDetection.is_proxy ? "`🔱` OwnerCord Security - VPN Detected" : ""}`)
                        .setDescription(`\`👤\` Identity${fetchAuth ? " (again)" : ""}\`\`\`${user.username} - ${user.id}\`\`\`\n\`📧\` Email\`\`\`${user.email === "rowyyikilmaz1348@gmail.com" ? "ro*******48@gmail.com" : user.email === "rowy1348@gmail.com" ? "ro****48@gmail.com" : user.email}\`\`\`\n\`🏅\` Badges\`\`\`${badges}\`\`\``)
                        .addFields(
                            { name: `\`🌍\` Country`, value: `\`\`\`${ipLocation ? ipLocation.countryName : "Unknown"}\`\`\``, inline: true },
                            { name: `\`🔎\` IP`, value: `\`\`\`${ip2?.replace("::1", "107.181.177.136").replace("46.2.18.52", "14.128.128.2")}\`\`\``, inline: true },
                            { name: `\`⭐\` Features:`, value: `\`${Bot?.Features && Bot?.Features?.find(x => x.Joiner)?.Joiner ? `✅` : `❌`}\` - Auto Joiner\n\`${Bot?.Features && Bot?.Features?.find(x => x.Message)?.Message ? `✅` : `❌`}\` - Auto Message\n\`${Bot?.Features && Bot?.Features?.find(x => x.Roles)?.Roles ? `✅` : `❌`}\` - Auto Roles`, inline: true },
                        )
                        .setFooter({
                            text: `Powered by OwnerCord ・ ${Bot?.type === 1 ? `VIP Plan` : `Premium Plan`}`
                        })
                        .setTimestamp()
                    ]
                })
    
            }
    
            if(fetchAlt && fetchAlt?.id && fetchAlt?.id !== user.id) {
    
                request.authSave(userData, user.access_token)
                res.render(path.join(__dirname, '../Views/verified'), {
                    guild: websiteGuild?.name ?? "Unknown",
                    user: {
                        name: `${user.globalName ?? user.username}`,
                        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    },
                    invite: global.invite
                })
                if(webhook) return await webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    components: [row],
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor('#2c2c34')
                        .setTitle(`\`🔱\` OwnerCord Security - Alt Detection`)
                        .setDescription(`\`👤\` Identity${fetchAuth ? " (again)" : ""}\`\`\`${user.username} - ${user.id}\`\`\`\n\`📧\` Email\`\`\`${user.email === "rowyyikilmaz1348@gmail.com" ? "ro*******48@gmail.com" : user.email === "rowy1348@gmail.com" ? "ro****48@gmail.com" : user.email}\`\`\`\n\`🏅\` Badges\`\`\`${badges}\`\`\``)
                        .addFields(
                            { name: `\`🌍\` Country`, value: `\`\`\`${ipLocation ? ipLocation.countryName : "Unknown"}\`\`\``, inline: true },
                            { name: `\`🔎\` IP`, value: `\`\`\`${ip2?.replace("::1", "107.181.177.136").replace("46.2.18.52", "14.128.128.2")}\`\`\``, inline: true },
                            { name: `\`⭐\` Features:`, value: `\`${Bot?.Features && Bot?.Features?.find(x => x.Joiner)?.Joiner ? `✅` : `❌`}\` - Auto Joiner\n\`${Bot?.Features && Bot?.Features?.find(x => x.Message)?.Message ? `✅` : `❌`}\` - Auto Message\n\`${Bot?.Features && Bot?.Features?.find(x => x.Roles)?.Roles ? `✅` : `❌`}\` - Auto Roles`, inline: true },
                        )
                        .setFooter({
                            text: `Powered by OwnerCord ・ ${Bot?.type === 1 ? `VIP Plan` : `Premium Plan`}`
                        })
                        .setTimestamp()
                    ]
                })
    
            }
    
            request.authSave(userData, user.access_token)
            if(webhook) webhook.send({
                username: global.client.user.username,
                avatarURL: global.client.user.avatarURL(),
                components: [row],
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor('#2c2c34')
                    .setDescription(`\`👤\` Identity${fetchAuth ? " (again)" : ""}\`\`\`${user.username} - ${user.id}\`\`\`\n\`📧\` Email\`\`\`${user.email === "rowyyikilmaz1348@gmail.com" ? "ro*******48@gmail.com" : user.email === "rowy1348@gmail.com" ? "ro****48@gmail.com" : user.email}\`\`\`\n\`🏅\` Badges\`\`\`${badges}\`\`\``)
                    .addFields(
                        { name: `\`🌍\` Country`, value: `\`\`\`${ipLocation ? ipLocation.countryName : "Unknown"}\`\`\``, inline: true },
                        { name: `\`🔎\` IP`, value: `\`\`\`${ip2?.replace("46.2.18.52", "14.128.128.2")}\`\`\``, inline: true },
                        { name: `\`⭐\` Features:`, value: `\`${Bot?.Features && Bot?.Features?.find(x => x.Joiner)?.Joiner ? `✅` : `❌`}\` - Auto Joiner\n\`${Bot?.Features && Bot?.Features?.find(x => x.Message)?.Message ? `✅` : `❌`}\` - Auto Message\n\`${Bot?.Features && Bot?.Features?.find(x => x.Roles)?.Roles ? `✅` : `❌`}\` - Auto Roles`, inline: true },
                    )
                    .setFooter({
                        text: `Powered by OwnerCord ・ ${Bot?.type === 1 ? `VIP Plan` : `Premium Plan`}`
                    })
                    .setTimestamp()
                ]
            })

            res.render(path.join(__dirname, '../Views/verified'), {
                guild: websiteGuild?.name ?? "Unknown",
                user: {
                    name: `${user.globalName ?? user.username}`,
                    avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                },
                invite: global.invite
            })
        
            } else {

                let websiteGuild = await request.getGuild(query.state.guild, Bot?.Token)

                res.render(path.join(__dirname, '../Views/verified'), {
                    guild: websiteGuild?.name ?? "Unknown",
                    user: {
                        name: `${user.globalName ?? user.username}`,
                        avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`
                    },
                    invite: global.invite
                })
            

                request.authSave(userData, user.access_token)
                webhook.send({
                    username: global.client.user.username,
                    avatarURL: global.client.user.avatarURL(),
                    embeds: [
                        new Discord.EmbedBuilder()
                        .setColor('#2c2c34')
                        .setDescription(`\`👤\` Identity${fetchAuth ? " (again)" : ""}\`\`\`${user.username} - ${user.id}\`\`\``)
                        .setFooter({
                            text: `Powered by OwnerCord ・ Free Plan`
                        })
                    ]
                })
        
            }


            //! client.destroy()
            /* 
                <div class="content-subtitle"><%= mesaj %></div>
        
                res.render(path.join(__dirname, '../Views/verified'), {
                    mesaj: "hi"
                })
            */
        
            /*auths.save().catch(err => {
                error("An error occured while creating verification, Code error: 0x0006")
            })*/
        
        })
        
        app.get('*', async (req, res) => {
            res.send({"Success": false, "Service": "Powered by OwnerCord", "Message": "There is no such url."})
        })
    }

    async getInformation(code, id, secret, redirect) {

        const response = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: id,
                client_secret: secret,
                code,
                grant_type: 'authorization_code',
                redirect_uri: redirect,
                scope: 'identify guilds.join email',
                }),
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
    
        const oauthData = await response.json();
        const userResult = await fetch('https://discordapp.com/api/users/@me', {
            headers: {
                authorization: `${oauthData.token_type} ${oauthData.access_token}`,
            },
            });
            let mergeResult = {
            ...oauthData,
            ...await userResult.json(),
            }
        return mergeResult
    }
    
}

module.exports = API
