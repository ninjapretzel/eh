const Schema = require("mongoose").Schema;

const UserAccountCreation = new Schema({
	ip: { type: String },
	email: { type: String },
	timestamp: { type: Date, default: ()=>new Date() }, 
});

module.exports = UserAccountCreation;
