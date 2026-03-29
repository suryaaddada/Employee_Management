using System.Net;
using System.Text.Json;

namespace Employee_Management.Middleware
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.InternalServerError;
            var message = ex.Message;

            if (ex.Message.Contains("Invalid Department"))
                statusCode = HttpStatusCode.BadRequest;

            if (ex.Message.Contains("already exists"))
                statusCode = HttpStatusCode.BadRequest;

            var result = JsonSerializer.Serialize(new
            {
                status = (int)statusCode,
                error = message
            });

            context.Response.StatusCode = (int)statusCode;
            return context.Response.WriteAsync(result);
        }
    }
}