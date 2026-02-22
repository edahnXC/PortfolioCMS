using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Models;

namespace PortfolioAPI.Data
{
    public class ApplicationDbContext:DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Poem> Poems { get; set; }

        public DbSet<Photo> Photos { get; set; }
    }
}

