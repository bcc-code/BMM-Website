using System.Net.Mime;
using System.Text;

namespace BMM.Website;

public class HtmlResult : IResult
{
    private readonly string _indexHtml;
    private readonly string _title;
    private readonly string _description;
    private const string Placeholder = "<!-- {{MetadataPlaceholder}} -->";

    public HtmlResult(string indexHtml, string title, string description)
    {
        _indexHtml = indexHtml;
        _title = title;
        _description = description;
    }
    
    public Task ExecuteAsync(HttpContext httpContext)
    {
        //ToDo: load actual metadata 
        var metaTags =
            $"<meta property=\"og:title\" content=\"{_title}\"><meta property=\"og:description\" content=\"{_description}\">\n";
        var adjustedHtml = _indexHtml.Replace(Placeholder, metaTags);

        httpContext.Response.Headers.Append("Cache-Control", "no-store");
        
        httpContext.Response.ContentType = MediaTypeNames.Text.Html;
        httpContext.Response.ContentLength = Encoding.UTF8.GetByteCount(adjustedHtml);
        return httpContext.Response.WriteAsync(adjustedHtml);
    }
}