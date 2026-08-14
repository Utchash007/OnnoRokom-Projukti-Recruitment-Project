using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using OnnoRokomBackend.Models.DTOs.Courses;
using OnnoRokomBackend.Models.Enums;
using OnnoRokomBackend.Services.Courses;

namespace OnnoRokomBackend.Controllers.Courses;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = nameof(UserRole.Admin))]
public class CoursesController(ICourseService courseService) : ControllerBase, ICourseController
{
    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken ct = default)
    {
        var courses = await courseService.GetCoursesAsync(ct);
        return Ok(courses);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById([FromRoute] Guid id, CancellationToken ct = default)
    {
        var course = await courseService.GetCourseByIdAsync(id, ct);
        if (course is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Course Not Found",
                Detail = $"Course with ID '{id}' was not found."
            });
        }

        return Ok(course);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateCourseRequest request, CancellationToken ct = default)
    {
        var createdCourse = await courseService.CreateCourseAsync(request, ct);
        return CreatedAtAction(nameof(GetById), new { id = createdCourse.Id }, createdCourse);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update([FromRoute] Guid id, [FromBody] UpdateCourseRequest request, CancellationToken ct = default)
    {
        var updatedCourse = await courseService.UpdateCourseAsync(id, request, ct);
        if (updatedCourse is null)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Course Not Found",
                Detail = $"Course with ID '{id}' was not found."
            });
        }

        return Ok(updatedCourse);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete([FromRoute] Guid id, CancellationToken ct = default)
    {
        var success = await courseService.DeleteCourseAsync(id, ct);
        if (!success)
        {
            return NotFound(new ProblemDetails
            {
                Status = StatusCodes.Status404NotFound,
                Title = "Course Not Found",
                Detail = $"Course with ID '{id}' was not found."
            });
        }

        return NoContent();
    }
}
