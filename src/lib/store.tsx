
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { collection, doc, serverTimestamp, setDoc, deleteDoc, updateDoc, addDoc, query, where, orderBy } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export interface Task {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  subject: string;
  dueDate: string;
  completed: boolean;
  timeSlot?: string;
  userId: string;
}

export interface Goal {
  id: string;
  title: string;
  current: number;
  target: number;
  type: 'weekly' | 'monthly';
  userId: string;
}

export interface StudySession {
  id: string;
  date: string;
  duration: number;
  subject: string;
  productivity: number;
  userId: string;
}

export interface MajorDeadline {
  title: string;
  date: string;
  id: string;
}

interface FocusContextType {
  tasks: Task[];
  goals: Goal[];
  sessions: StudySession[];
  majorDeadline: MajorDeadline | null;
  hydrated: boolean;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'userId'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskSlot: (taskId: string, slot: string | undefined) => void;
  addSession: (session: Omit<StudySession, 'id' | 'userId'>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'userId'>) => void;
  updateGoal: (id: string, current: number) => void;
  deleteGoal: (id: string) => void;
  updateMajorDeadline: (deadline: Omit<MajorDeadline, 'id'> | null) => void;
  clearAll: () => void;
}

const FocusContext = createContext<FocusContextType | undefined>(undefined);

export function FocusProvider({ children }: { children: ReactNode }) {
  const { user, isUserLoading } = useUser();
  const db = useFirestore();

  // Firestore Collections References (Memoized)
  const tasksRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'user_profiles', user.uid, 'tasks');
  }, [db, user]);

  const goalsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'user_profiles', user.uid, 'goals');
  }, [db, user]);

  const sessionsRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, 'user_profiles', user.uid, 'study_sessions');
  }, [db, user]);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, 'user_profiles', user.uid);
  }, [db, user]);

  // Real-time Data Hooks
  const { data: tasksData, isLoading: tasksLoading } = useCollection<Task>(tasksRef);
  const { data: goalsData, isLoading: goalsLoading } = useCollection<Goal>(goalsRef);
  const { data: sessionsData, isLoading: sessionsLoading } = useCollection<StudySession>(sessionsRef);
  const { data: profileData, isLoading: profileLoading } = useDoc<any>(profileRef);

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !tasksLoading && !goalsLoading && !sessionsLoading && !profileLoading) {
      setHydrated(true);
    }
  }, [isUserLoading, tasksLoading, goalsLoading, sessionsLoading, profileLoading]);

  const addTask = (task: Omit<Task, 'id' | 'completed' | 'userId'>) => {
    if (!user || !tasksRef) return;
    const newTask = {
      ...task,
      completed: false,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    addDocumentNonBlocking(tasksRef, newTask);
  };

  const toggleTask = (id: string) => {
    if (!user || !tasksRef) return;
    const task = tasksData?.find(t => t.id === id);
    if (task) {
      const docRef = doc(tasksRef, id);
      updateDocumentNonBlocking(docRef, { 
        completed: !task.completed,
        updatedAt: serverTimestamp()
      });
    }
  };

  const deleteTask = (id: string) => {
    if (!user || !tasksRef) return;
    const docRef = doc(tasksRef, id);
    deleteDocumentNonBlocking(docRef);
  };

  const updateTaskSlot = (taskId: string, slot: string | undefined) => {
    if (!user || !tasksRef) return;
    const docRef = doc(tasksRef, taskId);
    updateDocumentNonBlocking(docRef, { 
      timeSlot: slot || null,
      updatedAt: serverTimestamp()
    });
  };

  const addSession = (session: Omit<StudySession, 'id' | 'userId'>) => {
    if (!user || !sessionsRef) return;
    const newSession = {
      ...session,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    addDocumentNonBlocking(sessionsRef, newSession);
  };

  const addGoal = (goal: Omit<Goal, 'id' | 'userId'>) => {
    if (!user || !goalsRef) return;
    const newGoal = {
      ...goal,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    addDocumentNonBlocking(goalsRef, newGoal);
  };

  const updateGoal = (id: string, current: number) => {
    if (!user || !goalsRef) return;
    const goal = goalsData?.find(g => g.id === id);
    if (goal) {
      const docRef = doc(goalsRef, id);
      updateDocumentNonBlocking(docRef, { 
        current: Math.max(0, Math.min(current, goal.target)),
        updatedAt: serverTimestamp()
      });
    }
  };

  const deleteGoal = (id: string) => {
    if (!user || !goalsRef) return;
    const docRef = doc(goalsRef, id);
    deleteDocumentNonBlocking(docRef);
  };

  const updateMajorDeadline = (deadline: Omit<MajorDeadline, 'id'> | null) => {
    if (!user || !profileRef) return;
    updateDocumentNonBlocking(profileRef, { 
      majorDeadline: deadline,
      updatedAt: serverTimestamp()
    });
  };

  const clearAll = async () => {
    if (!user) return;
    // Clearing cloud data is usually restricted in UI, 
    // but here we can implement a sequential deletion if needed.
    // For MVP, we'll focus on the data existing.
  };

  return (
    <FocusContext.Provider value={{ 
      tasks: tasksData || [], 
      goals: goalsData || [], 
      sessions: sessionsData || [], 
      majorDeadline: profileData?.majorDeadline || null, 
      hydrated,
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
