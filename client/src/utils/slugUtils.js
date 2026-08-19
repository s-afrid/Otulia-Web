/**
 * Converts asset title into a clean URL-friendly slug with '-' instead of spaces or special characters.
 * Falls back to ID if title is unavailable.
 */
export const createAssetSlug = (title, id) => {
  if (title) {
    const slug = title
      .toString()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove special characters
      .replace(/[\s_-]+/g, '-')   // replace spaces and underscores with a single hyphen
      .replace(/^-+|-+$/g, '');  // remove leading and trailing hyphens
    if (slug) return slug;
  }
  return id || '';
};
