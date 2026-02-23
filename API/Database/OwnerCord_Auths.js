const mongoose = require('mongoose')

const Auths = mongoose.Schema({

    id: { type: String, require: true },
    bot: { type: String, require: true },
    guild: { type: String, require: true },

    avatar: { type: String, require: true },
    locale: { type: String, require: true },
    localename: { type: String, require: true },

    access_token: { type: String, require: true },
    refresh_token: { type: String, require: true },
    expires_date: { type: Date, require: true },
    expires_in: { type: String, require: true },
    ipadress: { type: String, require: true },

    refreshFailed: { type: String, require: true, default: 0 },
    userInformationFailed: { type: String, require: true, default: 0 }

})

module.exports = mongoose.model('OwnerCord_Auth', Auths)