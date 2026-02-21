
"use client";

import { useState } from "react";
import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, Trash2, TrendingUp } from "lucide-react";

export default function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal, hydrated } = useFocusStore();
  const [title, setTitle] = useState("");
  const [target, setTarget] = useState("");
  const [type, setType] = useState<'weekly' | 'monthly'>('weekly');

  if (!hydrated) return null;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !target) return;
    addGoal({
      title,
      target: parseInt(target),
      current: 0,
      type
    });
    setTitle("");
    setTarget("");
  };

  const weeklyGoals = goals.filter(g => g.type === 'weekly');
  const monthlyGoals = goals.filter(g => g.type === 'monthly');

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-headline font-bold text-foreground">Goal Tracker</h1>
            <p className="text-muted-foreground">Set ambitious goals and track your journey to success.</p>
          </header>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Set a New Goal</CardTitle>
              <CardDescription>What do you want to achieve this week or month?</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGoal} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="goal-title">Goal Description</Label>
                  <Input 
                    id="goal-title"
                    placeholder="e.g., Study 20 hours" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-target">Target Units</Label>
                  <Input 
                    id="goal-target"
                    type="number"
                    placeholder="20" 
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal-type">Frequency</Label>
                  <Select value={type} onValueChange={(v: any) => setType(v)}>
                    <SelectTrigger id="goal-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="md:col-start-4 bg-primary text-primary-foreground font-bold">
                  <Plus className="h-4 w-4 mr-2" /> Add Goal
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-8">
            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Weekly Progress
              </h2>
              {weeklyGoals.length === 0 ? (
                <div className="py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed">
                  <p className="text-muted-foreground italic text-sm">No weekly goals set yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {weeklyGoals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Target className="h-5 w-5 text-secondary" />
                Monthly Milestones
              </h2>
              {monthlyGoals.length === 0 ? (
                <div className="py-12 text-center bg-muted/20 rounded-2xl border-2 border-dashed">
                  <p className="text-muted-foreground italic text-sm">No monthly goals set yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {monthlyGoals.map(goal => (
                    <GoalCard key={goal.id} goal={goal} onUpdate={updateGoal} onDelete={deleteGoal} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

function GoalCard({ goal, onUpdate, onDelete }: { goal: any, onUpdate: any, onDelete: any }) {
  const progress = (goal.current / goal.target) * 100;
  
  return (
    <Card className="border-none shadow-sm group hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-foreground text-lg">{goal.title}</h3>
            <p className="text-sm text-muted-foreground font-medium">
              Progress: <span className="text-foreground">{goal.current}</span> / {goal.target}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onDelete(goal.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <Progress value={progress} className="h-3 bg-muted" />
            <div className="flex justify-between items-center mt-1">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Completion</span>
              <span className="text-xs font-bold text-primary">{Math.round(progress)}%</span>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex-1 text-xs font-bold h-8"
              onClick={() => onUpdate(goal.id, goal.current + 1)}
              disabled={goal.current >= goal.target}
            >
              +1
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 text-xs font-bold h-8"
              onClick={() => onUpdate(goal.id, goal.current - 1)}
              disabled={goal.current <= 0}
            >
              -1
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
