var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var entitiesSchema = new Schema({
  // _id?: string;
    user_id: String,
    entityType: String,
    name: String,
    body: Object,
    options: Array,
    lifespan: String,
    buildOptions: Object
  });


  
  var EntitiesModel = mongoose.model("entities", entitiesSchema, "entities");
  
  module.exports = EntitiesModel;