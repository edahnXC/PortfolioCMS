namespace PortfolioAPI.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;

        public string ImagePath { get; set; } = string.Empty;

        public DateTime UploadedDate { get; set; } = DateTime.UtcNow;
    }
}
