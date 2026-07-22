import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "text";
  outline?: boolean;
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  outline = false,
  size = "md",
  disabled = false,
  className = "",
  children,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium transition-all duration-150 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-black disabled:cursor-not-allowed";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-[13px] h-8",
    md: "px-4 py-2 text-[14px] h-10",
    lg: "px-6 py-2.5 text-[16px] h-12",
  };

  let variantStyles = "";

  if (variant === "primary") {
    if (disabled) {
      variantStyles = "bg-[#E5E7EB] text-[#9CA3AF] border border-transparent";
    } else if (outline) {
      variantStyles =
        "bg-transparent border border-[#0D0D0F] text-[#0D0D0F] hover:bg-[#0D0D0F] hover:text-white";
    } else {
      variantStyles =
        "bg-[#0D0D0F] text-white border border-transparent hover:bg-[#26262A] active:bg-[#000000]";
    }
  } else if (variant === "secondary") {
    if (disabled) {
      variantStyles = "bg-[#F3F4F6] text-[#D1D5DB] border border-transparent";
    } else if (outline) {
      variantStyles =
        "bg-transparent border border-[#E5E7EB] text-[#0D0D0F] hover:bg-[#F6F6F6]";
    } else {
      variantStyles =
        "bg-[#F6F6F6] text-[#0D0D0F] border border-transparent hover:bg-[#E5E7EB] active:bg-[#D1D5DB]";
    }
  } else if (variant === "text") {
    if (disabled) {
      variantStyles = "bg-transparent text-[#D1D5DB]";
    } else {
      variantStyles =
        "bg-transparent text-[#0D0D0F] hover:text-[#1D4ED8] underline-offset-4 hover:underline";
    }
  }

  return (
    <button
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
