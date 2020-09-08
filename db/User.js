const Schema = require("mongoose").Schema;

const User = new Schema({
	guid: { type: String, required: "User GUID must be set!" },
	email: { type: String, minlength: 1, maxlength: 128, required: "User must have email!" },
	hash: { type: String, required: "User must have a password hash!" },
	ip: { type: String, required: "User IP must be assigned (last login IP)" },
	timestamp: { type: Date, default: ()=>new Date() },
	lastLogin: { type: Date, default: ()=>new Date() },
});

module.exports = User;
