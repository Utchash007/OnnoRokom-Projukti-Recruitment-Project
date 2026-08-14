using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Auth;

namespace OnnoRokomBackend.Controllers.Auth;

public interface IAuthController
{
    Task<IActionResult> Login([FromBody] LoginRequest request, CancellationToken ct = default);
    IActionResult Logout();
    Task<IActionResult> Me(CancellationToken ct = default);
}
