
using Employee_Management.Data;
using Employee_Management.Middleware;
using Employee_Management.Services;
using Employee_Management.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Employee_Management
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            builder.Services.AddScoped<IEmployeeService, EmployeeService>();
            builder.Services.AddScoped<IDepartmentService, DepartmentService>();
            builder.Services.AddScoped<IAttendanceService, AttendanceService>();
            builder.Services.AddScoped<AuthService>();

            builder.Services.AddControllers();
           
            builder.Services.AddOpenApi();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecific",
                 policy => policy
                .WithOrigins("http://localhost:5173")
                .WithMethods("GET", "POST", "PUT", "DELETE")
                .WithHeaders("Content-Type", "Authorization")
);  
            });



            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
                app.UseSwagger();
                app.UseSwaggerUI();
            }
            
            app.UseHttpsRedirection();

            app.UseMiddleware<ExceptionMiddleware>();

            app.UseCors("AllowSpecific");

            app.UseAuthentication();

            app.UseAuthorization();
      
            app.MapControllers();

            app.Run();
        }
    }
}
