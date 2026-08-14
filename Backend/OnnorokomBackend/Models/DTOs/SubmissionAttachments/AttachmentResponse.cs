namespace OnnoRokomBackend.Models.DTOs.SubmissionAttachments;

public class AttachmentResponse
{
    public Guid Id { get; set; }
    public string OriginalFileName { get; set; } = string.Empty;
    public string ContentType { get; set; } = string.Empty;
    public long ByteSize { get; set; }
}
