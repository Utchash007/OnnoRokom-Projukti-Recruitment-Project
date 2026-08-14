using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Users;

public class UpdateUserRequest
{
    [Required]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public string? Roll { get; set; }
}
