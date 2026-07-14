namespace PortfolioAPI.Models
{
    public class Experience
    {
        public int Id { get; set; }
        
        // e.g., "Education", "Internship", "Work"
        public string Type { get; set; } = string.Empty;
        
        // e.g., "Bachelors of Computer Application", "MERN Developer"
        public string Title { get; set; } = string.Empty;
        
        // e.g., "2022-2025", "Dec 2024 - April 2025"
        public string DateRange { get; set; } = string.Empty;
        
        // e.g., "MSU Baroda, Vadodara", "Webmyne System pvt. ltd."
        public string CompanyOrInstitution { get; set; } = string.Empty;
        
        // Optional description
        public string Description { get; set; } = string.Empty;

        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
    }
}
