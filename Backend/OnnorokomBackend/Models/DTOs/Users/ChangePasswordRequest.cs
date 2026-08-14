using System.ComponentModel.DataAnnotations;

namespace OnnoRokomBackend.Models.DTOs.Users;

public class ChangePasswordRequest
{
    [Required, MinLength(6)]
    public string NewPassword { get; set; } = string.Empty;
}
