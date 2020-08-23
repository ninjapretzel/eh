

String.prototype.replaceAll = function(pattern, replace) {
	const actualMatch = new RegExp(pattern, "g");
	return this.replace(actualMatch, replace);
}

module.exports = "STRING"
