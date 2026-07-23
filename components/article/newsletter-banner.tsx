"use client";

import React, { useState } from "react";
import { MonumentSkyline } from "@/components/ui/monument-skyline";

export const NewsletterBanner: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="w-full bg-[#F3F4F6] border border-[#E5E7EB] rounded-2xl p-6 md:p-8 my-10 overflow-hidden relative shadow-sm">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Left Side: Skyline Graphic + Text */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
          {/* Skyline Watermark Box */}
          <div className="w-24 md:w-32 h-16 shrink-0 opacity-80 flex items-center justify-center">
            <MonumentSkyline dark={false} className="w-full h-full" />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-[20px] md:text-[22px] font-extrabold text-[#0D0D0F] tracking-tight">
              Stay Informed. Stay Balanced.
            </h3>
            <p className="text-[13px] text-[#6B7280]">
              Get the top stories and bias analysis delivered to your inbox.
            </p>
          </div>
        </div>

        {/* Right Side: Form Input & Button */}
        <form
          onSubmit={handleSubmit}
          className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3 shrink-0"
        >
          {subscribed ? (
            <div className="text-[14px] font-semibold text-[#059669] bg-[#ECFDF5] px-4 py-2.5 rounded-lg border border-[#A7F3D0]">
              ✓ Thank you for subscribing!
            </div>
          ) : (
            <>
              <input
                type="email"
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full sm:w-[280px] md:w-[320px] px-4 py-2.5 bg-white border border-[#D1D5DB] rounded-lg text-[13px] text-[#0D0D0F] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D0D0F]"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-[#0D0D0F] hover:bg-[#27272A] text-white text-[13px] font-bold rounded-lg transition-colors shadow-sm cursor-pointer shrink-0"
              >
                Subscribe
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
