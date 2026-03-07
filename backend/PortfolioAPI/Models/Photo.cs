namespace PortfolioAPI.Models
{
    public class Photo
    {
        public int Id { get; set; }
        public string Title { get; set; }

        public string ImagePath { get; set; }

        public DateTime UploadedDate{ get; set; }
    }
}
