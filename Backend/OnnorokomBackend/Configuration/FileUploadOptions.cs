namespace OnnoRokomBackend.Configuration;

public class FileUploadOptions
{
    public const string SectionName = "FileUpload";

    public long MaxFileSizeBytes { get; set; } = 10485760; // 10 MB

    public List<string> AllowedContentTypes { get; set; } =
    [
        "application/pdf",
        "image/png",
        "image/jpeg",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "text/plain",
        "application/zip",
        "application/x-zip-compressed"
    ];
}
