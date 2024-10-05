using Microsoft.EntityFrameworkCore;

namespace WebServiceMonedas.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Moneda> Monedas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Moneda>().HasKey(m => m.Id);
        }
    }
}
