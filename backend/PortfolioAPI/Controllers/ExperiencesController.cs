using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExperiencesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ExperiencesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🟢 PUBLIC - Get all experiences
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Experience>>> GetExperiences()
        {
            var experiences = await _context.Experiences
                .OrderByDescending(e => e.CreatedDate)
                .ToListAsync();
            return Ok(new { data = experiences, totalCount = experiences.Count });
        }

        // 🔴 ADMIN ONLY - Create Experience
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Experience>> CreateExperience(Experience experience)
        {
            experience.CreatedDate = DateTime.UtcNow;
            _context.Experiences.Add(experience);
            await _context.SaveChangesAsync();
            return Ok(experience);
        }

        // 🔴 ADMIN ONLY - Update Experience
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateExperience(int id, Experience request)
        {
            var experience = await _context.Experiences.FindAsync(id);
            if (experience == null) return NotFound();

            experience.Type = request.Type;
            experience.Title = request.Title;
            experience.DateRange = request.DateRange;
            experience.CompanyOrInstitution = request.CompanyOrInstitution;
            experience.Description = request.Description;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔴 ADMIN ONLY - Delete Experience
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExperience(int id)
        {
            var experience = await _context.Experiences.FindAsync(id);
            if (experience == null) return NotFound();

            _context.Experiences.Remove(experience);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
