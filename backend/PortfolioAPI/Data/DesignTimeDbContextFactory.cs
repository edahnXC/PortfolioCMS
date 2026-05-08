using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace PortfolioAPI.Data
{
    /// <summary>
    /// Used only by EF Core CLI tools (dotnet ef migrations add, etc.)
    /// so they can create a DbContext without starting the full app host.
    /// </summary>
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Use a dummy connection string for migration generation only.
            // The real connection comes from appsettings / env vars at runtime.
            optionsBuilder.UseNpgsql("Host=localhost;Database=portfolio_dev;Username=postgres;Password=postgres");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
