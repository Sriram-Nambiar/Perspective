"use client";

import React from "react";
import { Info } from "lucide-react";

export interface SidebarAISummaryProps {
  summary: string;
  disclaimer: string;
  generatedDate: string;
}

export const SidebarAISummary: React.FC<SidebarAISummaryProps> = ({
  summary,
  disclaimer,
  generatedDate,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#0D0D0F] tracking-tight">
          AI Summary
        </h3>
        <button
          type="button"
          aria-label="AI Summary info"
          className="text-[#6B7280] hover:text-[#0D0D0F] transition-colors"
        >
          <Info className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Subtitle */}
      <div className="text-[12px] text-[#6B7280]">
        Generated {generatedDate}
      </div>

      {/* Summary Paragraph */}
      <p className="text-[13px] text-[#1F2937] leading-relaxed">
        {summary}
      </p>

      {/* AI Disclaimer */}
      <div className="text-[11px] text-[#9CA3AF] italic pt-1">
        {disclaimer}
      </div>

      {/* Provide Feedback Button */}
      <button
        type="button"
        className="w-full py-2 px-4 border border-[#D1D5DB] rounded-md text-[13px] font-semibold text-[#0D0D0F] hover:bg-[#F9FAFB] transition-colors"
      >
        Provide Feedback
      </button>
    </div>
  );
};
