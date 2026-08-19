using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Repository;

namespace OnnoRokomBackend.UnitOfWork;

public interface IUnitOfWork
{
    IRepository<User> UserRepo { get; }
    IRepository<AcademicTerm> AcademicTermRepo { get; }
    IRepository<AcademicBatch> AcademicBatchRepo { get; }
    IRepository<BatchEnrollment> BatchEnrollmentRepo { get; }
    IRepository<Course> CourseRepo { get; }
    IRepository<CourseEnrollment> CourseEnrollmentRepo { get; }
    IRepository<TeacherCourseAllocation> TeacherCourseAllocationRepo { get; }
    IRepository<Assignment> AssignmentRepo { get; }
    IRepository<Submission> SubmissionRepo { get; }
    IRepository<SubmissionAttachment> SubmissionAttachmentRepo { get; }
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
