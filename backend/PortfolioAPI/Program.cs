using Npgsql.EntityFrameworkCore.PostgreSQL;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.FileProviders;
using PortfolioAPI.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
  options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
  {
    In = ParameterLocation.Header,
    Description = "Enter JWT Token",
    Name = "Authorization",
    Type = SecuritySchemeType.Http,
    Scheme = "bearer",
    BearerFormat = "JWT"
  });
  options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[]{}
        }
    });
});

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(options =>
{
  options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
  options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
  var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
  options.TokenValidationParameters = new TokenValidationParameters
  {
    ValidateIssuer = true,
    ValidateAudience = false,
    ValidateLifetime = true,
    ValidateIssuerSigningKey = true,
    ValidIssuer = builder.Configuration["Jwt:Issuer"],
    IssuerSigningKey = new SymmetricSecurityKey(key)
  };
});

builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngular",
      policy =>
      {
        policy.WithOrigins(
              "http://localhost:4200",
              "https://portfolionlf.netlify.app" 
          )
          .AllowAnyHeader()
          .AllowAnyMethod();
      });
});

var app = builder.Build();

// Always show Swagger (useful for testing deployed API)
app.UseSwagger();
app.UseSwaggerUI();

// 🔴 CORS MUST BE BEFORE AUTH
app.UseCors("AllowAngular");

// 🔴 THEN AUTH
app.UseAuthentication();
app.UseAuthorization();

// 🔴 CREATE UPLOADS FOLDER IF IT DOESN'T EXIST (fixes container deployment)
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
if (!Directory.Exists(uploadsPath))
  Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(uploadsPath),
  RequestPath = "/Uploads"
});

// Auto-run migrations on startup
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
  db.Database.Migrate();
}

app.MapControllers();
app.Run();
