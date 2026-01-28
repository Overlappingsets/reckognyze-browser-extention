/**
 * Utility functions for sanitizing user inputs
 */

/**
 * Sanitizes user input strings by trimming, limiting length, and removing dangerous characters
 * @param input - The string to sanitize
 * @param maxLength - Maximum allowed length (default: 100)
 * @returns Sanitized string
 */
export function sanitizeString(input: string, maxLength = 100): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential XSS characters
}

/**
 * Validates and sanitizes hex color codes
 * @param color - Color string to validate
 * @returns Valid hex color or default blue
 */
export function sanitizeColor(color: string): string {
  // Only allow valid hex colors
  const hexPattern = /^#[0-9A-Fa-f]{6}$/;
  if (hexPattern.test(color)) {
    return color.toLowerCase();
  }
  return '#3b82f6'; // Default blue
}

/**
 * Sanitizes tag/allergy inputs
 * @param tag - Tag string to sanitize
 * @returns Sanitized tag
 */
export function sanitizeTag(tag: string): string {
  return sanitizeString(tag, 50)
    .replace(/[^\w\s-]/g, ''); // Only allow alphanumeric, spaces, hyphens
}

/**
 * Validates profile name
 * @param name - Profile name to validate
 * @returns Error message or null if valid
 */
export function validateProfileName(name: string): string | null {
  const sanitized = sanitizeString(name, 50);
  
  if (!sanitized) {
    return 'Profile name is required';
  }
  
  if (sanitized.length < 2) {
    return 'Profile name must be at least 2 characters';
  }
  
  return null;
}

/**
 * Sanitizes height input
 * @param height - Height string
 * @returns Sanitized height
 */
export function sanitizeHeight(height: string): string {
  // Allow numbers, spaces, quotes, feet/inch symbols
  return height.replace(/[^0-9\s'"ft]/gi, '').slice(0, 10);
}

/**
 * Sanitizes size input (waist, shoe, etc.)
 * @param size - Size string
 * @returns Sanitized size
 */
export function sanitizeSize(size: string): string {
  // Allow numbers, decimal points, and common size notations
  return size.replace(/[^0-9.\s/]/g, '').slice(0, 10);
}
