using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.Auth;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Auth;

public class AuthService(IUnitOfWork unitOfWork) : IAuthService
{
    public async Task<User?> AuthenticateAsync(LoginRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await unitOfWork.Context.Users
            .SingleOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail, ct);

        if (user is null || !user.IsActive)
        {
            return null;
        }

        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return null;
        }

        return user;
    }

    public async Task<CurrentUserResponse?> GetCurrentUserAsync(Guid userId, CancellationToken ct = default)
    {
        var user = await unitOfWork.Context.Users
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Id == userId, ct);

        if (user is null || !user.IsActive)
        {
            return null;
        }

        return new CurrentUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Role = user.Role.ToString()
        };
    }
}
