
const Router = require("koa-router");
const router = new Router();

router.get("/", async (ctx) => {
	ctx.data.yes = "oh thats how it is";
	await ctx.template("index");
});

module.exports = router;
