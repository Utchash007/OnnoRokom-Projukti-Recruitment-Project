using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.AcademicTerms;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.AcademicTerms;

namespace OnnoRokomBackend.Controllers.AcademicTerms;

[ApiController]
[Route("api/academic-terms")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class AcademicTermsController(IAcademicTermService academicTermService) : ControllerBase, IAcademicTermsController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var terms = await academicTermService.GetAcademicTermsAsync(ct);
        return Ok(terms);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var term = await academicTermService.GetAcademicTermByIdAsync(id, ct);
        if (term is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Academic Term Not Found",
                Detail = $"Academic term with ID '{id}' was not found."
            });
        }

        return Ok(term);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateAcademicTermRequest request, CancellationToken ct = default)
    {
        var createdTerm = await academicTermService.CreateAcademicTermAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = createdTerm.Id }, createdTerm);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateAcademicTermRequest request, CancellationToken ct = default)
    {
        var updatedTerm = await academicTermService.UpdateAcademicTermAsync(id, request, ct);
        if (updatedTerm is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Academic Term Not Found",
                Detail = $"Academic term with ID '{id}' was not found."
            });
        }

        return Ok(updatedTerm);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default)
    {
        var success = await academicTermService.DeleteAcademicTermAsync(id, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Academic Term Not Found",
                Detail = $"Academic term with ID '{id}' was not found."
            });
        }

        return NoContent();
    }
}
