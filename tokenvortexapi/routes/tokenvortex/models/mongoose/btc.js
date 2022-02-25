var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var btcSchema = new Schema({
    user_id: String,
    settings: Object,
    results: Array,
    balances: Array
  });


  
  var BtcModel = mongoose.model("btc", btcSchema, "btc");
  
  module.exports = BtcModel;