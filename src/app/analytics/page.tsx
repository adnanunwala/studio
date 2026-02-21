
"use client";

import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Flame, Target, Zap, Clock } from "lucide-react";
import { useMemo } from "react";

const chartConfig = {
  sessions: {
    label: "Sessions",
    color: "hsl(var(--primary))",
  },
  value: {
    label: "Study Time",
    color: "hsl(var(--secondary))",
  }
} satisfies ChartConfig;

export default function AnalyticsPage() {
  const { sessions, tasks, hydrated } = useFocusStore();

  const stats = useMemo(() => {
    if (!sessions.length) {
      return {
        totalHours: 0,
        focusScore: 0,
        streak: 0,
        tasksDone: tasks.filter(t => t.completed).length,
        totalTasks: tasks.length
      };
    }

    const totalMinutes = sessions.reduce((acc, s) => acc + s.duration, 0);
    const avgProductivity = sessions.reduce((acc, s) => acc + s.productivity, 0) / sessions.length;
    
    // Streak logic
    const dates = new Set(sessions.map(s => s.date));
    let streakCount = 0;
    const today = new Date();
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];
      
      if (dates.has(dateStr)) {
        streakCount++;
      } else if (i === 0) {
        continue;
      } else {
        break;
      }
    }

    return {
      totalHours: (totalMinutes / 60).toFixed(1),
      focusScore: Math.round((avgProductivity / 5) * 100),
      streak: streakCount,
      tasksDone: tasks.filter(t => t.completed).length,
      totalTasks: tasks.length
    };
  }, [sessions, tasks]);

  // Data for charts
  const studyData = useMemo(() => {
    if (sessions.length === 0) {
      return [{ name: "No Data", value: 1 }];
    }
    const subjectMap: Record<string, number> = {};
    sessions.forEach(s => {
      subjectMap[s.subject] = (subjectMap[s.subject] || 0) + s.duration;
    });
    return Object.entries(subjectMap).map(([name, value]) => ({ name, value }));
  }, [sessions]);

  const weeklyData = useMemo(() => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const data = days.map(day => ({ day, sessions: 0 }));
    
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    
    sessions.forEach(s => {
      const sessionDate = new Date(s.date);
      if (sessionDate >= startOfWeek) {
        data[sessionDate.getDay()].sessions += 1;
      }
    });
    return data;
  }, [sessions]);

  if (!hydrated) return null;

  // Use theme-consistent colors
  const colors = [
    "hsl(var(--primary))", 
    "hsl(var(--secondary))", 
    "hsl(var(--primary) / 0.6)", 
    "hsl(var(--secondary) / 0.6)", 
    "hsl(var(--muted-foreground))"
  ];

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-headline font-bold text-foreground">Performance Insights</h1>
            <p className="text-muted-foreground">Detailed breakdown of your study habits and progress.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                  <Clock className="h-3 w-3" /> Total Study Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.totalHours}</div>
                <div className="text-xs text-muted-foreground mt-1">Lifetime focus time</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                  <Target className="h-3 w-3" /> Tasks Done
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.tasksDone}</div>
                <div className="text-xs text-muted-foreground mt-1">out of {stats.totalTasks} total</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                  <Zap className="h-3 w-3" /> Focus Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.focusScore}%</div>
                <div className="text-xs text-muted-foreground mt-1">Based on productivity ratings</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase flex items-center gap-2">
                  <Flame className="h-3 w-3" /> Current Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.streak} <span className="text-lg font-normal">days</span></div>
                <div className="text-xs text-muted-foreground mt-1">Consecutive study days</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Weekly Sessions
                </CardTitle>
                <CardDescription>Number of focus sessions this week.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis hide />
                    <Bar dataKey="sessions" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))">
                       {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.sessions > 0 ? "hsl(var(--primary))" : "hsl(var(--muted)/0.3)"} />
                      ))}
                    </Bar>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChartIcon className="h-5 w-5 text-secondary" />
                  Time per Subject
                </CardTitle>
                <CardDescription>Distribution of your focus time.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex flex-col md:flex-row items-center justify-center gap-4">
                <ChartContainer config={chartConfig} className="h-48 w-48 shrink-0">
                  <PieChart>
                    <Pie
                      data={studyData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {studyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} stroke="transparent" />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                  {studyData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-muted-foreground font-medium truncate max-w-[100px]">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
