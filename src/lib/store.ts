
import { useState, useEffect } from 'react';

export interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  subject: string;
  dueDate: string;
  completed: boolean;
  timeSlot?: string; // e.g. "09:00"
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  type: 'weekly' | 'monthly';
}

export interface StudySession {
  id: string;
  date: string;
  duration: number; // minutes
  subject: string;
  productivity: number; // 1-5
}

export function useFocusStore() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    const savedGoals = localStorage.getItem('focusflow_goals');
    const savedSessions = localStorage.getItem('focusflow_sessions');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('focusflow_goals', JSON.stringify(goals));
      localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
    }
  }, [tasks, goals, sessions, hydrated]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9), completed: false };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSessions([...sessions, newSession]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Math.random().toString(36).substr(2, 9) };
    setGoals([...goals, newGoal]);
  };

  const updateGoal = (id: string, current: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, current: Math.max(0, Math.min(current, g.target)) } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return { tasks, goals, sessions, addTask, toggleTask, deleteTask, addSession, addGoal, updateGoal, deleteGoal, hydrated };
}
