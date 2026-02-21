
"use client";

import { useFocusStore, Task } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export default function PlannerPage() {
  const { tasks, updateTaskSlot, hydrated } = useFocusStore();

  if (!hydrated) return null;

  const unscheduledTasks = tasks.filter(t => !t.completed && !t.timeSlot);
  
  const getTasksForHour = (hour: number) => {
    const slotStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
    return tasks.filter(t => t.timeSlot === slotStr && !t.completed);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-headline font-bold text-foreground">Daily Planner</h1>
            <p className="text-muted-foreground">Map out your day for maximum productivity.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <Card className="border-none shadow-sm">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Today's Timeline</CardTitle>
                    <div className="text-sm font-medium text-muted-foreground">
                      {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[700px]">
                    <div className="p-4 space-y-0">
                      {HOURS.map((hour) => {
                        const label = hour > 12 ? `${hour - 12} PM` : hour === 12 ? '12 PM' : `${hour} AM`;
                        const slotStr = hour < 10 ? `0${hour}:00` : `${hour}:00`;
                        const tasksInSlot = getTasksForHour(hour);

                        return (
                          <div key={hour} className="timeline-grid group">
                            <div className="py-8 pr-4 text-xs font-semibold text-muted-foreground border-r border-border/50 text-right">
                              {label}
                            </div>
                            <div className="relative border-b border-border/20 p-2 min-h-[80px] hover:bg-accent/10 transition-colors flex flex-wrap gap-2 items-center">
                              {tasksInSlot.length > 0 ? (
                                tasksInSlot.map(task => (
                                  <div key={task.id} className="bg-primary/20 border border-primary/30 p-2 rounded-lg text-xs flex items-center gap-2 group/task relative">
                                    <span className="font-bold">{task.title}</span>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-4 w-4 rounded-full p-0 hover:bg-destructive hover:text-destructive-foreground opacity-0 group-hover/task:opacity-100 transition-opacity"
                                      onClick={() => updateTaskSlot(task.id, undefined)}
                                    >
                                      <X className="h-3 w-3" />
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  Available Slot
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-sm bg-accent/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Unscheduled Tasks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {unscheduledTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">All tasks scheduled!</p>
                  ) : (
                    unscheduledTasks.map(task => (
                      <div key={task.id} className="p-3 bg-background rounded-xl border shadow-sm space-y-2">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <Select onValueChange={(val) => updateTaskSlot(task.id, val)}>
                          <SelectTrigger className="h-7 text-[10px] bg-muted/50">
                            <SelectValue placeholder="Assign Slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {HOURS.map(h => {
                              const l = h > 12 ? `${h - 12} PM` : h === 12 ? '12 PM' : `${h} AM`;
                              const v = h < 10 ? `0${h}:00` : `${h}:00`;
                              return <SelectItem key={v} value={v}>{l}</SelectItem>
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="bg-primary/10 rounded-2xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Planner Tip
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Assign tasks to specific hours to build a mental commitment to your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
