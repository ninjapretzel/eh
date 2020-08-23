
// Polyfills are duckpunches.
if (!String.prototype.replaceAll) {
/** Partial polyfill for ES262 replaceAll.
See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replaceAll 
@param {string} pattern - Pattern to match (must be string) 
@param {string} replace - String to replace matches with 
@returns {string} replaced string value*/
	String.prototype.replaceAll = function(pattern, replace) {
		const actualMatch = new RegExp(pattern, "g");
		return this.replace(actualMatch, replace);
	}
}

module.exports = "STRING"
