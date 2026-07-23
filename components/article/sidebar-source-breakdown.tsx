"use client";

import React from "react";
import { Info } from "lucide-react";

export interface SourceItem {
  name: string;
  bias: "Left" | "Center" | "Right";
}

export interface SidebarSourceBreakdownProps {
  totalSources?: number;
  sources?: SourceItem[];
}

export const SidebarSourceBreakdown: React.FC<
  SidebarSourceBreakdownProps
> = ({
  totalSources = 7,
  sources = [
    { name: "The Hindu", bias: "Right" },
    { name: "Times of India", bias: "Center" },
    { name: "Business Standard", bias: "Center" },
    { name: "NDTV", bias: "Right" },
    { name: "Hindustan Times", bias: "Center" },
    { name: "The Indian Express", bias: "Left" },
    { name: "News18", bias: "Center" },
  ],
}) => {
  return (
    <div
      id="sources"
      className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-bold text-[#0D0D0F] tracking-tight">
          Source Breakdown
        </h3>
        <button
          type="button"
          aria-label="Source Breakdown info"
          className="text-[#6B7280] hover:text-[#0D0D0F] transition-colors"
        >
          <Info className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Total Sources Count */}
      <div className="text-[12px] font-medium text-[#6B7280]">
        {totalSources} Total Sources
      </div>

      {/* Distribution Counts */}
      <div className="flex flex-col gap-2 pb-2 border-b border-[#F3F4F6]">
        {/* Left */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Left</span>
          <span className="w-16 font-semibold text-[#B42318]">1 (18%)</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div className="w-[18%] h-full bg-[#B42318] rounded-full" />
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Center</span>
          <span className="w-16 font-semibold text-[#4B5563]">3 (42%)</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div className="w-[42%] h-full bg-[#D1D5DB] rounded-full" />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Right</span>
          <span className="w-16 font-semibold text-[#003B95]">3 (40%)</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div className="w-[40%] h-full bg-[#003B95] rounded-full" />
          </div>
        </div>
      </div>

      {/* Top Sources Table */}
      <div className="flex flex-col gap-2.5 pt-1">
        <div className="flex items-center justify-between text-[12px] font-bold text-[#6B7280] pb-1 border-b border-[#F3F4F6]">
          <span>Top Sources</span>
          <span>Bias</span>
        </div>

        {sources.map((source, index) => {
          let colorClass = "text-[#4B5563]";
          if (source.bias === "Right") colorClass = "text-[#003B95]";
          if (source.bias === "Left") colorClass = "text-[#B42318]";

          return (
            <div
              key={index}
              className="flex items-center justify-between text-[13px] py-0.5"
            >
              <span className="font-medium text-[#1F2937]">
                {source.name}
              </span>
              <span className={`font-bold ${colorClass}`}>
                {source.bias}
              </span>
            </div>
          );
        })}
      </div>

      {/* View All Sources Button */}
      <button
        type="button"
        className="w-full py-2 px-4 border border-[#D1D5DB] rounded-md text-[13px] font-semibold text-[#0D0D0F] hover:bg-[#F9FAFB] transition-colors mt-1"
      >
        View All Sources
      </button>
    </div>
  );
};
