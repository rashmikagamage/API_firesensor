const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SensorSchema = new Schema({
    
    id : {type: String},
    active: {type:Boolean},
    floorNo : {type:String},
    roomNo : {type:String},
    smokeLevel : {type:Number},
    co2Level : {type:Number}

    
});

const Sensors = mongoose.model('Sensors',SensorSchema);


module.exports = Sensors;