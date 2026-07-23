"use client";

import React from "react";
import { Info } from "lucide-react";

export interface SidebarAISummaryProps {
  generatedDate?: string;
  readTime?: string;
  bullets?: string[];
}

export const SidebarAISummary: React.FC<SidebarAISummaryProps> = ({
  generatedDate = "May 31, 2026",
  readTime = "3 min read",
  bullets = [
    "The Union Cabinet has approved a ₹2.4 lakh crore scheme to boost farmers' income across India.",
    "The scheme includes direct income support, assured prices, low-interest loans and investment in storage infrastructure.",
    "It aims to double farmers' income by 2030, with a focus on sustainable and natural farming.",
    "Farmer unions welcome the move but demand legal guarantee on MSP for all crops.",
    "Economists expect a positive impact on rural demand and allied sectors.",
  ],
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
        Generated {generatedDate} • {readTime}
      </div>

      {/* Bullet Points */}
      <ul className="flex flex-col gap-3 text-[13px] text-[#1F2937] leading-relaxed pl-1">
        {bullets.map((bullet, idx) => (
          <li key={idx} className="flex items-start gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0D0D0F] mt-2 shrink-0" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>

      {/* AI Disclaimer */}
      <div className="text-[11px] text-[#9CA3AF] italic pt-1">
        AI summaries can make mistakes.
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
