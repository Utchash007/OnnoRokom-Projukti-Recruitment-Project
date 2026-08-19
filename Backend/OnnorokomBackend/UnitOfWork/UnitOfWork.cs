using OnnoRokomBackend.DbContext;
using OnnoRokomBackend.Models.Entities;
using OnnoRokomBackend.Repository;

namespace OnnoRokomBackend.UnitOfWork;

public class UnitOfWork(AppDbContext context) : IUnitOfWork
{
    private IRepository<User>? _userRepo;
    private IRepository<AcademicTerm>? _academicTermRepo;
    private IRepository<AcademicBatch>? _academicBatchRepo;
    private IRepository<BatchEnrollment>? _batchEnrollmentRepo;
    private IRepository<Course>? _courseRepo;
    private IRepository<CourseEnrollment>? _courseEnrollmentRepo;
    private IRepository<TeacherCourseAllocation>? _teacherCourseAllocationRepo;
    private IRepository<Assignment>? _assignmentRepo;
    private IRepository<Submission>? _submissionRepo;
    private IRepository<SubmissionAttachment>? _submissionAttachmentRepo;

    public IRepository<User> UserRepo
    {
        get
        {
            if (_userRepo is null)
            {
                _userRepo = new EFRepository<User>(context);
            }

            return _userRepo;
        }
    }

    public IRepository<AcademicTerm> AcademicTermRepo
    {
        get
        {
            if (_academicTermRepo is null)
            {
                _academicTermRepo = new EFRepository<AcademicTerm>(context);
            }

            return _academicTermRepo;
        }
    }

    public IRepository<AcademicBatch> AcademicBatchRepo
    {
        get
        {
            if (_academicBatchRepo is null)
            {
                _academicBatchRepo = new EFRepository<AcademicBatch>(context);
            }

            return _academicBatchRepo;
        }
    }

    public IRepository<BatchEnrollment> BatchEnrollmentRepo
    {
        get
        {
            if (_batchEnrollmentRepo is null)
            {
                _batchEnrollmentRepo = new EFRepository<BatchEnrollment>(context);
            }

            return _batchEnrollmentRepo;
        }
    }

    public IRepository<Course> CourseRepo
    {
        get
        {
            if (_courseRepo is null)
            {
                _courseRepo = new EFRepository<Course>(context);
            }

            return _courseRepo;
        }
    }

    public IRepository<CourseEnrollment> CourseEnrollmentRepo
    {
        get
        {
            if (_courseEnrollmentRepo is null)
            {
                _courseEnrollmentRepo = new EFRepository<CourseEnrollment>(context);
            }

            return _courseEnrollmentRepo;
        }
    }

    public IRepository<TeacherCourseAllocation> TeacherCourseAllocationRepo
    {
        get
        {
            if (_teacherCourseAllocationRepo is null)
            {
                _teacherCourseAllocationRepo = new EFRepository<TeacherCourseAllocation>(context);
            }

            return _teacherCourseAllocationRepo;
        }
    }

    public IRepository<Assignment> AssignmentRepo
    {
        get
        {
            if (_assignmentRepo is null)
            {
                _assignmentRepo = new EFRepository<Assignment>(context);
            }

            return _assignmentRepo;
        }
    }

    public IRepository<Submission> SubmissionRepo
    {
        get
        {
            if (_submissionRepo is null)
            {
                _submissionRepo = new EFRepository<Submission>(context);
            }

            return _submissionRepo;
        }
    }

    public IRepository<SubmissionAttachment> SubmissionAttachmentRepo
    {
        get
        {
            if (_submissionAttachmentRepo is null)
            {
                _submissionAttachmentRepo = new EFRepository<SubmissionAttachment>(context);
            }

            return _submissionAttachmentRepo;
        }
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
        => context.SaveChangesAsync(ct);
}
