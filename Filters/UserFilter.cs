using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Data.SqlClient;

namespace LegoCollection.Filters
{
    public class UserFilter : IActionFilter
    {
        private readonly IConfiguration _configuration;

        public UserFilter(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
            var headers = context.HttpContext.Response.Headers;

            if (!headers.ContainsKey("user") || !headers.ContainsKey("pass"))
            {
                context.Result = new BadRequestResult();
            }
            string user = headers["user"];
            string pass = headers["pass"];

            
            using (SqlConnection connection = new SqlConnection(_configuration.GetConnectionString("LegoColCon").ToString()))
            {
                connection.Open();

                string query = "SELECT COUNT(*) FROM col.users WHERE user_id = @User AND user_password = @Pass";

                using (SqlCommand command = new SqlCommand(query, connection))
                {
                    command.Parameters.AddWithValue("@User", user);
                    command.Parameters.AddWithValue("@Pass", pass);

                    int result = (int)command.ExecuteScalar();

                    if(result == 0)
                    {
                        context.Result = new UnauthorizedResult();
                    }
                }
            }

        }

        public void OnActionExecuted(ActionExecutedContext context)
        {
            throw new NotImplementedException();
        }
    }
}
