export const MAX_FILE_SIZE_MB = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB);
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const validateFile = (file) => {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo'
  ];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      message: 'Invalid file type. Only images (JPEG, PNG, GIF) and videos (MP4, MOV, AVI) are allowed'
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      message: `File size exceeds ${MAX_FILE_SIZE_MB}MB limit`
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i]);
};