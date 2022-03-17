using BMM.Website;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var indexFile = File.ReadAllText("wwwroot/index.html");

app.MapGet("/", () => "Hello World!");
app.MapGet("/track/99888", () =>
{
    return new HtmlResult(indexFile, "bmm", "Listen to edifying music and messages");
});
app.UseStaticFiles();
app.MapGet("*", () => "catch all");

app.Run();