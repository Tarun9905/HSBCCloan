const mongoose = require('mongoose');

const BeneficiarySchema = new mongoose.Schema({
  beneficiaryName: {type: String,required: true},
  ownerUserName:{ type: String, required: true },
  ownerAccountNumber:{ type: String, required: true },
  beneficiaryNickName: {type: String},
  beneficiaryType: {type: String,required: true},
  beneficiaryAccountNumber: {type: String,required: true},
  ifsc: {type: String,required: true}
});

const BeneficiaryModel = mongoose.model('Beneficiary', BeneficiarySchema);

module.exports = BeneficiaryModel;