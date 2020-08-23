const Koa = require('koa');
const Router = require('koa-router');

// Having to require uses per router is just silly.
Koa.prototype.router = function(router) { this.use(router.routes()).use(router.allowedMethods()); }
// Same thing here. Just one call is preferred.
Router.prototype.nest = function(path, rt) { this.use(path, rt.routes(), rt.allowedMethods()); }


module.exports = "KOA";
