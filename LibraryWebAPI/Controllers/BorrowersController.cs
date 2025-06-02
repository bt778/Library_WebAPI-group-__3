using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;

namespace LibraryWebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class BorrowersController : ControllerBase
    {
        private readonly LibraryContext _context;

        public BorrowersController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/borrowers
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Borrower>>> GetBorrowers()
        {
            return await _context.Borrowers.ToListAsync();
        }

        // GET: api/borrowers/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Borrower>> GetBorrower(int id)
        {
            var borrower = await _context.Borrowers.FindAsync(id);
            if (borrower == null) return NotFound();

            return borrower;
        }

        // POST: api/borrowers
        [HttpPost]
        public async Task<ActionResult<Borrower>> AddBorrower(Borrower borrower)
        {
            _context.Borrowers.Add(borrower);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBorrower), new { id = borrower.Id }, borrower);
        }

        // PUT: api/borrowers/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBorrower(int id, Borrower borrower)
        {
            if (id != borrower.Id) return BadRequest();

            _context.Entry(borrower).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BorrowerExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // DELETE: api/borrowers/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBorrower(int id)
        {
            var borrower = await _context.Borrowers.FindAsync(id);
            if (borrower == null) return NotFound();

            _context.Borrowers.Remove(borrower);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BorrowerExists(int id) => _context.Borrowers.Any(b => b.Id == id);
    }
}
