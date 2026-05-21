using Microsoft.AspNetCore.Mvc;
using internetapi.Data;
using internetapi.Models;

namespace internetapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ContatosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ContatosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult CriarContato([FromBody] Contato contato)
        {
            _context.Contatos.Add(contato);
            _context.SaveChanges();

            return Ok(contato);
        }
    }
}