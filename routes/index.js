const quickdraw = using("lib/quickdraw");

const Router = require("koa-router");
const router = new Router();

quickdraw(__filename, (rt, path, err) => {
	if (!err) {
		// console.log(`Hooked up router: [${path}]`);
		router.nest("/"+path, rt);
	} else {
		console.log(`Failed to load router: [${path}]`, err);
	}
});

router.get("/", async (ctx) => {
	ctx.data.yes="no";
	await ctx.template("index");
})

module.exports = router;
