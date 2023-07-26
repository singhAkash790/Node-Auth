const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  // Schema definition for your data fields
  name:{
    type:"string",
    required:true
},
discription:{
    type:"string",
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
}
});

const DataModel = mongoose.model("DataModel", dataSchema);
module.exports = DataModel;
