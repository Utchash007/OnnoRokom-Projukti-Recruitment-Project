namespace OnnoRokomBackend.Models.DTOs.Auth;

public class AuthenticationResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public CurrentUserResponse User { get; set; } = null!;
}
