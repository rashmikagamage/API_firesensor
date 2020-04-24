const mongoose = require('mongoose'); // Import the mongoose module
const Schema = mongoose.Schema; // Define a schema

const RoomSchema = new Schema({ // create the schema for the room
    
    id : {type: String},
    floorNo : {type:String},
    roomNo : {type:String},
    customerPhone : {type:String},
    customerMail : {type:String}

    
});

const RoomDetails = mongoose.model('RoomDetails',RoomSchema); // Compile model from schema


module.exports = RoomDetails;