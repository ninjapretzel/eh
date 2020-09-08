const Schema = require("mongoose").Schema;

const UserAccountCreation = new Schema({
	ip: { type: String, required: "LoginAttempt must record ip" },
	email: { type: String, required: "LoginAttempt must record email"  },
	hash: { type: String, required: "LoginAttempt must record password hash"  },
	success: { type: Boolean, required: "LoginAttempt must record success"  },
	creation: { type: Boolean, required: "LoginAttempt must record creation status"  },
	result: { type: Number, required: "LoginAttempt must record result enum"  },
	result_desc: { type: String, required: "LoginAttempt must record result description"  },
	guid: { type: String }, //Optional, user guid if login was successful.
	pass: { type: String }, // Optional, if password did not match db.
	timestamp: { type: Date, default: ()=>new Date() }, 
});

module.exports = UserAccountCreation;
