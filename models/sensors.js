const mongoose = require("mongoose"); // Import the mongoose module
const Schema = mongoose.Schema; // Define a schema

const SensorSchema = new Schema({
	// create the schema for the senosr

	id: { type: String },
	active: { type: Boolean },
	floorNo: { type: String },
	roomNo: { type: String },
	smokeLevel: { type: Number },
	co2Level: { type: Number },
});

const Sensors = mongoose.model("Sensors", SensorSchema); // Compile model from schema

module.exports = Sensors;
