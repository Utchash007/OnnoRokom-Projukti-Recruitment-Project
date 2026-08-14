namespace OnnoRokomBackend.Models.DTOs.Users;

public class UserResponse
{
    public Guid Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Roll { get; set; }
    public string Role { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}
