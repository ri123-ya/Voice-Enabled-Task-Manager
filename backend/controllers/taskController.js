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

