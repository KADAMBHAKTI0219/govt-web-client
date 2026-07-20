const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Admin Login API
 * Route: POST /api/auth/login
 * Body: { email, password }
 */
export const adminLoginAPI = async (email, password) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Admin Login API error:", error);
    return {
      success: false,
      message: "Unable to connect to backend server",
    };
  }
};

/**
 * Fetch Admin Dashboard Stats API
 * Route: GET /api/dashboard
 */
export const fetchAdminDashboardAPI = async (token) => {
  try {
    const response = await fetch(`${API_URL}/dashboard`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { success: false, data: null };
  }
};

/* ==========================================================================
   ADMIN PARTICIPANT CRUD API ENDPOINTS
   ========================================================================== */

/**
 * Fetch All Participants for Admin (Protected)
 * Route: GET /api/participants
 */
export const fetchAdminParticipantsAPI = async (token, queryParams = {}) => {
  try {
    const query = new URLSearchParams(queryParams).toString();
    const url = `${API_URL}/participants${query ? `?${query}` : ''}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching participants:", error);
    return { success: false, participants: [] };
  }
};

/**
 * Update Participant Review Status (Admin Protected)
 * Route: PUT /api/participants/:id/status
 * Body: { status: 'PENDING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED', categoryId?: string }
 */
export const updateParticipantStatusAPI = async (id, status, categoryIdOrToken, tokenArg) => {
  try {
    let categoryId = null;
    let token = null;

    if (tokenArg !== undefined) {
      categoryId = categoryIdOrToken;
      token = tokenArg;
    } else {
      token = categoryIdOrToken;
    }

    const body = { status: String(status).toUpperCase() };
    if (categoryId) body.categoryId = categoryId;

    const response = await fetch(`${API_URL}/participants/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating participant status:", error);
    return { success: false, message: "Status update failed" };
  }
};

/**
 * Delete Participant (Admin Protected)
 * Route: DELETE /api/participants/:id
 */
export const deleteParticipantAdminAPI = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/participants/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting participant ${id}:`, error);
    return { success: false, message: "Participant deletion failed" };
  }
};

/* ==========================================================================
   ADMIN CATEGORY CRUD API ENDPOINTS
   ========================================================================== */

/**
 * Create New Category (Admin Protected)
 * Route: POST /api/categories
 * Supports both JSON and FormData (with image file upload)
 */
export const createCategoryAPI = async (payload, token) => {
  try {
    const isFormData = payload instanceof FormData;
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, message: "Server connection failed" };
  }
};

/**
 * Update Category (Admin Protected)
 * Route: PUT /api/categories/:id
 * Supports both JSON and FormData (with image file upload)
 */
export const updateCategoryAPI = async (id, payload, token) => {
  try {
    const isFormData = payload instanceof FormData;
    const headers = {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "PUT",
      headers,
      body: isFormData ? payload : JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error updating category ${id}:`, error);
    return { success: false, message: "Server connection failed" };
  }
};

/**
 * Delete Category (Admin Protected)
 * Route: DELETE /api/categories/:id
 */
export const deleteCategoryAPI = async (id, token) => {
  try {
    const response = await fetch(`${API_URL}/categories/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error deleting category ${id}:`, error);
    return { success: false, message: "Server connection failed" };
  }
};
