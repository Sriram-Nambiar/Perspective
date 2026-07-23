"use client";

import React from "react";
import { Info } from "lucide-react";

export interface SidebarBiasAnalysisProps {
  overallLabel?: string;
  overallPercent?: number;
  sourcesCount?: number;
  leftPercent?: number;
  centerPercent?: number;
  rightPercent?: number;
}

export const SidebarBiasAnalysis: React.FC<SidebarBiasAnalysisProps> = ({
  overallLabel = "Right",
  overallPercent = 40,
  sourcesCount = 7,
  leftPercent = 18,
  centerPercent = 42,
  rightPercent = 40,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col gap-4">
      {/* Card Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#0D0D0F] tracking-tight flex items-center gap-1.5">
          <span>Bias Analysis</span>
        </h3>
        <button
          type="button"
          aria-label="Bias Analysis info"
          className="text-[#6B7280] hover:text-[#0D0D0F] transition-colors"
        >
          <Info className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Overall Bias Metric */}
      <div>
        <div className="text-[12px] font-medium text-[#6B7280]">
          Overall Bias
        </div>
        <div className="text-[26px] md:text-[28px] font-extrabold text-[#003B95] tracking-tight leading-snug">
          {overallLabel} {overallPercent}%
        </div>
        <a
          href="#sources"
          className="text-[12px] font-medium text-[#003B95] underline underline-offset-2 hover:text-[#002566] transition-colors"
        >
          Based on {sourcesCount} balanced sources
        </a>
      </div>

      {/* Detailed Bars */}
      <div className="flex flex-col gap-3 pt-1">
        {/* Left Row */}
        <div className="flex items-center gap-3 text-[13px] font-medium">
          <span className="w-14 text-[#374151]">Left</span>
          <span className="w-10 text-right font-bold text-[#B42318] text-[12px]">
            {leftPercent}%
          </span>
          <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${leftPercent}%` }}
              className="h-full bg-[#B42318] rounded-full"
            />
          </div>
        </div>

        {/* Center Row */}
        <div className="flex items-center gap-3 text-[13px] font-medium">
          <span className="w-14 text-[#374151]">Center</span>
          <span className="w-10 text-right font-semibold text-[#4B5563] text-[12px]">
            {centerPercent}%
          </span>
          <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${centerPercent}%` }}
              className="h-full bg-[#D1D5DB] rounded-full"
            />
          </div>
        </div>

        {/* Right Row */}
        <div className="flex items-center gap-3 text-[13px] font-medium">
          <span className="w-14 text-[#374151]">Right</span>
          <span className="w-10 text-right font-bold text-[#003B95] text-[12px]">
            {rightPercent}%
          </span>
          <div className="flex-1 h-2.5 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${rightPercent}%` }}
              className="h-full bg-[#003B95] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Explanatory Paragraph */}
      <p className="text-[12px] text-[#6B7280] leading-relaxed pt-1">
        Our analysis is based on the political leaning of the publication and
        how the story is framed. Sources are weighted by reliability and
        recency.
      </p>

      {/* How We Analyze Bias Button */}
      <button
        type="button"
        className="w-full py-2 px-4 border border-[#D1D5DB] rounded-md text-[13px] font-semibold text-[#0D0D0F] hover:bg-[#F9FAFB] transition-colors mt-1"
      >
        How We Analyze Bias
      </button>
    </div>
  );
};
