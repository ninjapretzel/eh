const Router = require("koa-router");
const mongoose = require("mongoose");
const uuid = require("uuid");
const argon2 = require("argon2");
const jwt = using("lib/jwt-promise");
const emailValidator = require("email-validator");

const config = using("config").login;
const db = using("db");
const Enum = using("lib/Enum");
const router = new Router();

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
	Failed_MissingInformation: 10007,
});

const VERSION_MISMATCH = `Version mismatch, please update to ${config.version}`
/** Default validation for emails. Restricts length between 3-256 characters, 
and be a valid email according to "email-validator" */
function DefaultValidateUsername(email) {
	if (typeof(email) !== "string") { return false; }
	if (email.length < 3 || email.length > 256) { return false; }
	return emailValidator.validate(email);
}
/** Default validation for Passwords. Only restricts length to be over 8 characters long. */
function DefaultValidatePassword(password) { return (typeof(password) == "string") && password.length >= 8; }
config.usernameValidator = DefaultValidateUsername;
config.passwordValidator = DefaultValidatePassword;

/** Signs {User} data into a token.
@param {object} user data to sign*/
async function signToken(user) { const { email, ip, id } = user;
	const token = { email, ip, id };
	return jwt.sign(token, config.secret, {expiresIn: 60 * 60 })
}
/** Creates a new user, and checks for account creation cooldown. 
@param {Object} data Initial user creation data. 
@returns {Promise<Object|null>} User if successful, null otherwise. */
async function CreateNewUser(data) { const { email, hash, ip, local } = data;
	const now = new Date().getTime();
	const registrations = (await db.UserAccountCreation.find({ip}).exec())
		.filter(it => (it.timestamp.getTime() > now - config.cooldown) );
	
	if (local || registrations.length < config.maxRegistrations) {
		const guid = uuid.v4();
		await db.UserAccountCreation.create({ ip, email });
		return await db.User.create({ email, hash, ip, guid });
	}
	return null;
}

/** KOA Middleware function which ensures a token, and a user, exist within the context before proceeding. 
Assigns `ctx.token`'s contents to be the unpacked token,
and assigns `ctx.user`'s contents to be the `db.User` record of the matching user.
handles any other response as a generic failure message. { success:false, message:String } */
async function verifyToken(ctx, next) {
	const { ip } = ctx.request;
	const { token } = ctx.request.body;
	const unpacked = await jwt.unpack(token, config.secret);
	if (!unpacked) {
		ctx.body = { success: false, message: "Token is invalid. Please login again." }; 
		return;
	}
	if (ip != unpacked.ip) { 
		ctx.body = { success: false, message: "Connection reset. Please login again." }; 
		return; 	
	}
	
	const query = { _id: unpacked.id };
	const user = await db.User.findOne(query);
	if (!user) { 
		ctx.body = { success: false, message: "User not found." }; 
		return; 
	}
	if (ip != user.ip) { 
		ctx.body = { success: false,  message: "IP does not match login IP. Please login again." }; 
		return; 
	}
	
	ctx.token = unpacked;
	ctx.user = user;
	await next();
}

router.post("/refresh", verifyToken, async (ctx) => {
	const token = await signToken(ctx.user);
	ctx.body = { success: true, token };
});

router.post("/", async (ctx) => {
	const { ip } = ctx.request;
	let { email, pass, clientVersion } = ctx.request.body
	const local = (ip === "::1" || ip == "127.0.0.1");
	let result = LoginResult.Failed_Unspecified;
	let message = "none given";
	clientVersion = clientVersion || "[[Version Not Set]]";
	let creds = null;
	let hash = (pass) ? (await argon2.hash(pass)) : "/no password to hash/";
	let userInfo = null;
	
	console.log(result, LoginResult[result]);
	{ // submethod CheckLogin();
		if (!email || !pass) {
			message = "Need to provide email/pass";
			result = LoginResult.Failed_MissingInformation;
		} else if (clientVersion !== config.version) {
			message = VERSION_MISMATCH;
			result = LoginResult.Failed_VersionMismatch;
		} else if (!config.usernameValidator(email)) {
			message = "Invalid Email";
			result = LoginResult.Failed_BadEmail;
		} else {
			userInfo = await db.User.findOne({ email }).exec();
			if (!userInfo) {
				userInfo = await CreateNewUser({ email, hash, local, ip });
				if (userInfo) {
					result = LoginResult.Success_Created;
					creds = { email }
				} else {
					message = "Too many account creations"
					result = LoginResult.Failed_CreationCooldown;
				}
			} else {
				if (!await argon2.verify(userInfo.hash, pass)) {
					message = "Bad Credentials";
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
			guid: userInfo && userInfo.guid,
			creation: result === LoginResult.Success_Created,
			result, result_desc: LoginResult[""+result]
		};
		// Only inject password if password match failed.
		if (result === LoginResult.Failed_BadCredentials) { data.pass = pass; }
		console.log("Recording Data:", data);
		
		await db.LoginAttempt.create(data);
	} // submethod RecordLoginAttempt();
	
	{ // submethod Respond();
		if (!creds) {
			ctx.body = { success: false, message };
			// Events.on("LoginFailure", { ip });
		} else {
			userInfo.lastLogin = new Date();
			userInfo.ip = ip;
			userInfo.save();
			// Events.on("LoginSuccess", { ip });
			token = await signToken(userInfo);
			ctx.body = { success: true, token }
		}
	} // submethod Respond();
	
	
});

router.verifyToken = verifyToken;
module.exports = router;
