"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const TopicPillsBar: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedPill, setSelectedPill] = useState<string | null>(null);

  const topics = [
    "India",
    "Politics",
    "Business",
    "Markets",
    "Bollywood",
    "Cricket",
    "Health",
    "Education",
    "Science",
    "Startups",
    "More",
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -240 : 240;
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB] border-b border-[#E5E7EB] py-2.5 sm:py-3 px-2 sm:px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto flex items-center gap-1.5 sm:gap-2 min-w-0">
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          aria-label="Scroll topics left"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>

        {/* Scrollable Pills Track */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 flex-1 min-w-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {topics.map((topic) => {
            const isSelected = selectedPill === topic;
            return (
              <button
                key={topic}
                type="button"
                onClick={() => setSelectedPill(isSelected ? null : topic)}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[6px] text-[12px] sm:text-[13px] font-semibold transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  isSelected
                    ? "bg-[#0D0D0F] text-white shadow-xs"
                    : "bg-[#E5E7EB]/80 text-[#374151] hover:bg-[#D1D5DB] hover:text-[#111827]"
                }`}
              >
                <span>{topic}</span>
                <span className="text-[13px] sm:text-[14px] font-medium leading-none">+</span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          aria-label="Scroll topics right"
          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-[#E5E7EB] bg-white flex items-center justify-center text-[#4B5563] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors shrink-0 cursor-pointer shadow-2xs"
        >
          <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
