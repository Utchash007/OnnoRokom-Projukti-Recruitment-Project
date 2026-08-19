using Microsoft.EntityFrameworkCore;
using OnnoRokomBackend.Models.DTOs.Users;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.UnitOfWork;

namespace OnnoRokomBackend.Services.Users;

public class UserService(IUnitOfWork unitOfWork) : IUserService
{
    public async Task<List<UserResponse>> GetUsersAsync(UserRole? roleFilter, CancellationToken ct = default)
    {
        var query = unitOfWork.UserRepo.GetAll().AsNoTracking().AsQueryable();

        if (roleFilter.HasValue)
        {
            query = query.Where(u => u.Role == roleFilter.Value);
        }

        return await query
            .OrderBy(u => u.FullName)
            .Select(u => new UserResponse
            {
                Id = u.Id,
                FullName = u.FullName,
                Email = u.Email,
                Roll = u.Roll,
                Role = u.Role.ToString(),
                IsActive = u.IsActive
            })
            .ToListAsync(ct);
    }

    public async Task<UserResponse?> GetUserByIdAsync(Guid id, CancellationToken ct = default)
    {
        var user = await unitOfWork.UserRepo.GetAll()
            .AsNoTracking()
            .SingleOrDefaultAsync(u => u.Id == id, ct);

        if (user is null)
        {
            return null;
        }

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Roll = user.Roll,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponse> CreateUserAsync(CreateUserRequest request, CancellationToken ct = default)
    {
        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var emailExists = await unitOfWork.UserRepo.GetAll()
            .AnyAsync(u => u.Email.ToLower() == normalizedEmail, ct);

        if (emailExists)
        {
            throw new InvalidOperationException($"A user with email '{request.Email}' already exists.");
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            FullName = request.FullName.Trim(),
            Email = normalizedEmail,
            Roll = string.IsNullOrWhiteSpace(request.Roll) ? null : request.Roll.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = request.Role,
            IsActive = true,
            AuthVersion = 1
        };

        await unitOfWork.UserRepo.Add(user);
        await unitOfWork.SaveChangesAsync(ct);

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Roll = user.Roll,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        };
    }

    public async Task<UserResponse?> UpdateUserAsync(Guid id, UpdateUserRequest request, CancellationToken ct = default)
    {
        var user = await unitOfWork.UserRepo.GetAll()
            .SingleOrDefaultAsync(u => u.Id == id, ct);

        if (user is null)
        {
            return null;
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        if (user.Email.ToLower() != normalizedEmail)
        {
            var emailExists = await unitOfWork.UserRepo.GetAll()
                .AnyAsync(u => u.Id != id && u.Email.ToLower() == normalizedEmail, ct);

            if (emailExists)
            {
                throw new InvalidOperationException($"A user with email '{request.Email}' already exists.");
            }

            user.Email = normalizedEmail;
        }

        user.FullName = request.FullName.Trim();
        user.Roll = string.IsNullOrWhiteSpace(request.Roll) ? null : request.Roll.Trim();

        await unitOfWork.SaveChangesAsync(ct);

        return new UserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Roll = user.Roll,
            Role = user.Role.ToString(),
            IsActive = user.IsActive
        };
    }

    public async Task<bool> SetUserActiveStatusAsync(Guid id, SetActiveStatusRequest request, CancellationToken ct = default)
    {
        var user = await unitOfWork.UserRepo.GetAll()
            .SingleOrDefaultAsync(u => u.Id == id, ct);

        if (user is null)
        {
            return false;
        }

        user.IsActive = request.IsActive;
        user.AuthVersion++;

        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }

    public async Task<bool> ChangePasswordAsync(Guid id, ChangePasswordRequest request, CancellationToken ct = default)
    {
        var user = await unitOfWork.UserRepo.GetAll()
            .SingleOrDefaultAsync(u => u.Id == id, ct);

        if (user is null)
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.AuthVersion++;

        await unitOfWork.SaveChangesAsync(ct);
        return true;
    }
}
