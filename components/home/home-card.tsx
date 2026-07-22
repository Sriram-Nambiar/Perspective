"use client";

import React from "react";
import { Info } from "lucide-react";

export interface ArticleData {
  id: string;
  title: string;
  category: string;
  sourceCategory: string;
  imageUrl: string;
  leftBias: number;
  centerBias: number;
  rightBias: number;
  sourcesCount: number;
}

interface HomeCardProps {
  article: ArticleData;
}

export const HomeCard: React.FC<HomeCardProps> = ({ article }) => {
  const {
    title,
    category,
    sourceCategory,
    imageUrl,
    leftBias,
    centerBias,
    rightBias,
    sourcesCount,
  } = article;

  const total = leftBias + centerBias + rightBias;
  const leftPct = total > 0 ? (leftBias / total) * 100 : 0;
  const centerPct = total > 0 ? (centerBias / total) * 100 : 0;
  const rightPct = total > 0 ? (rightBias / total) * 100 : 0;

  return (
    <article className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container with Info Icon */}
        <div className="relative w-full h-[200px] sm:h-[210px] bg-[#F3F4F6] overflow-hidden">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-sm">
              No Image
            </div>
          )}

          {/* Info Icon Overlay */}
          <button
            type="button"
            aria-label="Article perspective details"
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Content Details */}
        <div className="p-4 flex flex-col gap-2">
          {/* Category Tag Breadcrumb */}
          <div className="text-[12px] font-medium text-[#6B7280]">
            <span>{category}</span>
            <span className="mx-1.5">•</span>
            <span>{sourceCategory}</span>
          </div>

          {/* Title */}
          <h2 className="text-[16px] sm:text-[17px] font-bold text-[#0D0D0F] leading-[1.3] line-clamp-2 hover:text-[#1D4ED8] transition-colors cursor-pointer">
            {title}
          </h2>
        </div>
      </div>

      {/* Footer Area: Bias Meter & Source Count */}
      <div className="p-4 pt-0 flex flex-col gap-3">
        {/* Bias Distribution Bar */}
        <div className="w-full h-7 rounded-[4px] overflow-hidden flex text-[11px] font-medium text-white select-none">
          {/* Left Segment */}
          {leftPct > 0 && (
            <div
              style={{ width: `${leftPct}%` }}
              className="bg-[#B42318] h-full flex items-center justify-center px-1 font-semibold truncate transition-all duration-300"
            >
              Left {Math.round(leftBias)}%
            </div>
          )}

          {/* Center Segment */}
          {centerPct > 0 && (
            <div
              style={{ width: `${centerPct}%` }}
              className="bg-[#F3F4F6] text-[#374151] h-full flex items-center justify-center px-1 font-semibold truncate border-x border-white/50 transition-all duration-300"
            >
              Center {Math.round(centerBias)}%
            </div>
          )}

          {/* Right Segment */}
          {rightPct > 0 && (
            <div
              style={{ width: `${rightPct}%` }}
              className="bg-[#1D4ED8] h-full flex items-center justify-center px-1 font-semibold truncate transition-all duration-300"
            >
              Right {Math.round(rightBias)}%
            </div>
          )}
        </div>

        {/* Sources Count */}
        <div className="text-[12px] font-bold text-[#4B5563]">
          {sourcesCount} sources
        </div>
      </div>
    </article>
  );
};
