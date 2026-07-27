import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BloomsPyramid from './components/BloomsPyramid';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import ReflectionModal from './components/ReflectionModal';
import AnalyticsView from './components/AnalyticsView';

const LOCAL_STORAGE_KEY = 'taskmaker_blooms_tasks_v2'; // Reset storage key for clean slate

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading localStorage:', err);
    }
    return []; // Completely blank initial state
  });

  const [activeTrack, setActiveTrack] = useState('ALL'); // ALL, INSTITUTE, PERSONAL
  const [selectedLevelFilter, setSelectedLevelFilter] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalInitialTrack, setModalInitialTrack] = useState('INSTITUTE');

  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [reflectingTask, setReflectingTask] = useState(null);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [tasks]);

  // Handler: Toggle Task Status
  const handleToggleStatus = (task) => {
    const isCurrentlyCompleted = task.status === 'COMPLETED';
    
    if (!isCurrentlyCompleted) {
      // Prompt for reflection upon completion
      setReflectingTask(task);
      setIsReflectionModalOpen(true);
    }

    setTasks(prev => prev.map(t => {
      if (t.id === task.id) {
        return {
          ...t,
          status: isCurrentlyCompleted ? 'TODO' : 'COMPLETED',
          completedAt: isCurrentlyCompleted ? null : new Date().toISOString()
        };
      }
      return t;
    }));
  };

  // Handler: Save Task (Create or Update)
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks(prev => [taskData, ...prev]);
    }
    setEditingTask(null);
  };

  // Handler: Delete Task
  const handleDeleteTask = (taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // Handler: Clear All Data
  const handleClearAllData = () => {
    if (window.confirm('Are you sure you want to clear all tasks and start completely blank?')) {
      setTasks([]);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  };

  // Handler: Edit Task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalInitialTrack(task.track || 'INSTITUTE');
    setIsTaskModalOpen(true);
  };

  // Handler: Open Task Modal with Track Pre-selected
  const handleOpenNewTaskWithTrack = (track = 'INSTITUTE') => {
    setEditingTask(null);
    setModalInitialTrack(track);
    setIsTaskModalOpen(true);
  };

  // Handler: Open Reflection Modal directly
  const handleOpenReflection = (task) => {
    setReflectingTask(task);
    setIsReflectionModalOpen(true);
  };

  // Handler: Save Reflection Takeaway
  const handleSaveReflection = (taskId, reflectionObj) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          reflections: [...(t.reflections || []), reflectionObj],
          painRating: reflectionObj.pain || t.painRating
        };
      }
      return t;
    }));
  };

  return (
    <div className="app-root">
      <Navbar 
        tasks={tasks}
        activeTrack={activeTrack}
        setActiveTrack={setActiveTrack}
        onOpenNewTask={handleOpenNewTaskWithTrack}
        showAnalytics={showAnalytics}
        setShowAnalytics={setShowAnalytics}
        onClearAllData={handleClearAllData}
      />

      <main className="app-container">
        {/* Left Sidebar: Interactive Bloom's Pyramid */}
        <aside>
          <BloomsPyramid 
            tasks={tasks}
            selectedLevelFilter={selectedLevelFilter}
            setSelectedLevelFilter={setSelectedLevelFilter}
          />
        </aside>

        {/* Main Content Area */}
        <section>
          {showAnalytics ? (
            <AnalyticsView tasks={tasks} />
          ) : (
            <TaskBoard 
              tasks={tasks}
              activeTrack={activeTrack}
              setActiveTrack={setActiveTrack}
              selectedLevelFilter={selectedLevelFilter}
              onToggleStatus={handleToggleStatus}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onOpenReflection={handleOpenReflection}
              onOpenNewTask={handleOpenNewTaskWithTrack}
            />
          )}
        </section>
      </main>

      {/* Modals */}
      <TaskModal 
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSaveTask={handleSaveTask}
        editingTask={editingTask}
        initialTrack={modalInitialTrack}
      />

      <ReflectionModal 
        isOpen={isReflectionModalOpen}
        onClose={() => {
          setIsReflectionModalOpen(false);
          setReflectingTask(null);
        }}
        task={reflectingTask}
        onSaveReflection={handleSaveReflection}
      />
    </div>
  );
}
