"use client";

import React from "react";
import { Info } from "lucide-react";

export interface InlineBiasBoxProps {
  leftPercent?: number;
  centerPercent?: number;
  rightPercent?: number;
  sourcesCount?: number;
}

export const InlineBiasBox: React.FC<InlineBiasBoxProps> = ({
  leftPercent = 18,
  centerPercent = 42,
  rightPercent = 40,
  sourcesCount = 7,
}) => {
  return (
    <div className="w-full bg-white border border-[#E5E7EB] rounded-lg p-4 my-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-3 text-[14px] font-bold text-[#0D0D0F]">
        <span>Bias Distribution</span>
        <button
          type="button"
          aria-label="Bias Distribution info"
          className="text-[#6B7280] hover:text-[#0D0D0F] transition-colors"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>

      {/* Tri-color horizontal bar */}
      <div className="w-full h-8 rounded bg-[#F3F4F6] overflow-hidden flex items-center text-[11px] md:text-[12px] font-semibold text-white">
        {/* Left Segment */}
        <div
          style={{ width: `${leftPercent}%` }}
          className="h-full bg-[#B42318] flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <span>Left {leftPercent}%</span>
        </div>

        {/* Center Segment */}
        <div
          style={{ width: `${centerPercent}%` }}
          className="h-full bg-[#E5E7EB] text-[#374151] flex items-center justify-center transition-all duration-300 shrink-0 border-x border-white/20"
        >
          <span>Center {centerPercent}%</span>
        </div>

        {/* Right Segment */}
        <div
          style={{ width: `${rightPercent}%` }}
          className="h-full bg-[#003B95] flex items-center justify-center transition-all duration-300 shrink-0"
        >
          <span>Right {rightPercent}%</span>
        </div>
      </div>

      {/* Sources Count */}
      <div className="mt-2.5 text-[12px] text-[#6B7280] font-medium">
        {sourcesCount} sources
      </div>
    </div>
  );
};
