using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PortfolioAPI.Controllers
{
    public class UpdateProjectRequest
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public string Icon { get; set; } = "🗂️";
        public string TechTags { get; set; } = string.Empty;
        public int DisplayOrder { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ProjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🟢 PUBLIC — All projects, ordered by DisplayOrder
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Project>>> GetProjects()
        {
            var projects = await _context.Projects
                .OrderBy(p => p.DisplayOrder)
                .ThenByDescending(p => p.CreatedDate)
                .ToListAsync();

            return Ok(new { data = projects, totalCount = projects.Count });
        }

        // 🟢 PUBLIC — Single project
        [HttpGet("{id}")]
        public async Task<ActionResult<Project>> GetProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();
            return project;
        }

        // 🔴 ADMIN ONLY — Create project
        [Authorize]
        [HttpPost]
        public async Task<ActionResult<Project>> CreateProject(Project project)
        {
            _context.Projects.Add(project);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
        }

        // 🔴 ADMIN ONLY — Update project
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProject(int id, [FromBody] UpdateProjectRequest request)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            project.Name = request.Name;
            project.Description = request.Description;
            project.Link = request.Link;
            project.Icon = request.Icon;
            project.TechTags = request.TechTags;
            project.DisplayOrder = request.DisplayOrder;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔴 ADMIN ONLY — Delete project
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            var project = await _context.Projects.FindAsync(id);
            if (project == null) return NotFound();

            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
