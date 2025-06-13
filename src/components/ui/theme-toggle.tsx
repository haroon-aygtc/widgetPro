import React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border border-violet-200/50 dark:border-violet-800/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-violet-500/25"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-amber-500" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-violet-400" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-violet-200/50 dark:border-violet-800/50 shadow-xl shadow-violet-500/10"
      >
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-amber-900/20 dark:hover:to-orange-900/20 transition-all duration-200"
        >
          <Sun className="mr-2 h-4 w-4 text-amber-500" />
          <span
            className={
              theme === "light"
                ? "font-semibold text-amber-600 dark:text-amber-400"
                : ""
            }
          >
            Light
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="cursor-pointer hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 dark:hover:from-violet-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
        >
          <Moon className="mr-2 h-4 w-4 text-violet-500" />
          <span
            className={
              theme === "dark"
                ? "font-semibold text-violet-600 dark:text-violet-400"
                : ""
            }
          >
            Dark
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 dark:hover:from-blue-900/20 dark:hover:to-cyan-900/20 transition-all duration-200"
        >
          <Monitor className="mr-2 h-4 w-4 text-blue-500" />
          <span
            className={
              theme === "system"
                ? "font-semibold text-blue-600 dark:text-blue-400"
                : ""
            }
          >
            System
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
