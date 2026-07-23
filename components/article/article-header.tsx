"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Share2, MoreHorizontal, ChevronRight, Check } from "lucide-react";

export interface ArticleHeaderProps {
  breadcrumbs?: string[];
  title?: string;
  author?: string;
  date?: string;
  readTime?: string;
  imageUrl?: string;
  imageCaption?: string;
  photoCredit?: string;
}

export const ArticleHeader: React.FC<ArticleHeaderProps> = ({
  breadcrumbs = ["Home", "India", "Agriculture"],
  title = "Centre Approves ₹2.4 Lakh Crore Scheme to Boost Farmer Income",
  author = "Ananya Sharma",
  date = "May 31, 2026",
  readTime = "10 min read",
  imageUrl = "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
  imageCaption = "A farmer inspects his crop at a field in Punjab. The new scheme aims to double farmers' income by 2030.",
  photoCredit = "Photo: PTI",
}) => {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-[12px] text-[#6B7280]">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF]" />}
            <Link
              href={idx === 0 ? "/" : `#${crumb.toLowerCase()}`}
              className="hover:text-[#0D0D0F] transition-colors"
            >
              {crumb}
            </Link>
          </React.Fragment>
        ))}
      </nav>

      {/* Main Headline Title */}
      <h1 className="text-[24px] sm:text-[28px] md:text-[34px] font-bold text-[#0D0D0F] leading-tight tracking-tight">
        {title}
      </h1>

      {/* Author, Date & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] text-[#6B7280] pb-4 border-b border-[#E5E7EB]">
        {/* Author Line */}
        <div className="flex items-center gap-2">
          <span>By <strong className="text-[#0D0D0F] font-semibold">{author}</strong></span>
          <span>|</span>
          <span>{date}</span>
          <span>|</span>
          <span>{readTime}</span>
        </div>

        {/* Action Buttons: Save, Share, More */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSaved(!saved)}
            className="flex items-center gap-1.5 hover:text-[#0D0D0F] transition-colors"
          >
            <span>Save</span>
            <Bookmark
              className={`w-4 h-4 ${
                saved ? "fill-[#0D0D0F] text-[#0D0D0F]" : "text-[#6B7280]"
              }`}
            />
          </button>

          <span className="text-[#D1D5DB]">|</span>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 hover:text-[#0D0D0F] transition-colors relative"
          >
            <span>{copied ? "Copied!" : "Share"}</span>
            {copied ? (
              <Check className="w-4 h-4 text-[#059669]" />
            ) : (
              <Share2 className="w-4 h-4 text-[#6B7280]" />
            )}
          </button>

          <button
            type="button"
            aria-label="More options"
            className="p-1 hover:text-[#0D0D0F] transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-[#6B7280]" />
          </button>
        </div>
      </div>

      {/* Featured Hero Image Container */}
      <div className="my-2">
        <div className="w-full aspect-[16/9] md:aspect-[21/10] relative rounded-xl overflow-hidden bg-[#E5E7EB] shadow-sm">
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Caption & Photo Credit */}
        <div className="mt-2 text-[12px] text-[#6B7280] leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>{imageCaption}</span>
          <span className="font-semibold text-[#374151] shrink-0">{photoCredit}</span>
        </div>
      </div>
    </div>
  );
};
