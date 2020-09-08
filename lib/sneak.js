
/** Loads a HIDDEN/IGNORED dependency with "using",
@param {string} file - file to load.
@param {any} defaultValue - Default value
@returns using'd value of file, or defaultValue if failed. */
function sneak(file, defaultValue) {
	let value = null;
	try { value = using(file); } 
	catch (err) { 
		console.error(`Hey, smartypants- you forgot to make a hidden/ignored file: ${file}`);
		value = defaultValue; 
	}
	
	return value;
}
module.exports = sneak;
