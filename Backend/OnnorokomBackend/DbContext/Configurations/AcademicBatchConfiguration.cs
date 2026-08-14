using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class AcademicBatchConfiguration : IEntityTypeConfiguration<AcademicBatch>
{
    public void Configure(EntityTypeBuilder<AcademicBatch> builder)
    {
        builder.ToTable("academic_batches");
        builder.HasKey(batch => batch.Id);
        builder.Property(batch => batch.Code).HasMaxLength(50).IsRequired();
        builder.Property(batch => batch.Name).HasMaxLength(200).IsRequired();
        builder.HasIndex(batch => new { batch.TermId, batch.Code }).IsUnique();

        builder.HasOne(batch => batch.Term)
            .WithMany(term => term.Batches)
            .HasForeignKey(batch => batch.TermId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
