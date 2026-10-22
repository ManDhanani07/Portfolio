/**
 * Practical 7: API Service Module
 * Handles Authentication, JWT Storage, Headers Injection & Protected Task Operations
 */

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Helper to safely unwrap backend responses
const unwrapResponse = (json) => {
  if (json && typeof json === "object") {
    if (json.data && typeof json.data === "object") return json.data;
    if (json.task && typeof json.task === "object") return json.task;
  }
  return json;
};

// =========================================================================
// TOKEN & STORAGE HELPERS
// =========================================================================

export const getToken = () => {
  return localStorage.getItem("token");
};

export const setToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const getCurrentUser = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.dispatchEvent(new Event("auth_state_change"));
};

export const logout = () => {
  removeToken();
};

export const isAuthenticated = () => {
  return Boolean(getToken());
};

// Generates headers with JWT Bearer Token if logged in
const getAuthHeaders = () => {
  const headers = {
    "Content-Type": "application/json",
  };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

// Handles API response errors with 401 auto-logout detection
const handleResponse = async (response) => {
  let data;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (response.status === 401) {
    // Clear credentials on 401 Unauthorized
    removeToken();
    const errorMsg = data?.message || "Session expired or unauthorized. Please log in.";
    const err = new Error(errorMsg);
    err.status = 401;
    throw err;
  }

  if (!response.ok) {
    const errorMsg = data?.message || `Request failed with status ${response.status}`;
    const err = new Error(errorMsg);
    err.status = response.status;
    err.data = data;
    throw err;
  }

  return data;
};

// =========================================================================
// AUTHENTICATION API ENDPOINTS
// =========================================================================

/**
 * Register a new user
 * POST /api/auth/register
 */
export const registerUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

/**
 * Login existing user and store JWT token
 * POST /api/auth/login
 */
export const loginUser = async ({ email, password }) => {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(response);

  if (data?.token) {
    setToken(data.token);
    if (data.user) {
      setCurrentUser(data.user);
    }
    window.dispatchEvent(new Event("auth_state_change"));
  }

  return data;
};

/**
 * Fetch current authenticated user info
 * GET /api/auth/me
 */
export const getMe = async () => {
  const response = await fetch(`${BASE_URL}/api/auth/me`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Request password reset email via Nodemailer
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (email) => {
  const response = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return handleResponse(response);
};

/**
 * Reset password using token
 * POST /api/auth/reset-password
 */
export const resetPassword = async ({ email, token, newPassword }) => {
  const response = await fetch(`${BASE_URL}/api/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, token, newPassword }),
  });

  return handleResponse(response);
};

// =========================================================================
// PROTECTED TASK API ENDPOINTS
// =========================================================================

/**
 * GET All Tasks (Protected)
 * GET /api/tasks
 */
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  const json = await handleResponse(response);
  const tasks = unwrapResponse(json);
  return Array.isArray(tasks) ? tasks : [];
};

/**
 * CREATE Task (Protected + Validated)
 * POST /api/tasks
 */
export const createTask = async (task) => {
  const response = await fetch(`${BASE_URL}/api/tasks`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  const json = await handleResponse(response);
  return unwrapResponse(json);
};

/**
 * UPDATE Task (Protected + Validated)
 * PUT /api/tasks/:id
 */
export const updateTask = async (id, task) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  const json = await handleResponse(response);
  return unwrapResponse(json);
};

/**
 * DELETE Task (Protected)
 * DELETE /api/tasks/:id
 */
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/api/tasks/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const json = await handleResponse(response);
  return unwrapResponse(json);
};

// =========================================================================
// ADMIN ONLY REPORT GENERATION ENDPOINTS
// =========================================================================

/**
 * Fetch task report for given date range (Admin Only)
 * GET /api/reports/tasks?startDate=...&endDate=...
 */
export const getAdminTaskReport = async ({ startDate, endDate }) => {
  const query = new URLSearchParams({ startDate, endDate }).toString();
  const response = await fetch(`${BASE_URL}/api/reports/tasks?${query}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse(response);
};

/**
 * Download task report as CSV file (Admin Only)
 * GET /api/reports/tasks?startDate=...&endDate=...&format=csv
 */
export const downloadAdminTaskReportCsv = async ({ startDate, endDate }) => {
  const query = new URLSearchParams({ startDate, endDate, format: "csv" }).toString();
  const response = await fetch(`${BASE_URL}/api/reports/tasks?${query}`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let errData = null;
    try { errData = await response.json(); } catch {}
    const msg = errData?.message || `Failed to download CSV: HTTP ${response.status}`;
    const err = new Error(msg);
    err.status = response.status;
    throw err;
  }

  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = `Task_Report_${startDate}_to_${endDate}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(downloadUrl);
};

// =========================================================================
// PRACTICAL 13: AI API SERVICE INTEGRATION
// =========================================================================

/**
 * Generate AI-powered task description and suggested priority
 * POST /api/ai/generate-description
 */
export const generateAiDescription = async (title) => {
  const response = await fetch(`${BASE_URL}/api/ai/generate-description`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ title }),
  });

  return handleResponse(response);
};