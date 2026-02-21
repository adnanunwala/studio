
"use client";

import { useEffect, useState } from "react";
import { suggestOptimalStudyTimes, IntelligentStudyTimeSuggestionOutput } from "@/ai/flows/intelligent-study-time-suggestion-flow";
import { Sparkles, Clock } from "lucide-react";
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
            startTime: "09:00 AM", 
            endTime: "10:00 AM",
            subject: s.subject,
            productivityRating: s.productivity as any
          })),
          upcomingTasks: tasks.filter(t => !t.completed).map(t => ({
            id: t.id,
            name: t.title,
            priority: t.priority as any,
            subject: t.subject
          })),
          dailySchedule: tasks
            .filter(t => t.timeSlot && !t.completed)
            .map(t => {
              const hour = parseInt(t.timeSlot!.split(':')[0]);
              const ampm = hour >= 12 ? 'PM' : 'AM';
              const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
              const nextHour = hour + 1;
              const endAmpm = nextHour >= 12 ? 'PM' : 'AM';
              const endDisplayHour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;
              
              return {
                startTime: `${displayHour}:00 ${ampm}`,
                endTime: `${endDisplayHour}:00 ${endAmpm}`,
                activity: `Scheduled: ${t.title}`
              };
            })
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

  if (loading) return <Skeleton className="h-[240px] w-full rounded-xl" />;

  return (
    <Card className="border-none shadow-sm bg-accent/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Smart Schedule
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestion?.suggestedStudySlots.length ? (
          suggestion.suggestedStudySlots.map((slot, idx) => (
            <div key={idx} className="flex flex-col gap-1 p-3 bg-background/50 rounded-lg border border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold flex items-center gap-1 text-primary">
                  <Clock className="h-3 w-3" />
                  {slot.startTime} - {slot.endTime}
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">{slot.subjectRecommendation || "General"}</Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 leading-tight font-medium">
                {slot.reason}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-muted-foreground text-center py-4 italic">No suggestions available yet.</p>
        )}
        <div className="pt-2 border-t border-border/20">
          <p className="text-[10px] text-muted-foreground italic leading-tight">
            {suggestion?.explanation}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
