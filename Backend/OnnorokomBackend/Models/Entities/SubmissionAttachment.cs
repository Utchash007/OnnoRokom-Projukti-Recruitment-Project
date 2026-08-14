namespace OnnoRokomBackend.Models.Entities;

public class SubmissionAttachment
{
    public Guid Id { get; set; }
    public Guid SubmissionId { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long ByteSize { get; set; }
    public byte[] FileData { get; set; } = [];

    public Submission Submission { get; set; } = null!;
}
