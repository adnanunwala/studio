
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

export interface MajorDeadline {
  title: string;
  date: string;
}

interface FocusContextType {
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  majorDeadline: MajorDeadline | null;
  hydrated: boolean;
  addTask: (task: Omit<Task, 'id' | 'completed'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskSlot: (taskId: string, slot: string | undefined) => void;
  addSession: (session: Omit<StudySession, 'id'>) => void;
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;
  updateMajorDeadline: (deadline: MajorDeadline | null) => void;
  clearAll: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [majorDeadline, setMajorDeadline] = useState<MajorDeadline | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem('focusflow_tasks');
    const savedGoals = localStorage.getItem('focusflow_goals');
    const savedSessions = localStorage.getItem('focusflow_sessions');
    const savedDeadline = localStorage.getItem('focusflow_deadline');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    if (savedDeadline) setMajorDeadline(JSON.parse(savedDeadline));
    
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      localStorage.setItem('focusflow_tasks', JSON.stringify(tasks));
      localStorage.setItem('focusflow_goals', JSON.stringify(goals));
      localStorage.setItem('focusflow_sessions', JSON.stringify(sessions));
      localStorage.setItem('focusflow_deadline', JSON.stringify(majorDeadline));
    }
  }, [tasks, goals, sessions, majorDeadline, hydrated]);

  const addTask = (task: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = { ...task, id: Math.random().toString(36).substr(2, 9), completed: false };
    setTasks(prev => [...prev, newTask]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTaskSlot = (taskId: string, slot: string | undefined) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, timeSlot: slot } : t));
  };

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSessions(prev => [...prev, newSession]);
  };

  const addGoal = (goal: Omit<Goal, 'id'>) => {
    const newGoal = { ...goal, id: Math.random().toString(36).substr(2, 9) };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoal = (id: string, current: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: Math.max(0, Math.min(current, g.target)) } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateMajorDeadline = (deadline: MajorDeadline | null) => {
    setMajorDeadline(deadline);
  };

  const clearAll = () => {
    setTasks([]);
    setGoals([]);
    setSessions([]);
    setMajorDeadline(null);
    localStorage.removeItem('focusflow_tasks');
    localStorage.removeItem('focusflow_goals');
    localStorage.removeItem('focusflow_sessions');
    localStorage.removeItem('focusflow_deadline');
  };

  return (
    <FocusContext.Provider value={{ 
      tasks, goals, sessions, majorDeadline, hydrated,
      addTask, toggleTask, deleteTask, updateTaskSlot,
      addSession, addGoal, updateGoal, deleteGoal, 
      updateMajorDeadline, clearAll 
    }}>
      {children}
    </FocusContext.Provider>
  );
}

export function useFocusStore() {
  const context = useContext(FocusContext);
  if (context === undefined) {
    throw new Error('useFocusStore must be used within a FocusProvider');
  }
  return context;
}
