"use client";

import React from "react";
import { Info } from "lucide-react";

export interface SidebarSourceBreakdownProps {
  sourceName: string;
  biasLabel: string;
  leftPercent: number;
  centerPercent: number;
  rightPercent: number;
  framingNotes: string[];
  loadedTerms: Array<{ term: string; explanation: string; biasTarget?: string }>;
}

export const SidebarSourceBreakdown: React.FC<
  SidebarSourceBreakdownProps
> = ({
  sourceName,
  biasLabel,
  leftPercent,
  centerPercent,
  rightPercent,
  framingNotes,
  loadedTerms,
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

      {/* Top Source Info */}
      <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-3">
        <span className="text-[15px] font-bold text-[#0D0D0F]">
          {sourceName}
        </span>
        <span className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F3F4F6] text-[#374151]">
          {biasLabel}
        </span>
      </div>

      {/* Distribution Bars */}
      <div className="flex flex-col gap-2 pb-3 border-b border-[#F3F4F6]">
        {/* Left */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Left</span>
          <span className="w-12 font-semibold text-[#B42318]">{leftPercent}%</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${leftPercent}%` }}
              className="h-full bg-[#B42318] rounded-full"
            />
          </div>
        </div>

        {/* Center */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Center</span>
          <span className="w-12 font-semibold text-[#4B5563]">{centerPercent}%</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${centerPercent}%` }}
              className="h-full bg-[#D1D5DB] rounded-full"
            />
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3 text-[12px]">
          <span className="w-12 text-[#374151] font-medium">Right</span>
          <span className="w-12 font-semibold text-[#003B95]">{rightPercent}%</span>
          <div className="flex-1 h-2 bg-[#F3F4F6] rounded-full overflow-hidden">
            <div
              style={{ width: `${rightPercent}%` }}
              className="h-full bg-[#003B95] rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Framing Notes */}
      {framingNotes && framingNotes.length > 0 && (
        <div className="flex flex-col gap-2 pt-1">
          <h4 className="text-[13px] font-bold text-[#0D0D0F]">
            Framing Notes
          </h4>
          <ul className="flex flex-col gap-2 text-[12px] text-[#374151] pl-1">
            {framingNotes.map((note, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6B7280] mt-1.5 shrink-0" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Loaded Terms */}
      {loadedTerms && loadedTerms.length > 0 && (
        <div className="flex flex-col gap-2 pt-2 border-t border-[#F3F4F6]">
          <h4 className="text-[13px] font-bold text-[#0D0D0F]">
            Loaded Terms
          </h4>
          <div className="flex flex-col gap-2">
            {loadedTerms.map((item, idx) => (
              <div
                key={idx}
                className="text-[12px] bg-[#F9FAFB] p-2.5 rounded-lg border border-[#E5E7EB]"
              >
                <div className="font-semibold text-[#0D0D0F] flex items-center justify-between">
                  <span>{item.term}</span>
                  {item.biasTarget && (
                    <span className="text-[10px] font-normal text-[#6B7280] bg-[#E5E7EB] px-1.5 py-0.5 rounded">
                      {item.biasTarget}
                    </span>
                  )}
                </div>
                <div className="text-[#4B5563] mt-0.5">{item.explanation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
