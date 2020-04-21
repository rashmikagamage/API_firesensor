const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
    
    id : {type: String},
    floorNo : {type:String},
    roomNo : {type:String},
    customerPhone : {type:String},
    customerMail : {type:String}

    
});

const RoomDetails = mongoose.model('RoomDetails',RoomSchema);


module.exports = RoomDetails;