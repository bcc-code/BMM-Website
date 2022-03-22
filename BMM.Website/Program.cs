using BMM.Website;

var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

var indexFile = File.ReadAllText("wwwroot/index.html");

app.MapGet("/track/99144", () => new HtmlResult(indexFile, "Forward! No Relenting!", "BF Winnipeg 2018"));
app.UseStaticFiles();
app.MapGet("{*.}", () => new HtmlResult(indexFile, "bmm", "Listen to edifying music and messages"));

app.Run();