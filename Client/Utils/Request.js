const fetch = require('node-fetch'), { Response } = require('node-fetch')
const Auths = require('../Database/OwnerCord_Auths')
const moment = require('moment')
const Discord = require('discord.js')

class Request {
    constructor() {

        Discord.TextChannel.prototype.wsend = async function (message) {
            try {
            const hooks = await this.fetchWebhooks();
            let webhook = hooks.find(a => a.name === global.client.user.username && a.owner.id === global.client.user.id);
            if (webhook) return webhook.send(message);
            webhook = await this.createWebhook({ name: global.client.user.username, avatar: global.client.user.avatarURL() });
            return webhook.send(message);
            } catch(err) {
            return;
            }
        };

    }

    async findWebhook(webhook) {
        return new Promise(async (resolve, reject) => {
            fetch(`${webhook}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            }).then(async (res) => {
                let json = await res.json().catch(() => { })
                resolve(json)
            }).catch(async (err) => {
                console.log(err)
            })
        })
    }

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
                return {
                    httpError: err.message
                }
            });

            if((!refresh instanceof Response) && refresh.httpError) return resolve({
                success: false,
                updated: false,
                deleted: false,
                httpError: refresh.httpError
            })

            const response = await refresh.json()

            if(response?.error || response?.message) { 

                if(auth.refreshFailed >= 3) {
                    //console.log("refresh auth id and bot: " + auth.id + " - " + auth.bot)
                    await Auths.deleteOne({ id: auth.id, bot: auth.bot }).then(() => {
                        console.log("Data silindi")
                    })
                    return resolve({
                        success: false,
                        updated: false,
                        deleted: true,
                    })
                } else {
                    await Auths.findOneAndUpdate({ id:auth.id, bot: auth.bot }, { $inc: { refreshFailed: 1 }})
                    /*auth.refreshFailed++;
                    await auth.save()*/
                    return resolve({
                        success: false,
                        updated: false,
                        deleted: false,
                    })
                }
            }

            const updated = await Auths.findOneAndUpdate({ id: auth.id },
                {
                    access_token: response.access_token,
                    refresh_token: response.refresh_token,
                    expires_date: moment.add(response.expires_in, 'seconds').toDate(),
                    expires_in: response.expires_in,
                    refreshFailed: 0,
                    userInformationFailed: 0
                }).catch((err) => {
                    console.log(err)
                    return false
                })

            if(updated === false) {
                return resolve({
                    success: false,
                    updated: false,
                    deleted: false,
                })
            }
            console.log("💬 Refresh success for %s", auth.id)
            return resolve({
                success: true,
                updated: true,
                deleted: false
            })
            

        })

    }

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
}

module.exports = Request