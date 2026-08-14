using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class BatchEnrollmentConfiguration : IEntityTypeConfiguration<BatchEnrollment>
{
    public void Configure(EntityTypeBuilder<BatchEnrollment> builder)
    {
        builder.ToTable("batch_enrollments");
        builder.HasKey(enrollment => enrollment.Id);
        builder.Property(enrollment => enrollment.Status).HasConversion<string>().HasMaxLength(16).IsRequired();
        builder.HasIndex(enrollment => new { enrollment.StudentId, enrollment.BatchId }).IsUnique();

        builder.HasOne(enrollment => enrollment.Batch)
            .WithMany(batch => batch.Enrollments)
            .HasForeignKey(enrollment => enrollment.BatchId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(enrollment => enrollment.Student)
            .WithMany(user => user.BatchEnrollments)
            .HasForeignKey(enrollment => enrollment.StudentId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
