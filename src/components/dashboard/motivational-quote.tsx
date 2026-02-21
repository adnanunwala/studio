
"use client";

import { useEffect, useState } from "react";
import { dynamicMotivationalQuotes, DynamicMotivationalQuotesOutput } from "@/ai/flows/dynamic-motivational-quotes-flow";
import { Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function MotivationalQuote() {
  const [quote, setQuote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuote() {
      try {
        const result = await dynamicMotivationalQuotes();
        setQuote(result.quote);
      } catch (error) {
        console.error("Failed to fetch quote", error);
      } finally {
        setLoading(false);
      }
    }
    fetchQuote();
  }, []);

  if (loading) {
    return <Skeleton className="h-24 w-full rounded-xl" />;
  }

  return (
    <Card className="bg-gradient-to-br from-primary/20 to-secondary/20 border-none shadow-none overflow-hidden relative">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Quote className="h-6 w-6 text-primary shrink-0 opacity-50" />
          <p className="text-lg font-medium italic text-foreground/80 leading-relaxed">
            "{quote || "Success is the sum of small efforts, repeated day in and day out."}"
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
