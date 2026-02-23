const mongoose = require('mongoose')

const Admin = mongoose.Schema({

    id: { type: String, require: true },
    type: { type: String, default: 0 },
    typeTime: { type: Date, default: null },

    Log_Auth: { type: String, require: true },
    Log_Refresh: { type: String, require: true },
    Log_Command: { type: String, require: true },

    Token: { type: String, default: "" },
    Secret: { type: String, default: null },
    Status: { type: Array, default: [{ name: "Verification of -username-", status: "idle"}] },

    Owners: { type: String, default: "" }, //! Manager botundan 
    Whitelist_Owners: { type: Array, default: [] }, //! Manager botu ile eklenip çıkartılacak, tüm komutlara erişimi olucak. (Switch hariç)
    Whitelist: { type: Array, default: [] },
    Features: { type: Array, default: [] },
    AuthoriseServer: { type: Array, default: [] },

    lastUsage: { type: Date, default: null },
    switchKey: { type: String, default: null },

})

module.exports = mongoose.model('OwnerCord_Bots', Admin)