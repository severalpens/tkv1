var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var logsSchema = new Schema({
  sequence_id: String,
  step: Object,
  tx: Object
  });
  
  var LogsModel = mongoose.model("logs", logsSchema, "logs");
  
  module.exports = LogsModel;