import React from 'react';

const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const priorityColors = {
    'Critical': 'bg-red-500',
    'Urgent': 'bg-orange-500',
    'High Priority': 'bg-yellow-500',
    'Low Priority': 'bg-blue-500',
  };

  const priorityColor = priorityColors[task.priority] || 'bg-gray-500';

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 mb-3 border border-gray-700 hover:border-gray-600 group">
      {/* Priority Badge */}
      <div className="flex items-center justify-between mb-2">
        <span className={`${priorityColor} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
          {task.priority}
        </span>
        <button
          onClick={() => onDelete(task._id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500 hover:text-red-400"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Task Title */}
      <h3 className="text-lg font-bold text-gray-100 mb-2 line-clamp-2">
        {task.title}
      </h3>

      {/* Task Description */}
      {task.description && (
        <p className="text-gray-400 text-sm mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.dueDate)}
        </div>
      )}

      {/* Status Change Buttons */}
      <div className="flex gap-2 mt-3">
        {task.status !== 'To Do' && (
          <button
            onClick={() => onStatusChange(task._id, 'To Do')}
            className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            To Do
          </button>
        )}
        {task.status !== 'In Progress' && (
          <button
            onClick={() => onStatusChange(task._id, 'In Progress')}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-blue-200 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            In Progress
          </button>
        )}
        {task.status !== 'Done' && (
          <button
            onClick={() => onStatusChange(task._id, 'Done')}
            className="flex-1 bg-green-900 hover:bg-green-800 text-green-200 text-xs font-medium py-2 px-3 rounded-lg transition-colors duration-200"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
