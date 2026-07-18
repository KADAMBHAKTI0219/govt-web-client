const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const fetchCategoriesAPI = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, data: [] };
  }
};

export const fetchCategoryBySlugAPI = async (slug) => {
  try {
    const response = await fetch(`${API_URL}/categories/${slug}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching category details for ${slug}:`, error);
    return { success: false, data: null };
  }
};
