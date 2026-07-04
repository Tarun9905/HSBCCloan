const mongoose = require('mongoose')

const RegisterSchema = mongoose.Schema({
    userName:{ type: String, required: true ,unique: true},
    accountType:{ type: String, required: true},
    password:{ type: String, required: true },
    accountNo:{ type: String, required: true, unique: true },
    ifsc: { type: String, required: true },
    logonDate: { type: Date, default: Date.now },
    lastLoginDate: { type: Date},
})

const RegisterModel = mongoose.model('Registration',RegisterSchema)

module.exports = RegisterModel