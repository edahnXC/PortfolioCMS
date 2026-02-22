using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PortfolioAPI.Controllers { 
[Route("api/[controller]")]
    [ApiController]
    public class PoemsController:ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PoemsController(ApplicationDbContext context)
        {
            _context = context;
        }

        //GET:api/Poems
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Poem>>> GetPoems()
        {
            return await _context.Poems.ToListAsync();
        }

        //GET:api/Poems/5
        [HttpGet("{id}")]   
        public async Task<ActionResult<Poem>> GetPoem(int id)
        {
            var poem=await _context.Poems.FindAsync(id);    
            if(poem==null)
            {
                return NotFound();
            }
            return poem;
        }

        //POST:api/Poems
        [HttpPost]
        public async Task<ActionResult<Poem>> CreatePoem(Poem poem)
        {
            _context.Poems.Add(poem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPoem), new { id = poem.Id }, poem);
        }

        //PUT:api/Poems/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePoem(int id, Poem poem)
        {
            if (id != poem.Id)
                return BadRequest();

            _context.Entry(poem).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        //delete:api/poems/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePoem(int id)
        {
            var poem = await _context.Poems.FindAsync(id);
            if (poem == null)
                return NotFound();
            _context.Poems.Remove(poem);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}