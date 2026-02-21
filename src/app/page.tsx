"use client";

import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { MotivationalQuote } from "@/components/dashboard/motivational-quote";
import { AIScheduler } from "@/components/dashboard/ai-scheduler";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, CheckCircle2, AlertCircle, Clock, Timer } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export default function Dashboard() {
  const { tasks, sessions, toggleTask, hydrated } = useFocusStore();

  const streak = useMemo(() => {
    if (!sessions.length) return 0;
    
    const dates = new Set(sessions.map(s => s.date));
    let count = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (dates.has(dateStr)) {
        count++;
      } else if (i === 0) {
        // If nothing today, continue checking from yesterday
        continue;
      } else {
        break;
      }
    }
    return count;
  }, [sessions]);

  const upcomingDeadline = useMemo(() => {
    const activeTasks = tasks
      .filter(t => !t.completed && t.dueDate)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    
    if (!activeTasks.length) return null;
    
    const nextTask = activeTasks[0];
    const diffTime = new Date(nextTask.dueDate).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return {
      title: nextTask.title,
      daysLeft: diffDays
    };
  }, [tasks]);

  if (!hydrated) return null;

  const todayTasks = tasks.filter(t => !t.completed);
  const completedTodayCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedTodayCount / tasks.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-headline font-bold text-foreground">Welcome back, Scholar</h1>
              <p className="text-muted-foreground mt-1">Ready to crush your focus goals today?</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium text-muted-foreground">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
            </div>
          </header>

          <MotivationalQuote />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-headline font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-secondary" />
                    Today's Tasks
                  </CardTitle>
                  <Link href="/tasks" className="text-xs font-medium text-primary hover:underline">View all</Link>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Daily Progress</span>
                      <span className="font-semibold">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="pt-4 space-y-3">
                    {todayTasks.length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle2 className="h-12 w-12 text-muted mx-auto mb-2 opacity-20" />
                        <p className="text-muted-foreground text-sm">All caught up! Time to relax or plan ahead.</p>
                      </div>
                    ) : (
                      todayTasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-accent/20 rounded-xl hover:bg-accent/40 transition-colors group">
                          <Checkbox 
                            id={task.id} 
                            checked={task.completed} 
                            onCheckedChange={() => toggleTask(task.id)}
                            className="h-5 w-5 rounded-md border-2 border-primary"
                          />
                          <div className="flex-1 min-w-0">
                            <label htmlFor={task.id} className="text-sm font-medium cursor-pointer block truncate">
                              {task.title}
                            </label>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-[10px] py-0 h-4">{task.subject}</Badge>
                              {task.priority === 'High' && <span className="text-[10px] text-destructive font-bold flex items-center gap-0.5"><AlertCircle className="h-2 w-2"/> Priority</span>}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      Current Streak
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-foreground">{streak} <span className="text-lg font-normal text-muted-foreground">days</span></div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {streak > 0 ? "You're doing great! Keep it up." : "Start a session to begin your streak!"}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-none shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Upcoming Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {upcomingDeadline ? (
                      <>
                        <div className="text-xl font-bold text-foreground">{upcomingDeadline.title}</div>
                        <p className={`text-xs font-medium mt-1 ${upcomingDeadline.daysLeft <= 2 ? 'text-destructive' : 'text-muted-foreground'}`}>
                          {upcomingDeadline.daysLeft === 0 ? "Due today" : upcomingDeadline.daysLeft === 1 ? "Due tomorrow" : `In ${upcomingDeadline.daysLeft} days`}
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="text-xl font-bold text-muted-foreground">No deadlines</div>
                        <p className="text-xs text-muted-foreground mt-1">Peace of mind!</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="space-y-8">
              <AIScheduler />
              <Card className="border-none shadow-sm bg-primary/10">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Timer className="h-4 w-4 text-primary" />
                    Quick Timer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-muted-foreground">Start a 25-minute Pomodoro session now.</p>
                  <Link href="/timer">
                    <button className="w-full bg-primary text-primary-foreground font-bold py-2 rounded-xl text-sm hover:opacity-90 transition-opacity">
                      Go to Study Timer
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
