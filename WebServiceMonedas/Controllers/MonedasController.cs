using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System.Collections.Generic;
using WebServiceMonedas.Data;  // Asegúrate de que tengas el namespace correcto

namespace WebServiceMonedas.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MonedasController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public MonedasController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Monedas (Obtiene todas las monedas)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Moneda>>> GetMonedas()
        {
            return await _context.Monedas.ToListAsync();
        }

        // GET: api/Monedas/{id} (Obtiene una moneda por su Id)
        [HttpGet("{id}")]
        public async Task<ActionResult<Moneda>> GetMoneda(int id)
        {
            var moneda = await _context.Monedas.FindAsync(id);

            if (moneda == null)
            {
                return NotFound();
            }

            return moneda;
        }

        // POST: api/Monedas (Crea una nueva moneda)
        [HttpPost]
        public async Task<ActionResult<Moneda>> PostMoneda(Moneda moneda)
        {
            _context.Monedas.Add(moneda);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetMoneda), new { id = moneda.Id }, moneda);
        }

        // PUT: api/Monedas/{id} (Actualiza una moneda existente)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMoneda(int id, Moneda moneda)
        {
            if (id != moneda.Id)
            {
                return BadRequest("El ID de la URL no coincide con el ID de la moneda.");
            }

            _context.Entry(moneda).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MonedaExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/Monedas/{id} (Elimina una moneda)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMoneda(int id)
        {
            var moneda = await _context.Monedas.FindAsync(id);
            if (moneda == null)
            {
                return NotFound();
            }

            _context.Monedas.Remove(moneda);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // Método auxiliar para verificar si existe la moneda
        private bool MonedaExists(int id)
        {
            return _context.Monedas.Any(e => e.Id == id);
        }
    }
}
