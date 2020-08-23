// Little helper to enable handlebars templating in koa
// This was written by Jonathan Cohen and Brandon Gart
// There does not seem to be any existing templating/layout libraries
// that are actually up to date with KOA's release as of 7/12/2020
// so I wrote this little helper with brandon and his group
// to allow them to use simple layouts with KOA.

module.exports = function(defaultLayout) {
    // Process default layout
    // if nothing's provide, use `main`,
    // and regardless, stick `layouts/` in front
    defaultLayout = "layouts/" + (defaultLayout || "main");
    
    // Return a KOA middleware function
    return async (ctx, next) => {
        // gets called after handlebars does it stuff
        // on every request...
        
        // prepare a data object, so we can use it later.
        // and stick it into the context
        // this should be what is used when rendering a page template
        ctx.data = {}
        
        // Await rest of middleware stack
        await next();
        
        // After all other middleware is finished:
        // See if a '.handlebars' template was rendered,
        if (ctx.data.filename && ctx.data.filename.endsWith(".handlebars")) {
            // if one was,
            // render the layout template,
            // and stick the page template body inside
            ctx.data.body = ctx.body
            await ctx.render(defaultLayout, ctx.data);
        }
    }
    
}
