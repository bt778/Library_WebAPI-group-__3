using System.ComponentModel.DataAnnotations;

namespace LibraryWebAPI.Models
{
    public class Book
    {
        public int Id { get; set; }

        [Required]
        public string Title { get; set; } = null!;

        [Required]
        public string Author { get; set; } = null!;

        public int TotalCopies { get; set; }

        public int CopiesAvailable { get; set; }
    }
}
