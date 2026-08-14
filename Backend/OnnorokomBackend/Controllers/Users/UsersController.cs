using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Users;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.Users;

namespace OnnoRokomBackend.Controllers.Users;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class UsersController(IUserService userService) : ControllerBase, IUserController
{
    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] UserRole? role, CancellationToken ct = default)
    {
        var users = await userService.GetUsersAsync(role, ct);
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var user = await userService.GetUserByIdAsync(id, ct);
        if (user is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "User Not Found",
                Detail = $"User with ID '{id}' was not found."
            });
        }

        return Ok(user);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserRequest request, CancellationToken ct = default)
    {
        var createdUser = await userService.CreateUserAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = createdUser.Id }, createdUser);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateUserRequest request, CancellationToken ct = default)
    {
        var updatedUser = await userService.UpdateUserAsync(id, request, ct);
        if (updatedUser is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "User Not Found",
                Detail = $"User with ID '{id}' was not found."
            });
        }

        return Ok(updatedUser);
    }

    [HttpPatch("{id:guid}/active-status")]
    public async Task<IActionResult> SetActiveStatus([FromRoute] Guid id, [FromBody] SetActiveStatusRequest request, CancellationToken ct = default)
    {
        var success = await userService.SetUserActiveStatusAsync(id, request, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "User Not Found",
                Detail = $"User with ID '{id}' was not found."
            });
        }

        return NoContent();
    }

    [HttpPatch("{id:guid}/password")]
    public async Task<IActionResult> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequest request, CancellationToken ct = default)
    {
        var success = await userService.ChangePasswordAsync(id, request, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "User Not Found",
                Detail = $"User with ID '{id}' was not found."
            });
        }

        return NoContent();
    }
}
