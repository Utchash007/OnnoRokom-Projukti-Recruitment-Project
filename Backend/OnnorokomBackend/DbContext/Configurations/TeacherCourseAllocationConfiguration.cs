using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class TeacherCourseAllocationConfiguration : IEntityTypeConfiguration<TeacherCourseAllocation>
{
    public void Configure(EntityTypeBuilder<TeacherCourseAllocation> builder)
    {
        builder.ToTable("teacher_course_allocations");
        builder.HasKey(allocation => allocation.Id);
        builder.Property(allocation => allocation.Status).HasConversion<string>().HasMaxLength(16).IsRequired();
        builder.HasIndex(allocation => new { allocation.TeacherId, allocation.CourseId }).IsUnique();

        builder.HasOne(allocation => allocation.Teacher)
            .WithMany(user => user.TeacherCourseAllocations)
            .HasForeignKey(allocation => allocation.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(allocation => allocation.Course)
            .WithMany(course => course.TeacherAllocations)
            .HasForeignKey(allocation => allocation.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
