namespace PortfolioAPI.Models
{
    public class Poem
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public string Category { get; set; } = "General";
    }
}
