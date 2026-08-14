using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;

namespace OnnoRokomBackend.Middleware;

public class GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An unhandled exception occurred during request processing.");
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, title, detail) = exception switch
        {
            KeyNotFoundException notFound => (
                (int)HttpStatusCode.NotFound,
                "Resource Not Found",
                notFound.Message),
            UnauthorizedAccessException forbidden => (
                (int)HttpStatusCode.Forbidden,
                "Forbidden",
                forbidden.Message),
            InvalidOperationException badOp => (
                (int)HttpStatusCode.BadRequest,
                "Bad Request",
                badOp.Message),
            ArgumentException badArg => (
                (int)HttpStatusCode.BadRequest,
                "Invalid Argument",
                badArg.Message),
            _ => (
                (int)HttpStatusCode.InternalServerError,
                "Internal Server Error",
                env.IsDevelopment() ? exception.Message : "An unexpected error occurred.")
        };

        var problemDetails = new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = detail,
            Instance = context.Request.Path
        };

        context.Response.ContentType = "application/problem+json";
        context.Response.StatusCode = statusCode;

        return context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
    }
}
