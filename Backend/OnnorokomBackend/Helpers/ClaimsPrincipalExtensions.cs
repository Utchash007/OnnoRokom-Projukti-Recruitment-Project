using System.Security.Claims;
using OnnoRokomBackend.Models.Enums;

namespace OnnoRokomBackend.Helpers;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
        => Guid.Parse(principal.FindFirstValue(ClaimTypes.NameIdentifier)!);

    public static UserRole GetUserRole(this ClaimsPrincipal principal)
        => Enum.Parse<UserRole>(principal.FindFirstValue(ClaimTypes.Role)!);
}
