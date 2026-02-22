namespace PortfolioAPI.Models
{
    public class Poem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreatedDate{  get; set; }

        public string Category { get; set;  }
    }
}
