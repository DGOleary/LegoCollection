using LegoCollection.Models;

namespace LegoCollection.Entities
{
    public class SetEntity
    {
        public string set_num { get; set; }
        public string set_name { get; set; }
        public int set_count { get; set; }
        public Boolean set_complete { get; set; }
        public string set_notes { get; set; }
        public string set_user_id { get; set; }
        public string nfc_id { get; set; }

        public SetEntity() { }

        public SetEntity(SetModel model)
        {
            set_num = model.set_num;
            set_name = model.set_name;
            set_count = model.set_count;
            set_complete = model.set_complete; 
            set_notes = model.set_notes;
            set_user_id = model.set_user_id;
            nfc_id = model.nfc_id;
        }

        public SetModel ToModel()
        {
            return new SetModel
            {
                set_num = this.set_num,
                set_name = this.set_name,
                set_count = this.set_count,
                set_complete = this.set_complete,
                set_notes = this.set_notes,
                set_user_id = this.set_user_id,
                nfc_id = this.nfc_id
            };
        }
    }
}
