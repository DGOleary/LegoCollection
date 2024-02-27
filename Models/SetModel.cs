
namespace LegoCollection.Models
{
    public class SetModel
    {
        public string set_num { get; set; }
        public string set_name { get; set; }
        public int set_count { get; set; }
        public Boolean set_complete { get; set; }
        public string set_notes { get; set; }
        public string set_user_id { get; set; }
        public string nfc_id { get; set; }

        public SetModel()
        {
            set_num = "";
            set_name = "";
            set_count = 0;
            set_complete = false;
            set_notes = "";
            set_user_id = "";
            nfc_id = "";
        }

    }
}
