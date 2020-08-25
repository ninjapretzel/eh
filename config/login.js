const hidden = sneak("config/hidden", {
	secret: "yeah right"
});

module.exports = {
	maxRegistrations: 5,
	cooldown: 120000,
	version: "0.0.0",
	secret: hidden.secret
}
