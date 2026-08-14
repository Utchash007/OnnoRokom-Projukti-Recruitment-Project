using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Users;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Controllers.Users;

public interface IUserController
{
    Task<IActionResult> GetAll([FromQuery] UserRole? role, CancellationToken ct = default);
    Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default);
    Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken ct = default);
    Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateUserRequest request, CancellationToken ct = default);
    Task<IActionResult> SetActiveStatus([FromRoute] Guid id, [FromBody] SetActiveStatusRequest request, CancellationToken ct = default);
    Task<IActionResult> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequest request, CancellationToken ct = default);
}
