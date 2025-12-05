import React, { useState, useEffect } from 'react';

const EditTaskCard = ({ isOpen, onClose, onEditTask, task }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'To Do',
    priority: 'Low Priority',
    dueDate: ''
  });

  // Pre-fill form with existing task data when modal opens
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'To Do',
        priority: task.priority || 'Low Priority',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditTask(task._id, formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full animate-slide-up border border-gray-700 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 sm:p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold">Edit Task</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors duration-200"
              aria-label="Close modal"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label htmlFor="edit-title" className="block text-sm font-semibold text-gray-300 mb-2">
              Task Title *
            </label>
            <input
              type="text"
              id="edit-title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-200"
              placeholder="Enter task title"
            />
          </div>

          {/* Description Textarea */}
          <div>
            <label htmlFor="edit-description" className="block text-sm font-semibold text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="edit-description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-200 resize-none"
              placeholder="Enter task description"
            />
          </div>

          {/* Status and Priority Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Status Select */}
            <div>
              <label htmlFor="edit-status" className="block text-sm font-semibold text-gray-300 mb-2">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-200"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            {/* Priority Select */}
            <div>
              <label htmlFor="edit-priority" className="block text-sm font-semibold text-gray-300 mb-2">
                Priority
              </label>
              <select
                id="edit-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-200"
              >
                <option value="Low Priority">Low Priority</option>
                <option value="High Priority">High Priority</option>
                <option value="Urgent">Urgent</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Due Date Input */}
          <div>
            <label htmlFor="edit-dueDate" className="block text-sm font-semibold text-gray-300 mb-2">
              Due Date
            </label>
            <input
              type="date"
              id="edit-dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 rounded-xl text-gray-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-600 outline-none transition-all duration-200"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-200 font-semibold rounded-xl transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskCard;
