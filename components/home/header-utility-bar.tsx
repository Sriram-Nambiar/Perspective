"use client";

import React, { useState } from "react";
import { Calendar, MapPin, ChevronDown, Sun, Moon, Circle } from "lucide-react";

export const HeaderUtilityBar: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("light");

  return (
    <div className="w-full bg-[#F8F9FA] border-b border-[#E5E7EB] text-[12px] text-[#4B5563] py-2 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
        {/* Left Utility items */}
        <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-1.5 font-medium text-[#374151]">
            <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Mon, June 1, 2026</span>
          </div>

          <span className="text-[#D1D5DB]">|</span>

          <button
            type="button"
            className="flex items-center gap-1.5 hover:text-[#111827] transition-colors cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Set Location</span>
          </button>

          <span className="text-[#D1D5DB]">|</span>

          <button
            type="button"
            className="flex items-center gap-1 hover:text-[#111827] transition-colors cursor-pointer font-medium"
          >
            <span>India Edition</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
          </button>
        </div>

        {/* Right Theme Selector */}
        <div className="flex items-center gap-2">
          <span className="text-[#6B7280] font-medium">Theme:</span>
          <div className="inline-flex items-center bg-[#E5E7EB]/70 p-0.5 rounded-full text-[11px] font-medium">
            <button
              type="button"
              onClick={() => setTheme("light")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "light"
                  ? "bg-white text-[#111827] shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Sun className="w-3 h-3 text-[#F59E0B]" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("dark")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "dark"
                  ? "bg-[#1F2937] text-white shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Moon className="w-3 h-3 text-[#60A5FA]" />
              <span>Dark</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme("auto")}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                theme === "auto"
                  ? "bg-white text-[#111827] shadow-xs font-semibold"
                  : "text-[#6B7280] hover:text-[#111827]"
              }`}
            >
              <Circle className="w-2.5 h-2.5 text-[#9CA3AF]" />
              <span>Auto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
