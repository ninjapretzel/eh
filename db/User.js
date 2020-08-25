const Schema = require("mongoose").Schema;

const User = new Schema({
	email: { type: String, minlength: 1, maxlength: 128, required: "User must have email!" },
	hash: { type: String, required: "User must have passhash!" },
	timestamp: { type: Date, default: ()=>new Date() },
	lastLogin: { type: Date, default: ()=>new Date() },
});

module.exports = User;
