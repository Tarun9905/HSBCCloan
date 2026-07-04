const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  fromAccountUserName:{ type: String, required: true },
  fromAccountNumber: {type: String,required: true},
  toAccountUserName:{ type: String, required: true },
  toAccountNumber: {type: String,required: true},
  amount: {type: Number,required: true},
  transferType: {type: String},
  rtgsTransferType: {type: String},
  referance: {type: String},
  recurring: {type: String},
  date: {type: Date},
});

const TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports = TransactionModel;