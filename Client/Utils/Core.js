    /* Core Modules */
const Discord = require('discord.js')
const Request = require('./Request')

/* Database Modules */
const mongoose = require('mongoose')
const Auths = require('../Database/OwnerCord_Auths')
const Bots = require('../Database/OwnerCord_Bots')

/* Utils Modules */
const fs = require('fs')
const requestIp = require('request-ip')
const path = require('path')
const ipLocale = require('ip-locale')
const fetch = require('node-fetch')
/*
    NOTE: node-fetch npm version is 2.6.7 & npm install node-fetch@2.6.7
*/
const moment = require('moment')
moment().locale('tr')

/* Utils */
const error = x => console.log("[-] " + x)
const warn = x => console.log("[!] " + x)
const log = x => console.log("[+] " + x)

class Core {

    constructor(data) {

        this.client = global.client = new Discord.Client({ intents: [3276799] })
        this.client.commands = global.commands = new Discord.Collection()

        this.token = data.CoreToken
        this.id = data.CoreID
        this.port = data.CorePort
        global.redirecturi = data.CoreRedirect
        this.developers = global.developers = data.CoreDevelopers
        this.owners = global.owners = data.CoreOwners
        this.mongoose = data.CoreMongoose
        global.progressList = new Map()
        global.guilderList = new Map()
        this.isCommands = [];
        global.managerID = "1207803029642944562"
        global.ownercord = "https://discord.gg/8yrZY75KcZ"
        global.sWebhook = data.CoreSwitchWebhook

        global.title = data.CoreTitle

    }

    async fetchCommands(loader = true) {

        if(loader) {
        let commands = fs.readdirSync('../../OwnerCord_AuthV3/Client/Commands').filter(file => file.endsWith('.js'))
        for (let file of commands) {
            let command = require(`../Commands/${file}`)
            this.client.commands.set(command.data.name, command)
            this.isCommands.push(command.data.toJSON())
            // log(`Loaded Slash Command: ${command.data.name}`)
        }
        } else {
        let commands = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))
        for (let file of commands) {
            let command = require(`../Commands/${file}`)
            this.client.commands.set(command.data.name, command)
            this.isCommands.push(command.data.toJSON())
            // log(`Loaded Slash Command: ${command.data.name}`)
        }
        }
        this.load()
    }

    async fetchEvents(loader = true) {

        if(loader) {
        let events = fs.readdirSync('../../OwnerCord_AuthV3/Client/Events').filter(file => file.endsWith('.js'))
        for (let file of events) {
            let event = require(`../Events/${file}`)
            this.client.on(event.name, event.execute)
        }
        } else {
            let events = fs.readdirSync('./Events').filter(file => file.endsWith('.js'))
            for (let file of events) {
                let event = require(`../Events/${file}`)
                this.client.on(event.name, event.execute)
            }
        }
    }

    async fetchDatabase(loader = true) {
            
        mongoose.connect(this.mongoose).then(() => {
        }).catch((err) => {
            error(err)
        })

    }

    async connect(token = this.token) {
        this.client.login(this.token).then(() => {}).catch((err) => { console.log(`${err}`), process.exit() })

    }

    async load() {

        const rest = new Discord.REST({ version: '10' }).setToken(this.token)
        
        this.client.on('ready', async () => {

            await rest.put(Discord.Routes.applicationCommands(this.client.user.id), { body: this.isCommands })

        })

    }

}

module.exports = Core