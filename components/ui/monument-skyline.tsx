import React from "react";

export interface MonumentSkylineProps {
  dark?: boolean;
  className?: string;
}

export const MonumentSkyline: React.FC<MonumentSkylineProps> = ({
  dark = false,
  className = "",
}) => {
  const strokeColor = dark ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)";
  const fillColor = dark ? "rgba(255, 255, 255, 0.04)" : "rgba(0, 0, 0, 0.03)";

  return (
    <svg
      viewBox="0 0 1200 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto pointer-events-none select-none ${className}`}
    >
      {/* Ashoka Chakra Motif Watermark (Left) */}
      <g stroke={strokeColor} strokeWidth="1.2" fill="none" opacity="0.6">
        <circle cx="90" cy="120" r="55" />
        <circle cx="90" cy="120" r="10" />
        <circle cx="90" cy="120" r="50" strokeDasharray="3 3" />
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i * 360) / 24;
          const rad = (angle * Math.PI) / 180;
          const x2 = 90 + 55 * Math.cos(rad);
          const y2 = 120 + 55 * Math.sin(rad);
          return <line key={i} x1="90" y1="120" x2={x2} y2={y2} />;
        })}
      </g>

      {/* Monument Skyline Silhouettes */}
      {/* Taj Mahal / Domes (Left side) */}
      <g stroke={strokeColor} strokeWidth="1.5" fill={fillColor}>
        {/* Left Minaret */}
        <rect x="220" y="70" width="10" height="150" rx="2" />
        <path d="M217 70 L225 50 L233 70 Z" />

        {/* Small Domes */}
        <path d="M250 140 C250 120 270 120 270 140 Z" />
        <path d="M370 140 C370 120 390 120 390 140 Z" />

        {/* Main Central Dome */}
        <path d="M280 120 C280 50 360 50 360 120 Z" />
        <line x1="320" y1="50" x2="320" y2="30" />
        <circle cx="320" cy="27" r="3" />

        {/* Main Arch Base */}
        <path d="M260 220 V130 Q260 110 320 110 Q380 110 380 130 V220 Z" />
        <path d="M295 220 V160 Q295 145 320 145 Q345 145 345 160 V220 Z" />

        {/* Right Minaret */}
        <rect x="410" y="70" width="10" height="150" rx="2" />
        <path d="M407 70 L415 50 L423 70 Z" />
      </g>

      {/* Temple / Fort Spires (Center-Right) */}
      <g stroke={strokeColor} strokeWidth="1.5" fill={fillColor}>
        <path d="M720 220 V120 L740 80 L760 120 V220 Z" />
        <path d="M780 220 V100 L810 50 L840 100 V220 Z" />
        <path d="M860 220 V130 L875 100 L890 130 V220 Z" />
      </g>

      {/* India Gate / Triumphal Arch (Far Right) */}
      <g stroke={strokeColor} strokeWidth="1.8" fill={fillColor}>
        {/* Outer Frame */}
        <path d="M960 220 V80 H1120 V220 Z" />
        <path d="M950 80 H1130 V65 H950 Z" />
        <path d="M970 65 L990 45 H1090 L1110 65 Z" />

        {/* Inner Grand Arch */}
        <path d="M1000 220 V140 Q1000 100 1040 100 Q1080 100 1080 140 V220 Z" />

        {/* Top Arch Inscription Band */}
        <rect x="980" y="90" width="120" height="20" rx="1" />
      </g>

      {/* Ground Horizon Line */}
      <line
        x1="0"
        y1="220"
        x2="1200"
        y2="220"
        stroke={strokeColor}
        strokeWidth="1.5"
      />
    </svg>
  );
};
