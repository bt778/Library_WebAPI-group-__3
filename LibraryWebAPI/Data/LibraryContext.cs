using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Models;

namespace LibraryWebAPI.Data
{
    public class LibraryContext : DbContext
    {
        public LibraryContext(DbContextOptions<LibraryContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Book> Books { get; set; } = null!;
        public DbSet<Borrower> Borrowers { get; set; } = null!;
        public DbSet<Loan> Loans { get; set; } = null!;

        public DbSet<User> User { get; set; }

    }
}
