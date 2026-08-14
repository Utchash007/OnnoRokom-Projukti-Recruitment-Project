using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using OnnoRokomBackend.Models.Entities;

namespace OnnoRokomBackend.DbContext.Configurations;

public class AcademicTermConfiguration : IEntityTypeConfiguration<AcademicTerm>
{
    public void Configure(EntityTypeBuilder<AcademicTerm> builder)
    {
        builder.ToTable("academic_terms");
        builder.HasKey(term => term.Id);
        builder.Property(term => term.Code).HasMaxLength(50).IsRequired();
        builder.HasIndex(term => term.Code).IsUnique();
    }
}
