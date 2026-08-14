using OnnoRokomBackend.Models.DTOs.Users;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Services.Users;

public interface IUserService
{
    Task<List<UserResponse>> GetUsersAsync(UserRole? roleFilter, CancellationToken ct = default);
    Task<UserResponse?> GetUserByIdAsync(Guid id, CancellationToken ct = default);
    Task<UserResponse> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default);
    Task<UserResponse?> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default);
    Task<bool> SetUserActiveStatusAsync(Guid id, SetActiveStatusRequest request, CancellationToken ct = default);
    Task<bool> ChangePasswordAsync(Guid id, ChangePasswordRequest request, CancellationToken ct = default);
}
