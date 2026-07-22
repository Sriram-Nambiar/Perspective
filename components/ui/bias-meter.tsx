import React from "react";

export interface BiasMeterProps {
  left: number;
  center: number;
  right: number;
  showLabels?: boolean;
  showTicks?: boolean;
  className?: string;
}

export const BiasMeter: React.FC<BiasMeterProps> = ({
  left,
  center,
  right,
  showLabels = true,
  showTicks = true,
  className = "",
}) => {
  // Ensure sum equals 100 or scale accordingly
  const total = left + center + right;
  const leftPct = total > 0 ? (left / total) * 100 : 0;
  const centerPct = total > 0 ? (center / total) * 100 : 0;
  const rightPct = total > 0 ? (right / total) * 100 : 0;

  return (
    <div className={`w-full flex flex-col gap-1 ${className}`}>
      {/* Bar container */}
      <div className="w-full h-7 rounded-[4px] overflow-hidden flex font-medium text-[11px] leading-none text-white">
        {/* Left Segment */}
        {leftPct > 0 && (
          <div
            style={{ width: `${leftPct}%` }}
            className="bg-[#B42318] h-full flex items-center justify-center transition-all duration-300"
          >
            {showLabels && leftPct >= 10 && <span>Left {Math.round(left)}%</span>}
          </div>
        )}

        {/* Center Segment */}
        {centerPct > 0 && (
          <div
            style={{ width: `${centerPct}%` }}
            className="bg-[#E5E7EB] text-[#374151] h-full flex items-center justify-center transition-all duration-300"
          >
            {showLabels && centerPct >= 10 && (
              <span>Center {Math.round(center)}%</span>
            )}
          </div>
        )}

        {/* Right Segment */}
        {rightPct > 0 && (
          <div
            style={{ width: `${rightPct}%` }}
            className="bg-[#1D4ED8] h-full flex items-center justify-center transition-all duration-300"
          >
            {showLabels && rightPct >= 10 && (
              <span>Right {Math.round(right)}%</span>
            )}
          </div>
        )}
      </div>

      {/* Tick Marks & Scale */}
      {showTicks && (
        <div className="flex justify-between items-center text-[10px] text-[#6B7280] px-0.5">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      )}
    </div>
  );
};
