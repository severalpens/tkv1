var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var stepsSchema = new Schema({
  entityType: String,
  status: String,
  network:  String,
  msgSender_id:  String,
  contract_id:  String,
  constant: Boolean,
  orderId: Number,
  method: Object,
  name: String,
  user_id: String,
  payable: Boolean,
  stateMutability: String
  });
  
  var StepsModel = mongoose.model("steps", stepsSchema, "steps");
  
  module.exports = StepsModel;
  