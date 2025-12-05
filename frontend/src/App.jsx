import { useState, useEffect } from 'react';
import KanbanColumn from './components/TaskColumn';
import VoiceButton from './components/VoiceButton';
import AddTaskModal from './components/AddNewTask';
import { connection } from './api/connection';

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await connection.getAllTasks();
      setTasks(data);
    } catch (error) {
      showNotification('Failed to fetch tasks', 'error');
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await connection.createTask(taskData);
      setTasks([...tasks, newTask]);
      showNotification('Task added successfully!', 'success');
    } catch (error) {
      showNotification('Failed to add task', 'error');
      console.error('Error adding task:', error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await connection.deleteTask(taskId);
      setTasks(tasks.filter(task => task._id !== taskId));
      showNotification('Task deleted successfully!', 'success');
    } catch (error) {
      showNotification('Failed to delete task', 'error');
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await connection.updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => task._id === taskId ? updatedTask : task));
      showNotification(`Task moved to ${newStatus}!`, 'success');
    } catch (error) {
      showNotification('Failed to update task', 'error');
      console.error('Error updating task:', error);
    }
  };

  const handleVoiceCommand = async (command) => {
    try {
      showNotification(`Processing: "${command}"`, 'info');
      const result = await connection.processVoiceCommand(command);
      
      if (result.task) {
        setTasks([...tasks, result.task]);
        showNotification('Task created from voice command!', 'success');
      } else {
        showNotification(result.message || 'Command processed', 'info');
      }
    } catch (error) {
      showNotification('Failed to process voice command', 'error');
      console.error('Error processing voice command:', error);
    }
  };

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filter tasks by status
  const todoTasks = tasks.filter(task => task.status === 'To Do');
  const inProgressTasks = tasks.filter(task => task.status === 'In Progress');
  const doneTasks = tasks.filter(task => task.status === 'Done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800 shadow-xl border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-gray-700 to-gray-600 p-2 sm:p-3 rounded-xl shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-100">
                  Voice Task Manager
                </h1>
                <p className="text-xs sm:text-sm text-gray-400">Organize your work efficiently</p>
              </div>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold px-4 py-2 sm:px-6 sm:py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Task
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            <KanbanColumn
              title="To Do"
              tasks={todoTasks}
              icon="📋"
              color="todo"
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
            <KanbanColumn
              title="In Progress"
              tasks={inProgressTasks}
              icon="⚡"
              color="inProgress"
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
            <KanbanColumn
              title="Done"
              tasks={doneTasks}
              icon="✅"
              color="done"
              onDeleteTask={handleDeleteTask}
              onStatusChange={handleStatusChange}
            />
          </div>
        )}
      </main>

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 sm:top-8 sm:right-8 z-50 animate-slide-down max-w-xs sm:max-w-sm ${
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          'bg-blue-500'
        } text-white px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 text-sm sm:text-base`}>
          <div className="flex-1 font-medium">{notification.message}</div>
          <button
            onClick={() => setNotification(null)}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Voice Button */}
      <VoiceButton onVoiceCommand={handleVoiceCommand} />
    </div>
  );
}

export default App;
