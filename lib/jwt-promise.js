
const jwt = require("jsonwebtoken");

/** @see {jwt.sign} but with promises! 
@param {string|object|Buffer} payload - payload to encode
@param {import("jsonwebtoken").Secret} privateOrSecretKey - secret for encryption
@param {import("jsonwebtoken").SignOptions} options - options for signing
@returns {Promise<string>} - encoded jwt*/
function sign(payload, privateOrSecretKey, options) {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, privateOrSecretKey, options, (err, token) => err ? reject(err) : resolve(token));
	});
}

/** @see {jwt.verify} but with promises! 
@param {string} token - encoded jwt
@param {import("jsonwebtoken").Secret} secretOrPublicKey - secret for decryption
@param {import("jsonwebtoken").SignOptions} options - options for decoding
@returns {Promise<object>} promise - result of verification, or throws if token is invalid */
function verify(token, secretOrPublicKey, options) {
	return new Promise((resolve, reject) => {
		jwt.verify(token, secretOrPublicKey, options, (err, payload) => err ? reject(err) : resolve(payload));
	});
}

/** @see {jwt.verify} but with promises and no errors! 
@param {string} token - encoded jwt
@param {import("jsonwebtoken").Secret} secretOrPublicKey - secret for decryption
@param {import("jsonwebtoken").SignOptions} options - options for decoding
@returns {Promise<{payload:object, meta:{iat:number,exp:number}}>} promise - result of verification. , or null if token is invalid */
async function unpack(token, secretOrPublicKey, options) {
	try { return await verify(token, secretOrPublicKey, options); } 
	catch (err) { return null; }
}

const jwtpromised = { sign, verify, unpack }


module.exports = jwtpromised;
