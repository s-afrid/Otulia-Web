/**
 * Converts asset title into a clean URL-friendly slug with '-' instead of spaces or special characters.
 * Appends the asset ID so listings with identical titles have distinct URLs.
 */
export const createAssetSlug = (title, id) => {
  const normalizedId = id ? String(id) : '';
  if (title) {
    const slug = title
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // remove special characters
      .replace(/[\s_-]+/g, '-')   // replace spaces and underscores with a single hyphen
      .replace(/^-+|-+$/g, '');  // remove leading and trailing hyphens
    if (slug) return normalizedId ? `${slug}-${normalizedId}` : slug;
  }
  return normalizedId;
};

export const getAssetIdFromSlug = (slug) => {
  const match = String(slug || '').match(/(?:^|-)([a-f\d]{24})$/i);
  return match ? match[1] : null;
};
