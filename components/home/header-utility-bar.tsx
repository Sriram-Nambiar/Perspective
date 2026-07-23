"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Calendar, MapPin, ChevronDown, Sun, Moon, Circle } from "lucide-react";

export const HeaderUtilityBar: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("theme") as "light" | "dark" | "auto" | null;
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return "light";
  });

  const applyTheme = useCallback((newTheme: "light" | "dark" | "auto") => {
    if (typeof window === "undefined") return;
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (newTheme === "dark" || (newTheme === "auto" && isSystemDark)) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const handleThemeChange = (newTheme: "light" | "dark" | "auto") => {
    setTheme(newTheme);
    try {
      localStorage.setItem("theme", newTheme);
    } catch {
      // ignore
    }
    applyTheme(newTheme);
  };

  return (
    <div className="w-full bg-[#F8F9FA] border-b border-[#E5E7EB] text-[11px] sm:text-[12px] text-[#4B5563] py-1.5 sm:py-2 px-3 sm:px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
        {/* Left Utility items */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1 font-medium text-[#374151] whitespace-nowrap">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280]" />
            <span>Mon, June 1, 2026</span>
          </div>

          <span className="text-[#D1D5DB]">|</span>

          <button
            type="button"
            className="flex items-center gap-1 hover:text-[#111827] transition-colors cursor-pointer whitespace-nowrap"
          >
            <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280]" />
            <span>Set Location</span>
          </button>

          <span className="text-[#D1D5DB]">|</span>

          <button
            type="button"
            className="flex items-center gap-1 hover:text-[#111827] transition-colors cursor-pointer font-medium whitespace-nowrap"
          >
            <span>India Edition</span>
            <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#6B7280]" />
          </button>
        </div>

        {/* Right Theme Selector */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <span className="text-[#6B7280] font-medium text-[11px]">Theme:</span>
          <div className="inline-flex items-center bg-[#E5E7EB]/70 p-0.5 rounded-full text-[10px] sm:text-[11px] font-medium">
            <button
              type="button"
              onClick={() => handleThemeChange("light")}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-white text-[#111827] shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Sun className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F59E0B]" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("dark")}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-[#1F2937] text-white shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Moon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#60A5FA]" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => handleThemeChange("auto")}
              className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "auto"
                  ? "bg-white text-[#111827] shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Circle className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-[#9CA3AF]" />
              <span>Auto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
