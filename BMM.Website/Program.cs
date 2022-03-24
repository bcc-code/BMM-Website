using System.Globalization;
using BMM.Website;
using Microsoft.AspNetCore.Rewrite;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var indexFile = File.ReadAllText("wwwroot/index.html");

var handler = () => new HtmlResult(indexFile, "bmm", "Listen to edifying music and messages");

app.MapGet("/", handler);
app.MapGet("index.html", handler);
app.MapGet("/track/99144", () => new HtmlResult(indexFile, "Forward! No Relenting!", "BF Winnipeg 2018"));

// Make sure all patterns from client/app/scripts/app.js are also in here
app.MapGet("welcome/{*.}", handler);
app.MapGet("music/{*.}", handler);
app.MapGet("messages/{*.}", handler);
app.MapGet("speeches/{*.}", handler);
app.MapGet("video/{*.}", handler);
app.MapGet("archive/{*.}", handler);
app.MapGet("audiobooks/{*.}", handler);
app.MapGet("album/{*.}", handler);
app.MapGet("track/{*.}", handler);
app.MapGet("playlist/{*.}", handler);
app.MapGet("groupgoal/{*.}", handler);
app.MapGet("copyright/{*.}", handler);

app.UseRewriter(new RewriteOptions()
    .AddRewrite("^admin(?!.*\\.(js|css|jpg|svg|png|html|txt|json|map|woff|eot|ttf|woff2|ico|gif)($|\\?)).*",
        "admin/index.html", true));

app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        // Cache static files for 30 days
        ctx.Context.Response.Headers.Append("Cache-Control", "public,max-age=2592000");
        ctx.Context.Response.Headers.Append("Expires",
            DateTime.UtcNow.AddDays(30).ToString("R", CultureInfo.InvariantCulture));
    }
});

//ToDo: <add name="Content-Security-Policy" value="frame-ancestors https://*.bcc.no" /> for logout-redirect.html and logout.html
app.Run();