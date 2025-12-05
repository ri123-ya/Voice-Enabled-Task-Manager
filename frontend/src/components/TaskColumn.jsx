import React from 'react';
import TaskCard from './TaskCard';

const TaskColumn = ({ title, tasks, icon, color, onDeleteTask, onStatusChange }) => {
  const colorClasses = {
    todo: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      header: 'bg-gradient-to-r from-yellow-600 to-amber-600',
      border: 'border-gray-700'
    },
    inProgress: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      header: 'bg-gradient-to-r from-blue-900 to-blue-800',
      border: 'border-gray-700'
    },
    done: {
      bg: 'bg-gradient-to-br from-gray-800 to-gray-900',
      header: 'bg-gradient-to-r from-green-900 to-green-800',
      border: 'border-gray-700'
    }
  };

  const selectedColor = colorClasses[color] || colorClasses.todo;

  return (
    <div className={`${selectedColor.bg} rounded-2xl shadow-lg border-2 ${selectedColor.border} overflow-hidden transition-all duration-300 hover:shadow-2xl`}>
      {/* Column Header */}
      <div className={`${selectedColor.header} p-4 text-white`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{icon}</span>
            <h2 className="text-xl font-bold">{title}</h2>
          </div>
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-3 py-1">
            <span className="text-sm font-semibold">{tasks.length}</span>
          </div>
        </div>
      </div>

      {/* Tasks Container */}
      <div className="p-4 min-h-[200px] max-h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">No tasks</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={onDeleteTask}
              onStatusChange={onStatusChange}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
