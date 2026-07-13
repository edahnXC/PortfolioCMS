using CloudinaryDotNet;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using System.Text;

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

// ── Connection string ──
var rawConn = builder.Configuration.GetConnectionString("DefaultConnection")
              ?? Environment.GetEnvironmentVariable("DATABASE_URL")
              ?? "";

if (rawConn.StartsWith("postgres://") || rawConn.StartsWith("postgresql://"))
{
  var uri = new Uri(rawConn);
  var userInfo = uri.UserInfo.Split(':');
  rawConn = $"Host={uri.Host};Port={uri.Port};" +
            $"Database={uri.AbsolutePath.TrimStart('/')};" +
            $"Username={userInfo[0]};Password={userInfo[1]};" +
            $"SSL Mode=Require;Trust Server Certificate=true";
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(rawConn));

// ── Cloudinary ──
var cloudName = Environment.GetEnvironmentVariable("CLOUDINARY_CLOUD_NAME") ?? "";
var apiKey    = Environment.GetEnvironmentVariable("CLOUDINARY_API_KEY") ?? "";
var apiSecret = Environment.GetEnvironmentVariable("CLOUDINARY_API_SECRET") ?? "";

var cloudinaryAccount = new Account(cloudName, apiKey, apiSecret);
builder.Services.AddSingleton(new Cloudinary(cloudinaryAccount));

// ── JWT ──
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

// ── CORS ──
builder.Services.AddCors(options =>
{
  options.AddPolicy("AllowAngular", policy =>
  {
    policy.AllowAnyOrigin()
    .AllowAnyHeader()
    .AllowAnyMethod();
  });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseCors("AllowAngular");
app.UseAuthentication();
app.UseAuthorization();

// Create Uploads folder
var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
if (!Directory.Exists(uploadsPath))
  Directory.CreateDirectory(uploadsPath);

app.UseStaticFiles(new StaticFileOptions
{
  FileProvider = new PhysicalFileProvider(uploadsPath),
  RequestPath = "/Uploads"
});

// Auto-run migrations
using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
  db.Database.Migrate();
}

// Seed admin
using (var scope = app.Services.CreateScope())
{
  var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
  if (!context.Admins.Any())
  {
    var adminUsername = Environment.GetEnvironmentVariable("ADMIN_USERNAME") ?? "admin";
    var adminPassword = Environment.GetEnvironmentVariable("ADMIN_PASSWORD") ?? "admin123";
    context.Admins.Add(new Admin
    {
      Username = adminUsername,
      PasswordHash = BCrypt.Net.BCrypt.HashPassword(adminPassword)
    });
    context.SaveChanges();
  }
}

app.MapControllers();
app.Run();