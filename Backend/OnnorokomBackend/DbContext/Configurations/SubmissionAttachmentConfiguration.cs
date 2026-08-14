using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class SubmissionAttachmentConfiguration : IEntityTypeConfiguration<SubmissionAttachment>
{
    public void Configure(EntityTypeBuilder<SubmissionAttachment> builder)
    {
        builder.ToTable("submission_attachments");
        builder.HasKey(attachment => attachment.Id);
        builder.Property(attachment => attachment.OriginalFileName).HasMaxLength(255).IsRequired();
        builder.Property(attachment => attachment.ContentType).HasMaxLength(150).IsRequired();
        builder.Property(attachment => attachment.FileData).HasColumnType("bytea").IsRequired();
        builder.HasQueryFilter(attachment => attachment.Submission.Assignment.DeletedAt == null);

        builder.HasOne(attachment => attachment.Submission)
            .WithMany(submission => submission.Attachments)
            .HasForeignKey(attachment => attachment.SubmissionId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
