
"use client";

import { useFocusStore } from "@/lib/store";
import { MainNav } from "@/components/layout/main-nav";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash2, ShieldAlert, Settings, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const { timerSettings, updateTimerSettings, clearAll, hydrated } = useFocusStore();
  const { toast } = useToast();
  
  const [focusTime, setFocusTime] = useState(timerSettings.focusDuration);
  const [breakTime, setBreakTime] = useState(timerSettings.breakDuration);

  useEffect(() => {
    if (hydrated) {
      setFocusTime(timerSettings.focusDuration);
      setBreakTime(timerSettings.breakDuration);
    }
  }, [hydrated, timerSettings]);

  if (!hydrated) return null;

  const handleSaveTimer = () => {
    updateTimerSettings({
      focusDuration: Number(focusTime),
      breakDuration: Number(breakTime)
    });
    toast({
      title: "Settings Saved",
      description: "Your study timer preferences have been updated.",
    });
  };

  const handleReset = () => {
    clearAll();
    toast({
      title: "Data Reset",
      description: "All your local application state has been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      <MainNav />
      <main className="flex-1 md:ml-64 p-4 md:p-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <header>
            <h1 className="text-3xl font-headline font-bold text-foreground flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Settings
            </h1>
            <p className="text-muted-foreground">Manage your application state and preferences.</p>
          </header>

          <div className="space-y-6">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Timer Settings
                </CardTitle>
                <CardDescription>Customize your default focus and break intervals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="focus-duration">Focus Duration (min)</Label>
                    <Input 
                      id="focus-duration" 
                      type="number" 
                      value={focusTime} 
                      onChange={(e) => setFocusTime(Number(e.target.value))} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="break-duration">Break Duration (min)</Label>
                    <Input 
                      id="break-duration" 
                      type="number" 
                      value={breakTime} 
                      onChange={(e) => setBreakTime(Number(e.target.value))} 
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveTimer} className="font-bold">Save Timer Settings</Button>
              </CardFooter>
            </Card>

            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">General Preferences</CardTitle>
                <CardDescription>Configure how FocusFlow works for you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <div>
                    <p className="text-sm font-medium">Auto-save to Cloud</p>
                    <p className="text-xs text-muted-foreground">Sync your data across multiple devices automatically.</p>
                  </div>
                  <div className="text-xs font-bold text-primary uppercase bg-primary/10 px-2 py-1 rounded">Enabled</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-destructive/20 shadow-sm border bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-5 w-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription>
                  Actions here are permanent and cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This will permanently delete your session history and goals from this device.
                </p>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant="destructive" 
                  onClick={handleReset}
                  className="font-bold w-full md:w-auto"
                >
                  <Trash2 className="h-4 w-4 mr-2" /> Reset Application Data
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
