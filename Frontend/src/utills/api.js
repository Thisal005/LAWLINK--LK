// utils/api.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

// Assign a new task
export const createTask = async (taskData) => {
  const response = await axios.post(API_URL, taskData, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Get task details by ID
export const getTask = async (taskId) => {
  const response = await axios.get(`${API_URL}/${taskId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  return response.data;
};

// Update task status
export const updateTaskStatus = async (taskId, status) => {
  const response = await axios.put(
    `${API_URL}/${taskId}`,
    { status },
    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  );
  return response.data;
};