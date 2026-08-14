using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class AssignmentConfiguration : IEntityTypeConfiguration<Assignment>
{
    public void Configure(EntityTypeBuilder<Assignment> builder)
    {
        builder.ToTable("assignments");
        builder.HasKey(assignment => assignment.Id);
        builder.Property(assignment => assignment.Title).HasMaxLength(250).IsRequired();
        builder.Property(assignment => assignment.Description).HasColumnType("text");
        builder.Property(assignment => assignment.DeadlineAt).HasColumnType("timestamp with time zone");
        builder.Property(assignment => assignment.MaximumMarks).HasPrecision(8, 2);
        builder.Property(assignment => assignment.Status).HasConversion<string>().HasMaxLength(16).IsRequired();
        builder.Property(assignment => assignment.SubmissionsClosedAt).HasColumnType("timestamp with time zone");
        builder.Property(assignment => assignment.DeletedAt).HasColumnType("timestamp with time zone");
        builder.HasQueryFilter(assignment => assignment.DeletedAt == null);

        builder.HasOne(assignment => assignment.Course)
            .WithMany(course => course.Assignments)
            .HasForeignKey(assignment => assignment.CourseId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(assignment => assignment.CreatedBy)
            .WithMany(user => user.CreatedAssignments)
            .HasForeignKey(assignment => assignment.CreatedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
