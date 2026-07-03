const mongoose = require('mongoose');

const AmountDepositSchema = new mongoose.Schema({
  accountUserName:{ type: String, required: true },
  accountNumber: {type: String,required: true,unique: true},
  amount: {type: Number,required: true},
  date: {type: Date, default: Date.now}
});

const AmountDepositModel = mongoose.model('AmountDeposit', AmountDepositSchema);

module.exports = AmountDepositModel;