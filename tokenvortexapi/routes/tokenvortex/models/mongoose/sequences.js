var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var sequencesSchema = new Schema({
    entityType: String,
    name: String,
    posId: Number,
    description: String,
    user_id: String,
    steps: Array,
    logs: Array,
    isActive: Boolean,
    status: String
  });
  
  var SequencesModel = mongoose.model("sequences", sequencesSchema, "sequences");
  
  module.exports = SequencesModel;