using LegoCollection.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Net.Http;
using System.Data.SqlClient;
using Newtonsoft.Json;

namespace LegoCollection.Controllers 
{
    [ApiController]
    [Route("api/[controller]")]
    public class LegoCollectionController : Controller
    {
        public readonly IConfiguration _configuration;

        public LegoCollectionController(IConfiguration configuration) 
        { 
            _configuration = configuration;
        }
        /*
        [HttpGet]
        [Route("api/GetSet")]
        public JsonResult GetSets()
        {
            SqlConnection
            return null;
        }
        */

        //handles requests to upload set from the client
        [HttpPost("UploadSet")]
        public IActionResult UploadSet([FromBody] SetModel Set)
        {
            Console.WriteLine(Set.set_user_id);
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("LegoColCon").ToString()))
            {
                connection.Open();

                string query = "INSERT INTO col.sets (set_num, set_name, set_count, set_complete, set_notes, set_user_id, nfc_id) VALUES (@Num, @Name, @Count, @Comp, @Note, @UserId, @Nfc)";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@Num", Set.set_num);
                    command.Parameters.AddWithValue("@Name", Set.set_name);
                    command.Parameters.AddWithValue("@Count", Set.set_count);
                    command.Parameters.AddWithValue("@Comp", Set.set_complete);
                    command.Parameters.AddWithValue("@Note", Set.set_notes);
                    command.Parameters.AddWithValue("@UserId", Set.set_user_id);
                    command.Parameters.AddWithValue("@Nfc", Set.nfc_id);

                    int rowsChanged = command.ExecuteNonQuery();

                    if (rowsChanged == 0)
                    {
                        return BadRequest("Failed upload");
                    }
                    else
                    {
                        return Ok(Set);
                    }
                }
            }
        }

        //accesses the rebrickable database to search for sets to add to the database
        [HttpGet("SearchSet/{query}")]
        public async Task<IActionResult> SearchSet(string query)
        {
            using (HttpClient http = new HttpClient())
            {
                string key = _configuration.GetValue<string>("Rebrickable");
                http.DefaultRequestHeaders.Add("Authorization", "key " + key);
                try
                {
                    HttpResponseMessage response = await http.GetAsync("https://rebrickable.com/api/v3/lego/sets/?search=" + query);

                    if (response.IsSuccessStatusCode)
                    {
                        string resp = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(resp);
                        return Ok(resp);
                    }
                }catch(Exception ex)
                {
                    return BadRequest();
                }
            }
            return BadRequest();
        }
    }
}
