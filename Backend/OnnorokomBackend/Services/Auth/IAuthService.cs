using OnnoRokomBackend.Models.DTOs.Auth;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.Services.Auth;

public interface IAuthService
{
    Task<User?> AuthenticateAsync(LoginRequest request, CancellationToken ct = default);
    Task<CurrentUserResponse?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default);
}
