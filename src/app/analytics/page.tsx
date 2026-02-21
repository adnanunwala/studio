
"use client";

import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie } from "recharts";
import { BarChart3, TrendingUp, PieChart as PieChartIcon } from "lucide-react";

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

  if (!hydrated) return null;

  // Mock data for charts if sessions are empty
  const studyData = sessions.length > 0 ? sessions.map(s => ({
    name: s.subject,
    value: s.duration
  })) : [
    { name: "Math", value: 120 },
    { name: "Science", value: 90 },
    { name: "English", value: 60 },
    { name: "History", value: 45 },
    { name: "Coding", value: 180 },
  ];

  const weeklyData = [
    { day: "Mon", sessions: 4 },
    { day: "Tue", sessions: 6 },
    { day: "Wed", sessions: 3 },
    { day: "Thu", sessions: 8 },
    { day: "Fri", sessions: 5 },
    { day: "Sat", sessions: 2 },
    { day: "Sun", sessions: 4 },
  ];

  const colors = ["#D0BFFF", "#A0C4FF", "#C1E1C1", "#FDFD96", "#FFB7B2"];

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
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Total Study Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">42.5</div>
                <div className="text-xs text-secondary font-medium mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +12% from last week
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Tasks Done</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{tasks.filter(t => t.completed).length}</div>
                <div className="text-xs text-muted-foreground mt-1">out of {tasks.length} total</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Focus Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">88%</div>
                <div className="text-xs text-secondary font-medium mt-1">Keep it up!</div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase">Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">5 days</div>
                <div className="text-xs text-muted-foreground mt-1">Current productivity streak</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  Sessions per Day
                </CardTitle>
                <CardDescription>Daily breakdown of your study focus sessions.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis hide />
                    <Bar dataKey="sessions" radius={[4, 4, 0, 0]} fill="hsl(var(--primary))">
                       {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? "hsl(var(--secondary))" : "hsl(var(--primary))"} />
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
                <CardDescription>How you're distributing your focus time.</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <PieChart>
                    <Pie
                      data={studyData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {studyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2 ml-4">
                  {studyData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                      <span className="text-muted-foreground font-medium">{item.name}</span>
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
