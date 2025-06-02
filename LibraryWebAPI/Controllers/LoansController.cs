using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LibraryWebAPI.Data;
using LibraryWebAPI.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace LibraryWebAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api")]
    public class LoansController : ControllerBase
    {
        private readonly LibraryContext _context;

        public LoansController(LibraryContext context)
        {
            _context = context;
        }

        // GET: api/loans - list all loans
        [HttpGet("loans")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetLoans()
        {
            var loans = await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Borrower)
                .ToListAsync();

            return loans;
        }

        // POST: api/loans - issue a book
        [HttpPost("loans")]
        public async Task<IActionResult> IssueBook([FromBody] Loan loanRequest)
        {
            var borrower = await _context.Borrowers.FindAsync(loanRequest.BorrowerId);
            if (borrower == null)
                return NotFound($"Borrower ID {loanRequest.BorrowerId} not found.");

            var book = await _context.Books.FindAsync(loanRequest.BookId);
            if (book == null)
                return NotFound($"Book ID {loanRequest.BookId} not found.");

            if (book.CopiesAvailable <= 0)
                return BadRequest("No copies available to loan.");

            book.CopiesAvailable--;

            loanRequest.IssueDate = DateTime.UtcNow;
            loanRequest.DueDate = DateTime.UtcNow.AddDays(14);
            loanRequest.ReturnDate = null;

            _context.Loans.Add(loanRequest);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                loanRequest.Id,
                loanRequest.BookId,
                loanRequest.BorrowerId,
                loanRequest.IssueDate,
                loanRequest.DueDate
            });
        }

        // POST: api/returns - return a book
        [HttpPost("returns")]
        public async Task<IActionResult> ReturnBook([FromBody] Loan returnRequest)
        {
            var loan = await _context.Loans
                .Include(l => l.Book)
                .FirstOrDefaultAsync(l => l.Id == returnRequest.Id);

            if (loan == null)
                return NotFound("Loan record not found.");

            if (loan.ReturnDate != null)
                return BadRequest("Book already returned.");

            loan.ReturnDate = DateTime.UtcNow;
            loan.Book.CopiesAvailable++;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                loan.Id,
                loan.BookId,
                loan.BorrowerId,
                loan.IssueDate,
                loan.DueDate,
                loan.ReturnDate
            });
        }

        // GET: api/loans/overdue - list overdue loans
        [HttpGet("loans/overdue")]
        public async Task<ActionResult<IEnumerable<Loan>>> GetOverdueLoans()
        {
            var overdueLoans = await _context.Loans
                .Include(l => l.Book)
                .Include(l => l.Borrower)
                .Where(l => l.ReturnDate == null && l.DueDate < DateTime.UtcNow)
                .ToListAsync();

            return overdueLoans;
        }
    }
}
