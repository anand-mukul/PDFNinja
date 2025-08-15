"use client"

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FooterToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex rounded-full space-x-1 overflow-hidden p-1 border border-gray-200 dark:border-gray-400 bg-white dark:bg-black/95">
      {/* Light Theme Button */}
      <div
        className={`w-1/3 flex items-center justify-center rounded-full ${theme === "light" ? "bg-zinc-300" : "bg-transparent"
          } p-1 cursor-pointer`}
        onClick={() => setTheme("light")}
      >
        <SunIcon
          className={cn(
            "w-4 h-4 m-1 text-zinc-600",
            {
              "hover:text-zinc-800 hover:dark:text-zinc-200": theme !== "light",
              "dark:text-zinc-400": theme === "light"
            }
          )}
        />
      </div>

      {/* System Theme Button */}
      <div
        className={`w-1/3 flex items-center justify-center rounded-full ${theme === "system" ? "bg-zinc-300" : "bg-transparent"
          } p-1 cursor-pointer`}
        onClick={() => setTheme("system")}
      >
        <MonitorIcon
          className={cn(
            "w-4 h-4 m-1 text-zinc-600",
            {
              "hover:text-zinc-800 hover:dark:text-zinc-200": theme !== "system",
              "dark:text-zinc-400": theme === "system"
            }
          )}
        />
      </div>

      {/* Dark Theme Button */}
      <div
        className={`w-1/3 flex items-center justify-center rounded-full ${theme === "dark" ? "bg-zinc-900" : "bg-transparent"
          } p-1 cursor-pointer`}
        onClick={() => setTheme("dark")}
      >
        <MoonIcon
          className={cn(
            "w-4 h-4 m-1 text-zinc-600",
            {
              "hover:text-zinc-800 hover:dark:text-zinc-200": theme !== "dark",
              "dark:text-zinc-400": theme === "dark"
            }
          )}
        />
      </div>
    </div>
  );
}
