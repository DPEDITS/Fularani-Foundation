/**
 * Ensures a Cloudinary URL uses HTTPS and optionally applies transformations.
 * @param {string} url The original Cloudinary URL
 * @param {string} transformations Optional transformation string (e.g., 'w_800,c_fill')
 * @returns {string} The secured and transformed URL
 */
export const getSecureCloudinaryUrl = (url, transformations = '') => {
  if (!url) return '';
  if (typeof url !== 'string') return url;

  // Only process Cloudinary URLs
  if (!url.includes('cloudinary.com')) return url;

  // Force HTTPS
  let secureUrl = url.replace('http://', 'https://');

  if (transformations) {
    // Inject transformations after '/upload/'
    // Example: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
    // Becomes: https://res.cloudinary.com/demo/image/upload/w_800,c_fill/v1234/sample.jpg
    secureUrl = secureUrl.replace('/upload/', `/upload/${transformations}/`);
  }

  return secureUrl;
};
