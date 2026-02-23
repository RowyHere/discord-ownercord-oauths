const fetch = require('node-fetch'), { Response } = require('node-fetch')
const Auths = require('../Database/OwnerCord_Auths')
const moment = require('moment')
const Discord = require('discord.js')

class Request {
    constructor() {}

    //? Callback Function
    async joinServer(access_token, guild, user, token) {
        return new Promise(async (resolve, reject) => {
            fetch(`https://discord.com/api/guilds/${guild}/members/${user}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    access_token
                })
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json.user)
            })
        })
    }
    
    async addRoles(guild, user, roles, token) {
        return new Promise(async (resolve, reject) => {
            fetch(`https://discord.com/api/guilds/${guild}/members/${user}/roles/${roles}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json)
            })
        })
    }

    async sendMessage(user, message, token) {
        return new Promise(async (resolve, reject) => {

            const url = `https://discord.com/api/v9/users/@me/channels`;

            fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ recipient_id: user })
            })
            .then(response => response.json())
            .then(channelData => {
                const channel_id = channelData.id;

                const messageUrl = `https://discord.com/api/v9/channels/${channel_id}/messages`;

                fetch(messageUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bot ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ content: message })
                }).catch((error)=> {
                    console.log(error)
                })
            })
            .catch(error => {
                console.error('DM Mesaj Gönderme Hatası:', error);
})
        })
    }

    async authSave(data, access_token) {

        let fetchAuth = await Auths.findOne({ id: data.id, bot: data.bot, access_token: access_token })
        if(fetchAuth) await Auths.findOneAndUpdate({ id: data.id, bot: data.bot, access_token: access_token }, { ...data }, { upsert: true })
        else new Auths({
            id: data.id,
            bot: data.bot,
            guild: data.guild,

            avatar: `${data.avatar}`,
            locale: `${data.locale}`,
            localename: `${data.localename}`,

            access_token: access_token,
            refresh_token: data.refresh_token,
            expires_date: moment().add(data.expires_in, 'seconds').toDate(),
            expires_in: data.expires_in,
            ipadress: data.ipadress
        }).save().catch(err => {
            console.error("An error occured while creating verification, Code error: 0x0006")
        })

    }

    async getRoles(guild, role, token) {
       
        return new Promise(async (resolve, reject) => {
                fetch(`https://discord.com/api/v9/guilds/${guild}/roles/${role}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bot ${token}`,
                        'Content-Type': 'application/json'
                    }
                }).then(async (res) => {
    
                    const roles = await res.json().catch(e => { return e; })
                    console.log(roles)
                    resolve(roles)
                })
        })
    }    

    async getGuild(guild, token) {

        return new Promise(async (resolve, reject) => {
            fetch(`https://discordapp.com/api/v9/guilds/${guild}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json)
            })
        })

    }

    async getClient(bot, token) {

        return new Promise(async (resolve, reject) => {
            fetch(`https://discord.com/api/v9/users/${bot}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json)
            })
        })

    }

    async checkIPAdress(ip_adress) {
        return new Promise(async (resolve, reject) => {
            fetch(`https://antivpn.net/api/v1/lookup?ip=${ip_adress}&key=4166227199e9fbc1abdd4d31a66af529`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(() => { })
                resolve(json)
            })
        })
    }

    async checkUser(user, token) {
        return new Promise(async (resolve, reject) => {
            fetch(`https://discord.com/api/v9/users/${user}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bot ${token}`,
                    'Content-Type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(e => { return e; });
                resolve(json)
            })
        })
    }

    //? Refresh Function

    async getInformation(access_token) {
        return new Promise(async (resolve, reject) => {

            fetch(`https://discord.com/api/users/@me`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            }).then(async (res) => {
                const user = await res.json();

                resolve({
                    success: user.username ? true : false,
                    user: user
                });
            }).catch(err => {
                resolve({
                    httpError: err.message
                });
            });
        })
    }

    async refreshUser(auth, clientId, clientSecret) {

        return new Promise(async (resolve, reject) => {
            try {
                
                const refresh = await fetch(`https://discord.com/api/oauth2/token`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams({
                        client_id: clientId,
                        client_secret: clientSecret,
                        grant_type: 'refresh_token',
                        refresh_token: auth.refresh_token
                    })
                }).catch(err => {
                    return { httpError: err?.message }
                })
                
                if(!refresh && refresh.httpError) return resolve({
                    success: false,
                    updated: false,
                    deleted: false,
                    httpError: refresh.httpError
                })
                
                const response = await refresh.json();
                
                if (response?.error || response?.message) {
                    if (auth.refreshFailed >= 1) {
                        await Auths.deleteOne({ id: auth.id, bot: auth.bot });
                    
                        return resolve({
                            success: false,
                            updated: false,
                            deleted: true,
                        });
                    } else {
                        await Auths.findOneAndUpdate({ id: auth.id, bot: auth.bot }, { $set: { refreshFailed: Math.round(auth.refreshFailed+1) }}, { upsert: true });
                        return resolve({
                            success: false,
                            updated: false,
                            deleted: false,
                        });
                    }
                }
        
                const updated = await Auths.findOneAndUpdate(
                    { id: auth.id },
                    {
                        access_token: response.access_token,
                        refresh_token: response.refresh_token,
                        expires_date: moment().add(response.expires_in, 'seconds').toDate(),
                        expires_in: response.expires_in,
                        refreshFailed: 0,
                        userInformationFailed: 0
                    },
                    { upsert: true }
                ).catch((err) => {
                    console.log(err)
                    return false;
                })
        
                if (updated === false) return resolve({
                        success: false,
                        updated: false,
                        deleted: false,
                    });
                
        
                console.log("💬 Refresh success for %s", auth.id);
                return resolve({
                    success: true,
                    updated: true,
                    deleted: false
                });
        
            } catch (err) {
                console.error("Error during refresh:", err);
                return resolve({
                    success: false,
                    updated: false,
                    deleted: false,
                    httpError: err.message || "Unknown error"
                });
            }
        });
        

    }

}

module.exports = Request
