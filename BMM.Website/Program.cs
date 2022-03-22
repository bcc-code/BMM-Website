using BMM.Website;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var indexFile = File.ReadAllText("wwwroot/index.html");

app.MapGet("/track/99144", () => new HtmlResult(indexFile, "Forward! No Relenting!", "BF Winnipeg 2018"));

var handler = () => new HtmlResult(indexFile, "bmm", "Listen to edifying music and messages");

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

app.UseStaticFiles();

//ToDo: <add name="Content-Security-Policy" value="frame-ancestors https://*.bcc.no" /> for logout-redirect.html and logout.html
app.Run();