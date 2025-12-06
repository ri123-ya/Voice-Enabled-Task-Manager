import axios from 'axios';

const API_URL = 'http://localhost:3000/api/tasks';

export const connection = {
  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  },

  // Get a single task by ID
  getTaskById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching task:', error);
      throw error;
    }
  },

  // Create a new task
  createTask: async (taskData) => {
    try {
      const response = await axios.post(API_URL, taskData);
      return response.data;
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  },

  // Update a task
  updateTask: async (id, taskData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, taskData);
      return response.data;
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  },

  // Process voice command
  processVoiceCommand: async (command) => {
    try {
      const response = await axios.post(`${API_URL}/analyze`, { transcript: command });
      return response.data;
    } catch (error) {
      console.error('Error processing voice command:', error);
      throw error;
    }
  }
};
