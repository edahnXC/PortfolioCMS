namespace PortfolioAPI.Models
{
    public class Project
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public string Icon { get; set; } = "🗂️";
        public string TechTags { get; set; } = string.Empty;   // comma-separated
        public int DisplayOrder { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
