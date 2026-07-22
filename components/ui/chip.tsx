import React from "react";
import { Plus } from "lucide-react";

export interface ChipProps {
  label: string;
  active?: boolean;
  showAddIcon?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  active = false,
  showAddIcon = true,
  onClick,
  className = "",
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-150 border ${
        active
          ? "bg-[#0D0D0F] text-white border-[#0D0D0F]"
          : "bg-[#F6F6F6] text-[#0D0D0F] border-[#E5E7EB] hover:bg-[#E5E7EB] hover:border-[#D1D5DB]"
      } ${className}`}
    >
      <span>{label}</span>
      {showAddIcon && <Plus className="w-3.5 h-3.5 opacity-70" />}
    </button>
  );
};
