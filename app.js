// Static setup + Builtin dependencies
const fs_ = require("fs");
const fs = require("fs-promise-native");
const IS_DEV = fs_.existsSync("./.dev");

// !ATCHUNG!: Extremely hacky stuff.
// This makes any code using `using()` only work in this application.
global.using = require('app-root-path').require;
const DUCKPUNCHED = require("./duckpunches");
// console.log("Duckpunches: ", DUCKPUNCHED);

// Package dependencies
const Koa = require('koa');
const views = require("koa-views");
const bodyParser = require("koa-bodyparser");
const static = require("koa-static");
// @publish: pseudo-package. Maybe publish eventually?
const layout = require("./middleware/koa-layout"); 

// Own code dependencies
// const db = require("./db");
// @TODO: Make these a part of config.
const HOST = IS_DEV ? "localhost" : "eehhh.westus.cloudapp.azure.com"
const PORT = IS_DEV ? 3000 : 80;
const HTTPS = false;

const app = new Koa();
app.use(bodyParser());
app.use(static("public"));
app.use(layout("main", "hbs"));

app.use(views(`${__dirname}/views`,
	{ 
		extension: "hbs",
		map: { hbs: "handlebars" }
	}
))

const router = require("./routes");
app.router(router);


async function main() {
	
	// await db.sequelize.sync({ force: true });
	
	app.on('error', err => { console.error("internal server error:", err); });

	app.listen(PORT, function() {
		let fullhost = `${HTTPS ? "https" : "http"}://${HOST}`;
		if (PORT !== 80 && PORT !== 443) {
			fullhost += `:${PORT}`;
		}
		
		console.log(`App listening at ${fullhost}`);
	});
	
}


main();
