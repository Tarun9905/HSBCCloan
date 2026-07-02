const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  beneficiaryName: {type: String,required: true},
  accountUserName:{ type: String, required: true },
  beneficiaryNickName: {type: String},
  beneficiaryType: {type: String,required: true},
  accountNumber: {type: String,required: true,unique: true},
  ifsc: {type: String,required: true}
});

const BeneficiaryModel = mongoose.model('Beneficiary', BeneficiarySchema);

module.exports = BeneficiaryModel;