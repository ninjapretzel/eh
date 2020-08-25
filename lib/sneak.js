
/** Loads a dependency with "using",
@param {string} file - file to load.
@param {any} defaultValue - Default value
@returns using'd value of file, or defaultValue if failed. */
function sneak(file, defaultValue) {
	let value = null;
	try { value = using(file); } 
	catch (err) { value = defaultValue; }
	
	return value;
}
module.exports = sneak;
