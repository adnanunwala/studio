
"use client";

import { useFocusStore, Task } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 18 }, (_, i) => i + 6); // 6 AM to 11 PM

export default function PlannerPage() {
  const { tasks, hydrated } = useFocusStore();

  if (!hydrated) return null;

  const todayTasks = tasks.filter(t => !t.completed);

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
                        return (
                          <div key={hour} className="timeline-grid group">
                            <div className="py-8 pr-4 text-xs font-semibold text-muted-foreground border-r border-border/50 text-right">
                              {label}
                            </div>
                            <div className="relative border-b border-border/20 p-2 min-h-[60px] hover:bg-accent/10 transition-colors">
                              {/* Simple placeholder for drag-drop logic UI */}
                              <div className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                Click to schedule task
                              </div>
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
                  {todayTasks.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">No tasks to schedule.</p>
                  ) : (
                    todayTasks.map(task => (
                      <div key={task.id} className="p-3 bg-background rounded-xl border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary transition-colors">
                        <p className="text-sm font-medium truncate">{task.title}</p>
                        <Badge variant="outline" className="text-[10px] py-0 mt-1">{task.subject}</Badge>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <div className="bg-primary/10 rounded-2xl p-4 space-y-2">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  Productivity Tip
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Time-blocking your sessions can reduce anxiety and keep you focused on one subject at a time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
