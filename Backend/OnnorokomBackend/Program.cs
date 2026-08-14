using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;
using OnnoRokomBackend.Configuration;
using OnnoRokomBackend.DbContext;
using OnnoRokomBackend.Middleware;
using OnnoRokomBackend.Repository;
using OnnoRokomBackend.Seed;
using OnnoRokomBackend.Services.AcademicTerms;
using OnnoRokomBackend.Services.Assignments;
using OnnoRokomBackend.Services.Auth;
using OnnoRokomBackend.Services.Batches;
using OnnoRokomBackend.Services.CourseEnrollments;
using OnnoRokomBackend.Services.Courses;
using OnnoRokomBackend.Services.SubmissionAttachments;
using OnnoRokomBackend.Services.Submissions;
using OnnoRokomBackend.Services.TeacherCourseAllocations;
using OnnoRokomBackend.Services.Users;
using OnnoRokomBackend.UnitOfWork;
using Scalar.AspNetCore;

DotEnv.AutoLoad();

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    connectionString = Environment.GetEnvironmentVariable("DB_CONN");
}

if (string.IsNullOrWhiteSpace(connectionString))
{
    throw new InvalidOperationException("Database connection string must be configured in appsettings (ConnectionStrings:DefaultConnection) or .env (DB_CONN).");
}

var jwtOptions = builder.Configuration.GetSection(JwtOptions.SectionName).Get<JwtOptions>() ?? new JwtOptions();

if (string.IsNullOrWhiteSpace(jwtOptions.Issuer))
{
    jwtOptions.Issuer = Environment.GetEnvironmentVariable("Jwt__Issuer") ?? "OnnoRokomBackend";
}
if (string.IsNullOrWhiteSpace(jwtOptions.Audience))
{
    jwtOptions.Audience = Environment.GetEnvironmentVariable("Jwt__Audience") ?? "OnnoRokomFrontend";
}
if (string.IsNullOrWhiteSpace(jwtOptions.SigningKey))
{
    jwtOptions.SigningKey = Environment.GetEnvironmentVariable("Jwt__SigningKey")
        ?? throw new InvalidOperationException("Jwt:SigningKey must be configured in appsettings or .env.");
}

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection(JwtOptions.SectionName));
builder.Services.Configure<FileUploadOptions>(builder.Configuration.GetSection(FileUploadOptions.SectionName));
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services.AddScoped(typeof(IRepository<>), typeof(EFRepository<>));
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAcademicTermService, AcademicTermService>();
builder.Services.AddScoped<IBatchService, BatchService>();
builder.Services.AddScoped<ICourseService, CourseService>();
builder.Services.AddScoped<ICourseEnrollmentService, CourseEnrollmentService>();
builder.Services.AddScoped<ITeacherCourseAllocationService, TeacherCourseAllocationService>();
builder.Services.AddScoped<IAssignmentService, AssignmentService>();
builder.Services.AddScoped<ISubmissionService, SubmissionService>();
builder.Services.AddScoped<ISubmissionAttachmentService, SubmissionAttachmentService>();

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = jwtOptions.Audience,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.SigningKey)),
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero,
            NameClaimType = ClaimTypes.Email,
            RoleClaimType = ClaimTypes.Role
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = async context =>
            {
                var userIdValue = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
                var authVersionValue = context.Principal?.FindFirstValue("auth_version");

                if (!Guid.TryParse(userIdValue, out var userId)
                    || !int.TryParse(authVersionValue, out var authVersion))
                {
                    context.Fail("The token contains invalid user claims.");
                    return;
                }

                var dbContext = context.HttpContext.RequestServices.GetRequiredService<AppDbContext>();
                var user = await dbContext.Users
                    .AsNoTracking()
                    .SingleOrDefaultAsync(candidate => candidate.Id == userId, context.HttpContext.RequestAborted);

                if (user is null || !user.IsActive || user.AuthVersion != authVersion)
                {
                    context.Fail("The token is no longer valid.");
                }
            }
        };
    });

builder.Services.AddAuthorization();

// Configure CORS for both internal frontend proxy and public Swagger / API testing
builder.Services.AddCors(options =>
{
    options.AddPolicy("PublicPolicy", policy => policy
        .AllowAnyOrigin()
        .AllowAnyHeader()
        .AllowAnyMethod());
});

builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Configure OpenAPI (.NET 10 native with JWT Bearer security for public evaluation)
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer((document, context, cancellationToken) =>
    {
        document.Info = new()
        {
            Title = "OnnoRokom Assignment & Submission Management API",
            Version = "v1",
            Description = "RESTful API backend for OnnoRokom Assignment & Submission System. Evaluators can authorize using JWT Bearer tokens to test endpoints directly."
        };

        return Task.CompletedTask;
    });
});

var app = builder.Build();

// Enable OpenAPI endpoint unconditionally
app.MapOpenApi();

// Enable Interactive API Documentation UI (Scalar API Reference)
app.MapScalarApiReference(options =>
{
    options.WithTitle("OnnoRokom API Reference & Interactive Testing");
    options.WithTheme(ScalarTheme.Moon);
});

// Redirect root (/) and /swagger to /scalar/v1 for instant judge access
app.MapGet("/", () => Results.Redirect("/scalar/v1"));
app.MapGet("/swagger", () => Results.Redirect("/scalar/v1"));

app.UseCors("PublicPolicy");
app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<GlobalExceptionMiddleware>();
app.MapControllers();

await SeedData.InitializeAsync(app.Services);

app.Run();

public partial class Program;
