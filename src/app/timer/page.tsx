
"use client";

import { useState, useEffect, useCallback } from "react";
import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Coffee, Brain, Bell, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function TimerPage() {
  const { addSession, timerSettings, hydrated } = useFocusStore();
  
  const [timeLeft, setTimeLeft] = useState(timerSettings.focusDuration * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'break'>('focus');
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  // Sync with store settings when they load or change
  useEffect(() => {
    if (hydrated && !isActive) {
      setTimeLeft(mode === 'focus' ? timerSettings.focusDuration * 60 : timerSettings.breakDuration * 60);
    }
  }, [timerSettings, mode, hydrated, isActive]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTimeLeft(mode === 'focus' ? timerSettings.focusDuration * 60 : timerSettings.breakDuration * 60);
  }, [mode, timerSettings]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      
      if (typeof window !== 'undefined') {
        const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
        audio.play().catch(e => console.log("Audio play blocked"));
      }

      if (mode === 'focus') {
        setSessionsCompleted(s => s + 1);
        addSession({
          date: new Date().toISOString().split('T')[0],
          duration: timerSettings.focusDuration,
          subject: "Timer Session",
          productivity: 5
        });
        setMode('break');
        setTimeLeft(timerSettings.breakDuration * 60);
      } else {
        setMode('focus');
        setTimeLeft(timerSettings.focusDuration * 60);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode, addSession, timerSettings]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (!hydrated) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8 flex flex-col items-center justify-center">
        <div className="max-w-md w-full space-y-12 text-center">
          <header className="relative">
            <h1 className="text-3xl font-headline font-bold text-foreground">Deep Focus</h1>
            <p className="text-muted-foreground">Master your time, one session at a time.</p>
            <Link href="/settings" className="absolute -top-4 -right-4 md:right-0 p-2 text-muted-foreground hover:text-primary transition-colors">
              <Settings className="h-5 w-5" />
            </Link>
          </header>

          <div className="flex items-center justify-center gap-4 bg-muted/30 p-2 rounded-2xl w-fit mx-auto">
            <Button 
              variant={mode === 'focus' ? "default" : "ghost"}
              onClick={() => { setMode('focus'); setIsActive(false); }}
              className={cn("rounded-xl transition-all", mode === 'focus' ? "bg-primary text-primary-foreground shadow-md" : "")}
            >
              <Brain className="h-4 w-4 mr-2" /> Focus ({timerSettings.focusDuration}m)
            </Button>
            <Button 
              variant={mode === 'break' ? "default" : "ghost"}
              onClick={() => { setMode('break'); setIsActive(false); }}
              className={cn("rounded-xl transition-all", mode === 'break' ? "bg-secondary text-secondary-foreground shadow-md" : "")}
            >
              <Coffee className="h-4 w-4 mr-2" /> Break ({timerSettings.breakDuration}m)
            </Button>
          </div>

          <div className="relative flex items-center justify-center">
            <svg className="w-80 h-80 -rotate-90">
              <circle
                cx="160" cy="160" r="150"
                className="stroke-muted-foreground/10 fill-none"
                strokeWidth="12"
              />
              <circle
                cx="160" cy="160" r="150"
                className={cn(
                  "stroke-primary fill-none transition-all duration-1000",
                  mode === 'break' && "stroke-secondary"
                )}
                strokeWidth="12"
                strokeDasharray={150 * 2 * Math.PI}
                strokeDashoffset={(150 * 2 * Math.PI) * (1 - timeLeft / ((mode === 'focus' ? timerSettings.focusDuration : timerSettings.breakDuration) * 60))}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-7xl font-headline font-black tabular-nums tracking-tighter">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest mt-2">
                {mode === 'focus' ? 'Time to work' : 'Relax time'}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button 
              size="lg" 
              variant="outline" 
              onClick={resetTimer} 
              className="h-16 w-16 rounded-full border-2 hover:bg-muted"
            >
              <RotateCcw className="h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              onClick={toggleTimer} 
              className={cn(
                "h-20 w-20 rounded-full shadow-xl transition-transform hover:scale-105 active:scale-95 text-primary-foreground",
                isActive ? "bg-muted text-foreground" : "bg-primary"
              )}
            >
              {isActive ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current ml-1" />}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 w-16 rounded-full border-2"
              onClick={() => {}}
            >
              <Bell className="h-6 w-6" />
            </Button>
          </div>

          <Card className="border-none shadow-sm bg-accent/20 max-w-xs mx-auto">
            <CardContent className="py-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Sessions Today</span>
                <span className="font-bold text-lg">{sessionsCompleted}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
