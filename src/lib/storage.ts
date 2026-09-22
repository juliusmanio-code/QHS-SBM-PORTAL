export interface FileValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFilename: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
}

export function sanitizeFilename(filename: string): string {
  // Replace spaces, special characters, keep only alphanumeric, dots, hyphens, and underscores
  const extension = filename.split('.').pop() || '';
  const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.')) || filename;
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 80);
  return `${cleanName}.${extension.toLowerCase()}`;
}

export function validateUploadedFile(
  file: File,
  maxSizeMb = 25,
  allowedExtensions = ['pdf', 'docx', 'xlsx', 'pptx', 'jpg', 'jpeg', 'png']
): FileValidationResult {
  const extension = file.name.split('.').pop()?.toLowerCase() || '';
  const fileSize = file.size;
  const maxBytes = maxSizeMb * 1024 * 1024;

  if (fileSize > maxBytes) {
    return {
      valid: false,
      error: `File size (${(fileSize / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum allowed limit of ${maxSizeMb} MB.`,
      sanitizedFilename: sanitizeFilename(file.name),
      fileType: extension,
      mimeType: file.type,
      fileSize
    };
  }

  if (!allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File format '.${extension}' is not permitted. Allowed formats: ${allowedExtensions.map((e) => `.${e}`).join(', ')}`,
      sanitizedFilename: sanitizeFilename(file.name),
      fileType: extension,
      mimeType: file.type,
      fileSize
    };
  }

  return {
    valid: true,
    sanitizedFilename: sanitizeFilename(file.name),
    fileType: extension,
    mimeType: file.type || `application/${extension}`,
    fileSize
  };
}

export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// Alias for convenience
export const validateMovFile = validateUploadedFile;
