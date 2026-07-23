"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

interface MainNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const MainNav: React.FC<MainNavProps> = ({
  activeTab = "Home",
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(activeTab);

  const navItems = [
    { name: "Home", badge: false },
    { name: "For You", badge: true },
    { name: "India", badge: false },
    { name: "States", badge: false },
    { name: "Business", badge: false },
    { name: "Technology", badge: false },
    { name: "Sports", badge: false },
    { name: "Entertainment", badge: false },
  ];

  const handleTabClick = (name: string) => {
    setCurrentTab(name);
    if (onSelectTab) onSelectTab(name);
  };

  return (
    <header className="w-full bg-white border-b border-[#E5E7EB] sticky top-0 z-40">
      <div className="max-w-[1280px] mx-auto px-3 sm:px-4 md:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: Mobile Menu Icon & Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-4 min-w-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 sm:p-1.5 rounded-lg text-[#111827] hover:bg-[#F3F4F6] transition-colors cursor-pointer shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          {/* Logo Brand */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 cursor-pointer min-w-0">
            {/* Geometric Triangle Emblem */}
            <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:w-8 sm:h-8"
              >
                <path
                  d="M6 6L30 18L6 30V6Z"
                  fill="#0D0D0F"
                />
                <path
                  d="M12 11.5L24 18L12 24.5V11.5Z"
                  fill="#FFFFFF"
                />
                <path
                  d="M15 14L20 18L15 22V14Z"
                  fill="#0D0D0F"
                />
              </svg>
            </div>

            <div className="flex flex-col truncate">
              <span className="text-[15px] sm:text-[20px] md:text-[22px] font-black tracking-tight text-[#0D0D0F] leading-none uppercase font-sans truncate">
                PERSPECTIVE
              </span>
              <span className="hidden sm:block text-[9px] md:text-[10px] text-[#6B7280] font-medium leading-tight tracking-tight mt-0.5">
                Balanced news. Clearer perspective.
              </span>
            </div>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.name;
            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleTabClick(item.name)}
                className={`relative px-3 py-1.5 text-[13px] font-semibold transition-colors cursor-pointer rounded-md ${
                  isActive
                    ? "text-[#0D0D0F] font-bold"
                    : "text-[#4B5563] hover:text-[#0D0D0F] hover:bg-[#F9FAFB]"
                }`}
              >
                <span className="relative">
                  {item.name}
                  {item.badge && (
                    <span className="absolute -top-1 -right-2 w-2 h-2 bg-[#EF4444] rounded-full" />
                  )}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#0D0D0F] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            type="button"
            className="bg-[#0D0D0F] hover:bg-[#27272A] text-white text-[12px] sm:text-[13px] font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-[6px] transition-colors cursor-pointer shadow-xs whitespace-nowrap"
          >
            Subscribe
          </button>
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button
                type="button"
                className="bg-[#FFFFFF] hover:bg-[#F9FAFB] text-[#0D0D0F] border border-[#D1D5DB] text-[12px] sm:text-[13px] font-medium px-3 sm:px-5 py-1.5 sm:py-2 rounded-[6px] transition-colors cursor-pointer whitespace-nowrap"
              >
                Login
              </button>
            </SignInButton>
          </Show>
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E5E7EB] bg-white px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.name}
              type="button"
              onClick={() => {
                handleTabClick(item.name);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md flex items-center justify-between ${
                currentTab === item.name
                  ? "bg-[#F3F4F6] text-[#0D0D0F] font-bold"
                  : "text-[#4B5563] hover:bg-[#F9FAFB]"
              }`}
            >
              <span>{item.name}</span>
              {item.badge && (
                <span className="w-2 h-2 bg-[#EF4444] rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
