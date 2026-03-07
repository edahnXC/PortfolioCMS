using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PortfolioAPI.Data;
using PortfolioAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace PortfolioAPI.Controllers
{
    // Simple DTO — avoids model validation errors on PUT
    public class UpdatePhotoRequest
    {
        public string Title { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PhotosController(ApplicationDbContext context)
        {
            _context = context;
        }

        // 🟢 PUBLIC - Paginated Photos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Photo>>> GetPhotos(
            int page = 1,
            int pageSize = 8)
        {
            var totalCount = await _context.Photos.CountAsync();
            var photos = await _context.Photos
                .OrderByDescending(p => p.UploadedDate)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(new { data = photos, totalCount });
        }

        // 🟢 PUBLIC - Single photo
        [HttpGet("{id}")]
        public async Task<ActionResult<Photo>> GetPhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();
            return photo;
        }

        // 🔴 ADMIN ONLY - Upload Photo
        [Authorize]
        [HttpPost("upload")]
        public async Task<IActionResult> UploadPhoto(IFormFile file, [FromForm] string title)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded.");

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "Uploads");
            if (!Directory.Exists(folderPath))
                Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var photo = new Photo
            {
                Title = title,
                ImagePath = "Uploads/" + fileName,
                UploadedDate = DateTime.Now
            };

            _context.Photos.Add(photo);
            await _context.SaveChangesAsync();
            return Ok(photo);
        }

        // 🔴 ADMIN ONLY - Update Photo title only (DTO avoids validation errors)
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePhoto(int id, [FromBody] UpdatePhotoRequest request)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            photo.Title = request.Title;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // 🔴 ADMIN ONLY - Delete Photo + physical file
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhoto(int id)
        {
            var photo = await _context.Photos.FindAsync(id);
            if (photo == null) return NotFound();

            var filePath = Path.Combine(Directory.GetCurrentDirectory(), photo.ImagePath);
            if (System.IO.File.Exists(filePath))
                System.IO.File.Delete(filePath);

            _context.Photos.Remove(photo);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}