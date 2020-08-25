module.exports = function(spec) {
	const copy = {...spec};
	const keys = Object.keys(copy);
	for (let k of keys) {
		
		const rev = ""+copy[k]
		copy[rev] = k;
	}
	return copy;
}
