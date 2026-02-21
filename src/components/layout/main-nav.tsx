
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Timer, 
  Target, 
  Calendar, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "Tasks", icon: CheckSquare, href: "/tasks" },
  { name: "Study Timer", icon: Timer, href: "/timer" },
  { name: "Goals", icon: Target, href: "/goals" },
  { name: "Planner", icon: Calendar, href: "/planner" },
  { name: "Analytics", icon: BarChart3, href: "/analytics" },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 p-4 h-full bg-sidebar border-r border-sidebar-border w-64 fixed left-0 top-0 hidden md:flex">
      <div className="flex items-center gap-2 mb-8 px-2">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center font-bold text-primary-foreground">
          F
        </div>
        <span className="text-xl font-headline font-bold tracking-tight">FocusFlow</span>
      </div>
      
      <div className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        ))}
      </div>

      <div className="mt-auto">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
      </div>
    </nav>
  );
}
