const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Public: Fetch all categories
 * Route: GET /api/categories
 */
export const fetchCategoriesAPI = async (queryParams = {}) => {
  try {
    const query = new URLSearchParams(queryParams).toString();
    const url = `${API_URL}/categories${query ? `?${query}` : ''}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.success) {
      return {
        success: true,
        data: data.categories || data.data || []
      };
    }
    return { success: false, data: [] };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [] };
  }
};

/**
 * Public: Fetch single category by slug
 * Route: GET /api/categories/:slug
 */
export const fetchCategoryBySlugAPI = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`);
    const data = await response.json();
    if (data.success) {
      return {
        success: true,
        data: data.category || data.data || null
      };
    }
    return { success: false, data: null };
  } catch (error) {
    console.error(`Error fetching category details for ${slug}:`, error);
    return { success: false, data: null };
  }
};
