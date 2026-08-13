const BASE_URL = "http://localhost:5000";

// Helper to safely unwrap backend responses (supports array or wrapper objects)
const unwrapResponse = (json) => {
  if (json && typeof json === "object") {
    if (json.data && typeof json.data === "object") return json.data;
    if (json.task && typeof json.task === "object") return json.task;
  }
  return json;
};

// ===============================
// GET TASKS
// ===============================

export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks");
  }

  const json = await response.json();
  const tasks = unwrapResponse(json);
  return Array.isArray(tasks) ? tasks : [];
};

// ===============================
// CREATE TASK (POST)
// ===============================

export const createTask = async (task) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const json = await response.json();
  return unwrapResponse(json);
};

// ===============================
// UPDATE TASK (PUT)
// ===============================

export const updateTask = async (id, task) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  const json = await response.json();
  return unwrapResponse(json);
};

// ===============================
// DELETE TASK (DELETE)
// ===============================

export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  const json = await response.json();
  return unwrapResponse(json);
};