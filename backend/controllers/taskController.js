import Task from '../models/Task.js';
import { parseTaskInput } from '../services/aiService.js';

// Create a new task
export const createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Get all tasks with optional filtering and search
export const getTasks = async (req, res) => {
  try {
    const { status, priority, search, dueDate } = req.query;
    const filter = {};

    // Exact match filters
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    // Date filter (matches tasks due on that specific date)
    if (dueDate) {
      const start = new Date(dueDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(dueDate);
      end.setHours(23, 59, 59, 999);
      filter.dueDate = { $gte: start, $lte: end };
    }

    // Search filter (title or description)
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single task
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Analyze voice input using AI
export const analyzeTaskInput = async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript) {
      return res.status(400).json({ message: 'Transcript is required' });
    }

    // Parse voice input with AI
    const parsedData = await parseTaskInput(transcript);
    
    // Clean up empty fields - remove description if it's empty or whitespace
    if (parsedData.description && parsedData.description.trim() === '') {
      delete parsedData.description;
    }
    
    // Create and save the task to database
    const task = new Task(parsedData);
    const savedTask = await task.save();
    
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Failed to analyze and save task', error: error.message });
  }
};


