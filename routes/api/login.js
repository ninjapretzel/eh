const Router = require("koa-router");
const mongoose = require("mongoose");
const argon2 = require("argon2");
const jwt = using("lib/jwt-promise");
const emailValidator = require("email-validator");

const config = using("config").login;
const db = using("db");
const Enum = using("lib/Enum");

const LoginResult = Enum({
	Success_Created: 1,
	Success: 2,
	Failed_Unspecified: 10000,
	Failed_VersionMismatch: 10001,
	Failed_BadCredentials: 10002,
	Failed_LoginCooldown: 10003,
	Failed_CreationCooldown: 10004,
	Failed_BadEmail: 10005,
	Failed_AlreadyLoggedIn: 10006,
});

const VERSION_MISMATCH = `Version mismatch, please update to ${config.version}`
function DefaultValidateUsername(email) {
	if (typeof email !== "string") { return false; }
	if (email.length < 3 || email.length > 256) { return false; }
	
	return emailValidator.validate(email);
}
function DefaultValidatePassword(password) {return password.length >= 8; }
config.usernameValidator = DefaultValidateUsername;
config.passwordValidator = DefaultValidatePassword;

async function CreateNewUser(data) {
	const { email, hash, ip, local } = data;
	
	const now = new Date().getTime();
	const registrations = (await db.UserAccountCreation.find({ip}).exec())
		.filter(it => (it.timestamp.getTime() > now - config.cooldown) );
	
	if (local || registrations.length < config.maxRegistrations) {
		
		const user = await db.User.create({ email, hash });
		
	}
}

const router = new Router();

router.post("/", async (ctx) => {
	const { ip } = ctx.request;
	let { email, pass, clientVersion } = ctx.request.body
	const local = (ip === "::1" || ip == "127.0.0.1");
	let result = LoginResult.Failed_Unspecified;
	let reason = "none given";
	clientVersion = clientVersion || "[[Version Not Set]]";
	let creds = null;
	let hash = (pass) ? (await argon2.hash(pass)) : "/no password to hash/";
	let userInfo = null;
	
	{ // submethod CheckLogin();
		if (!email || !pass) {
			reason = "Need to provide email/pass";
		} else 	if (clientVersion != config.version) {
			reason = VERSION_MISMATCH;
			result = LoginResult.Failed_VersionMismatch;
		} else if (!config.usernameValidator(email)) {
			reason = "Invalid Email";
			result = LoginResult.Failed_BadUsername;
		} else {
			userInfo = await db.User.findOne({ email }).exec();
			if (!userInfo) {
				userInfo = await CreateNewUser({ email, hash, local, ip });
				if (userInfo) {
					result = LoginResult.Success_Created;
					creds = { email }
				} else {
					reason = "Too many account creations"
					result = LoginResult.Failed_CreationCooldown;
				}
			} else {
				if (!await argon2.verify(userInfo.hash, pass)) {
					reason = "Bad Credentials";
					result = LoginResult.Failed_BadCredentials;
				} else {
					creds = { email }
					result = LoginResult.Success;
				}
			}
		} 
			
	} // submethod CheckLogin();
	
	{ // submethod RecordLoginAttempt();
		let data = {
			ip, email, hash,
			success: !!userInfo,
			creation: result === LoginResult.Success_Created,
			result, result_desc: LoginResult[result]
		}
		
		await db.LoginAttempt.create(data);
	} // submethod RecordLoginAttempt();
	
	{ // submethod Respond();
		if (!creds) {
			ctx.body = { success: false, reason };
			// Events.on("LoginFailure", { ip });
		} else {
			userInfo.lastLogin = new Date();
			userInfo.save();
			// Events.on("LoginSuccess", { ip });
			token = await jwt.sign({id: userInfo.id, ip, email}, config.secret, {expiresIn: 60 * 60 })
			
			ctx.body = { success: true, token }
		}
	} // submethod Respond();
	
	
});

module.exports = router;
