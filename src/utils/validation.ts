export const PATTERNS = {
  phone: /^[\+]?[\d\s\-\(\)]{7,20}$/,
  nationalId: /^[A-Za-z0-9\-]{5,30}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const FILE_LIMITS = {
  profilePhoto: {
    maxSize: 2 * 1024 * 1024, // 2MB
    types: ['image/jpeg', 'image/png', 'image/webp'],
    label: 'Image (JPG, PNG, WebP, max 2MB)',
  },
  transcript: {
    maxSize: 5 * 1024 * 1024, // 5MB
    types: ['application/pdf'],
    label: 'PDF (max 5MB)',
  },
};

export function validateFile(
  file: File,
  config: { maxSize: number; types: string[] }
): string | null {
  if (!config.types.includes(file.type)) {
    return `Invalid file type. Accepted: ${config.types.join(', ')}`;
  }
  if (file.size > config.maxSize) {
    return `File too large. Maximum: ${(config.maxSize / 1024 / 1024).toFixed(0)}MB`;
  }
  return null;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
