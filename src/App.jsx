import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import BloomsPyramid from './components/BloomsPyramid';
import TaskBoard from './components/TaskBoard';
import TaskModal from './components/TaskModal';
import ReflectionModal from './components/ReflectionModal';
import LoginModal from './components/LoginModal';
import AnalyticsView from './components/AnalyticsView';

const LOCAL_STORAGE_KEY = 'taskmaker_blooms_tasks_v2';
const USER_STORAGE_KEY = 'taskmaker_user_v1';

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
    return [];
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (err) {
      console.error('Error reading user storage:', err);
    }
    return null;
  });

  const [activeTrack, setActiveTrack] = useState('ALL');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

  // Multi-select state
  const [selectedTaskIds, setSelectedTaskIds] = useState(new Set());

  // Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [modalInitialTrack, setModalInitialTrack] = useState('INSTITUTE');

  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false);
  const [reflectingTask, setReflectingTask] = useState(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Persist tasks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving to localStorage:', err);
    }
  }, [tasks]);

  // Persist user to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Error saving user storage:', err);
    }
  }, [user]);

  // Handler: Toggle single task select checkbox
  const handleToggleSelectTask = (taskId) => {
    setSelectedTaskIds(prev => {
      const next = new Set(prev);
      if (next.has(taskId)) next.delete(taskId);
      else next.add(taskId);
      return next;
    });
  };

  // Handler: Select All visible tasks
  const handleSelectAll = (visibleTaskIds) => {
    setSelectedTaskIds(new Set(visibleTaskIds));
  };

  // Handler: Clear all selections
  const handleClearSelection = () => {
    setSelectedTaskIds(new Set());
  };

  // Handler: Bulk mark selected tasks COMPLETED
  const handleBulkMarkComplete = () => {
    setTasks(prev => prev.map(t => {
      if (selectedTaskIds.has(t.id) && t.status !== 'COMPLETED') {
        return { ...t, status: 'COMPLETED', completedAt: new Date().toISOString() };
      }
      return t;
    }));
    setSelectedTaskIds(new Set());
  };

  // Handler: Bulk mark selected tasks INCOMPLETE (uncheck)
  const handleBulkMarkIncomplete = () => {
    setTasks(prev => prev.map(t => {
      if (selectedTaskIds.has(t.id)) {
        return { ...t, status: 'TODO', completedAt: null };
      }
      return t;
    }));
    setSelectedTaskIds(new Set());
  };

  // Handler: Bulk delete selected tasks
  const handleBulkDelete = () => {
    if (window.confirm(`Delete ${selectedTaskIds.size} selected task(s)? This cannot be undone.`)) {
      setTasks(prev => prev.filter(t => !selectedTaskIds.has(t.id)));
      setSelectedTaskIds(new Set());
    }
  };

  // Handler: Toggle Task Status (single)
  const handleToggleStatus = (task) => {
    const isCurrentlyCompleted = task.status === 'COMPLETED';

    if (!isCurrentlyCompleted) {
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

  // Handler: Toggle Sub-task Checkbox
  const handleToggleSubTask = (taskId, subTaskId) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubTasks = (t.subTasks || []).map((sub, idx) => {
          if (sub.id === subTaskId || idx === subTaskId) {
            return { ...sub, completed: !sub.completed };
          }
          return sub;
        });

        // Check if all subtasks are now completed
        const allCompleted = updatedSubTasks.length > 0 && updatedSubTasks.every(s => s.completed);

        return { 
          ...t, 
          subTasks: updatedSubTasks,
          status: allCompleted ? 'COMPLETED' : t.status,
          completedAt: (allCompleted && t.status !== 'COMPLETED') ? new Date().toISOString() : t.completedAt
        };
      }
      return t;
    }));
  };

  // Handler: Save Task (Single)
  const handleSaveTask = (taskData) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? taskData : t));
    } else {
      setTasks(prev => [taskData, ...prev]);
    }
    setEditingTask(null);
  };

  // Handler: Save Multi-Level Bloom Tasks (6 Tasks)
  const handleSaveMultiLevelTasks = (tasksArray) => {
    setTasks(prev => [...tasksArray, ...prev]);
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
        user={user}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => setUser(null)}
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
              user={user}
              onOpenLogin={() => setIsLoginModalOpen(true)}
              activeTrack={activeTrack}
              setActiveTrack={setActiveTrack}
              selectedLevelFilter={selectedLevelFilter}
              onToggleStatus={handleToggleStatus}
              onToggleSubTask={handleToggleSubTask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onOpenReflection={handleOpenReflection}
              onOpenNewTask={handleOpenNewTaskWithTrack}
              selectedTaskIds={selectedTaskIds}
              onToggleSelectTask={handleToggleSelectTask}
              onSelectAll={handleSelectAll}
              onClearSelection={handleClearSelection}
              onBulkMarkComplete={handleBulkMarkComplete}
              onBulkMarkIncomplete={handleBulkMarkIncomplete}
              onBulkDelete={handleBulkDelete}
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
        onSaveMultiLevelTasks={handleSaveMultiLevelTasks}
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

      <LoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(userData) => setUser(userData)}
      />
    </div>
  );
}
