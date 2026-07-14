using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PortfolioAPI.Data;
using PortfolioAPI.Models;

namespace PortfolioAPI.Controllers
{
  public class UpdatePhotoRequest
  {
    public string Title { get; set; } = string.Empty;
  }

  [Route("api/[controller]")]
  [ApiController]
  public class PhotosController : ControllerBase
  {
    private readonly ApplicationDbContext _context;
    private readonly Cloudinary _cloudinary;

    public PhotosController(ApplicationDbContext context, Cloudinary cloudinary)
    {
      _context = context;
      _cloudinary = cloudinary;
    }

    // 🟢 PUBLIC - Paginated Photos
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Photo>>> GetPhotos(int page = 1, int pageSize = 8)
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

    // 🔴 ADMIN ONLY - Upload Photo to Cloudinary
    [Authorize]
    [HttpPost("upload")]
    public async Task<IActionResult> UploadPhoto(IFormFile file, [FromForm] string title)
    {
      if (file == null || file.Length == 0)
        return BadRequest("No file uploaded.");

      await using var stream = file.OpenReadStream();
      var uploadParams = new ImageUploadParams
      {
        File = new FileDescription(file.FileName, stream),
        Folder = "portfolio"
      };

      var uploadResult = await _cloudinary.UploadAsync(uploadParams);

      if (uploadResult.Error != null)
        return BadRequest(uploadResult.Error.Message);

      var photo = new Photo
      {
        Title = title,
        ImagePath = uploadResult.SecureUrl.ToString().Replace("/upload/", "/upload/q_auto,f_auto/"),
        UploadedDate = DateTime.UtcNow
      };

      _context.Photos.Add(photo);
      await _context.SaveChangesAsync();
      return Ok(photo);
    }

    // 🔴 ADMIN ONLY - Update Photo title
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

    // 🔴 ADMIN ONLY - Delete Photo
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePhoto(int id)
    {
      var photo = await _context.Photos.FindAsync(id);
      if (photo == null) return NotFound();
      _context.Photos.Remove(photo);
      await _context.SaveChangesAsync();
      return NoContent();
    }
  }
}
