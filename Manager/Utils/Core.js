/* Core Modules */
const Discord = require('discord.js')

/* Database Modules */
const mongoose = require('mongoose')
const Bots = require('../Database/OwnerCord_Bots')

/* Utils Modules */
const fs = require('fs')
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
        this.mongoose = data.CoreMongoose
        global.progressList = new Map()
        global.guilderList = new Map()
        this.isCommands = [];
        global.ownercord = "https://discord.gg/8yrZY75KcZ"

        global.title = data.CoreTitle
        global.webhook = data.CoreWebhooks

    }

    async fetchCommands(loader = true) {

        let commands = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'))

        for (let file of commands) {
            let command = require(`../Commands/${file}`)
            this.client.commands.set(command.data.name, command)
            this.isCommands.push(command.data.toJSON())
           // log(`Loaded Slash Command: ${command.data.name}`)
        }
        this.load()

    }

    async fetchEvents(loader = true) {

        let events = fs.readdirSync('./Events').filter(file => file.endsWith('.js'))
        for (let file of events) {
            let event = require(`../Events/${file}`)
            this.client.on(event.name, event.execute)
        }

    }

    async fetchDatabase(loader = true) {
            
        mongoose.connect(this.mongoose).then(() => {
        }).catch((err) => {
            error(err)
        })

    }

    async connect(token = this.token) {

        this.client.login(token).catch((err) => { error(`${err}`), process.exit() })

    }

    async load() {

        const rest = new Discord.REST({ version: '10' }).setToken(this.token)

        this.client.on('ready', async () => {

            global.shortID = new Map()

            await rest.put(Discord.Routes.applicationCommands(this.client.user.id), { body: this.isCommands })

        })

    }

}

module.exports = Core