using System;
using System.ComponentModel.DataAnnotations;

public class Moneda
{
    [Key] // Marca el campo como clave primaria
    public int Id { get; set; }

    [Required]
    public string Nombre { get; set; }

    [Required]
    public string Simbolo { get; set; }

    public DateTime FechaCreacion { get; set; } = DateTime.Now; // Genera automáticamente la fecha
}
