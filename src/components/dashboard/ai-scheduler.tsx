
"use client";

import { useEffect, useState } from "react";
import { suggestOptimalStudyTimes, IntelligentStudyTimeSuggestionOutput } from "@/ai/flows/intelligent-study-time-suggestion-flow";
import { Sparkles, Clock, CalendarIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFocusStore } from "@/lib/store";

export function AIScheduler() {
  const { tasks, sessions } = useFocusStore();
  const [suggestion, setSuggestion] = useState<IntelligentStudyTimeSuggestionOutput | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuggestions() {
      try {
        const input = {
          currentDate: new Date().toISOString().split('T')[0],
          pastStudySessions: sessions.map(s => ({
            date: s.date,
            startTime: "09:00 AM", // Simplified for mockup
            endTime: "10:00 AM",
            subject: s.subject,
            productivityRating: s.productivity as any
          })),
          upcomingTasks: tasks.filter(t => !t.completed).map(t => ({
            id: t.id,
            name: t.title,
            priority: t.priority as any,
            subject: t.subject
          }))
        };
        const result = await suggestOptimalStudyTimes(input);
        setSuggestion(result);
      } catch (error) {
        console.error("Failed to fetch AI suggestions", error);
      } finally {
        setLoading(false);
      }
    }
    fetchSuggestions();
  }, [tasks, sessions]);

  if (loading) return <Skeleton className="h-[200px] w-full" />;

  return (
    <Card className="border-none shadow-sm bg-accent/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Smart Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestion?.suggestedStudySlots.map((slot, idx) => (
          <div key={idx} className="flex flex-col gap-1 p-3 bg-background rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {slot.startTime} - {slot.endTime}
              </span>
              <Badge variant="secondary" className="text-[10px] py-0">{slot.subjectRecommendation}</Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1 leading-tight">
              {slot.reason}
            </p>
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground italic mt-2">
          {suggestion?.explanation}
        </p>
      </CardContent>
    </Card>
  );
}
