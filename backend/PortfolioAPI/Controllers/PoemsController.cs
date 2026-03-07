using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PortfolioAPI.Controllers
{
    // Simple DTO — avoids validation issues when only updating editable fields
    public class UpdatePoemRequest
    {
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PoemsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PoemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🟢 PUBLIC - Paginated Poems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Poem>>> GetPoems(
            int page = 1,
            int pageSize = 6)
        {
            var totalCount = await _context.Poems.CountAsync();
            var poems = await _context.Poems
                .OrderByDescending(p => p.CreatedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { data = poems, totalCount });
        }

        // 🟢 PUBLIC - Single poem
        [HttpGet("{id}")]
        public async Task<ActionResult<Poem>> GetPoem(int id)
        {
            var poem = await _context.Poems.FindAsync(id);
            if (poem == null) return NotFound();
            return poem;
        }

        // 🔴 ADMIN ONLY - Create Poem
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Poem>> CreatePoem(Poem poem)
        {
            _context.Poems.Add(poem);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetPoem), new { id = poem.Id }, poem);
        }

        // 🔴 ADMIN ONLY - Update Poem (DTO avoids id mismatch / validation errors)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePoem(int id, [FromBody] UpdatePoemRequest request)
        {
            var poem = await _context.Poems.FindAsync(id);
            if (poem == null) return NotFound();

            poem.Title = request.Title;
            poem.Content = request.Content;
            poem.Category = request.Category;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔴 ADMIN ONLY - Delete Poem
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePoem(int id)
        {
            var poem = await _context.Poems.FindAsync(id);
            if (poem == null) return NotFound();

            _context.Poems.Remove(poem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}