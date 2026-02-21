
"use client";

import { useState } from "react";
import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Calendar, Tag, AlertCircle, Filter } from "lucide-react";

export default function TaskPage() {
  const { tasks, addTask, toggleTask, deleteTask, hydrated } = useFocusStore();
  const [newTitle, setNewTitle] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newPriority, setNewPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');

  if (!hydrated) return null;

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle,
      subject: newSubject || "General",
      priority: newPriority,
      dueDate: new Date().toISOString()
    });
    setNewTitle("");
    setNewSubject("");
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-headline font-bold text-foreground">Task Manager</h1>
            <p className="text-muted-foreground">Organize your study sessions and stay on track.</p>
          </header>

          <Card className="border-none shadow-sm mb-8">
            <CardContent className="pt-6">
              <form onSubmit={handleAddTask} className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-2">
                  <Input 
                    placeholder="What needs to be done?" 
                    className="flex-1 text-lg py-6"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Button type="submit" size="lg" className="bg-primary text-primary-foreground font-bold px-8">
                    <Plus className="h-5 w-5 mr-2" /> Add Task
                  </Button>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    <Input 
                      placeholder="Subject" 
                      className="h-8 w-32 bg-muted/50 border-none" 
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
                      <SelectTrigger className="h-8 w-32 bg-muted/50 border-none">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center justify-between">
                Active Tasks ({activeTasks.length})
                <Filter className="h-4 w-4" />
              </h2>
              <div className="space-y-3">
                {activeTasks.length === 0 && (
                  <p className="text-center text-muted-foreground py-12 bg-accent/10 rounded-2xl border-2 border-dashed border-muted/50">
                    No active tasks. Add one above!
                  </p>
                )}
                {activeTasks.map(task => (
                  <Card key={task.id} className="border-none shadow-sm group hover:shadow-md transition-all">
                    <CardContent className="p-4 flex items-center gap-4">
                      <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-6 w-6 rounded-md border-2 border-primary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{task.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge variant="secondary" className="text-[10px] py-0">{task.subject}</Badge>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[10px] py-0",
                              task.priority === 'High' ? "text-destructive border-destructive" :
                              task.priority === 'Medium' ? "text-primary border-primary" : "text-muted-foreground"
                            )}
                          >
                            {task.priority} Priority
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteTask(task.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {completedTasks.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 opacity-50">
                  Completed ({completedTasks.length})
                </h2>
                <div className="space-y-2 opacity-50">
                  {completedTasks.map(task => (
                    <div key={task.id} className="flex items-center gap-4 p-3 bg-muted/20 rounded-lg">
                       <Checkbox 
                        checked={task.completed} 
                        onCheckedChange={() => toggleTask(task.id)}
                        className="h-5 w-5 rounded-md border-2"
                      />
                      <span className="text-sm line-through text-muted-foreground">{task.title}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
