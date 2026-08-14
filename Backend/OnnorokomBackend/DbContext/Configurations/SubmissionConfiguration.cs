using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class SubmissionConfiguration : IEntityTypeConfiguration<Submission>
{
    public void Configure(EntityTypeBuilder<Submission> builder)
    {
        builder.ToTable("submissions");
        builder.HasKey(submission => submission.Id);
        builder.Property(submission => submission.AnswerText).HasColumnType("text");
        builder.Property(submission => submission.Status).HasConversion<string>().HasMaxLength(16).IsRequired();
        builder.Property(submission => submission.SubmittedAt).HasColumnType("timestamp with time zone");
        builder.Property(submission => submission.Marks).HasPrecision(8, 2);
        builder.Property(submission => submission.Feedback).HasColumnType("text");
        builder.HasIndex(submission => new { submission.AssignmentId, submission.StudentId }).IsUnique();
        builder.HasQueryFilter(submission => submission.Assignment.DeletedAt == null);

        builder.HasOne(submission => submission.Assignment)
            .WithMany(assignment => assignment.Submissions)
            .HasForeignKey(submission => submission.AssignmentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(submission => submission.Student)
            .WithMany(user => user.Submissions)
            .HasForeignKey(submission => submission.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(submission => submission.EvaluatedBy)
            .WithMany(user => user.EvaluatedSubmissions)
            .HasForeignKey(submission => submission.EvaluatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
