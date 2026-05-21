using Microsoft.AspNetCore.Mvc;
using internetapi.Data;
using internetapi.Models;
using System.Linq;

namespace internetapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoginController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var usuario = _context.Clientes.FirstOrDefault(u =>
                u.Email!.Trim().ToLower() == request.Email!.Trim().ToLower()
            );

            if (usuario == null)
            {
                return Unauthorized(new
                {
                    mensagem = "Usuário não encontrado"
                });
            }

            if (usuario.Senha != request.Senha)
            {
                return Unauthorized(new
                {
                    mensagem = "Senha inválida"
                });
            }

            return Ok(new
            {
                mensagem = "Login realizado com sucesso",
                usuario
            });
        }
    }
}