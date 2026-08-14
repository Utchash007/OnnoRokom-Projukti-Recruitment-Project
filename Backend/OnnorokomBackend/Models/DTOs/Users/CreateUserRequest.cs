using System.ComponentModel.DataAnnotations;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Models.DTOs.Users;

public class CreateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Roll { get; set; }

    [Required, MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }
}
