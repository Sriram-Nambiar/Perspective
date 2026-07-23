"use client";

import React from "react";
import Link from "next/link";
import { Info } from "lucide-react";

export interface ArticleData {
  id: string;
  title: string;
  sourceName: string;
  imageUrl: string;
  publishedDate: string;
  sentimentLabel: string;
  biasLabel: string;
  leftPercent: number;
  centerPercent: number;
  rightPercent: number;
  confidence: number;
}

interface HomeCardProps {
  article: ArticleData;
}

export const HomeCard: React.FC<HomeCardProps> = ({ article }) => {
  const {
    id,
    title,
    sourceName,
    imageUrl,
    publishedDate,
    sentimentLabel,
    biasLabel,
    leftPercent,
    centerPercent,
    rightPercent,
    confidence,
  } = article;

  const getSentimentBadgeClass = (sentiment: string) => {
    const s = (sentiment || "").toLowerCase();
    if (s.includes("pos")) return "bg-green-100 text-green-800";
    if (s.includes("neg")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const formattedSentiment = sentimentLabel
    ? sentimentLabel.charAt(0).toUpperCase() + sentimentLabel.slice(1)
    : "";

  const formattedBiasLabel = biasLabel
    ? biasLabel.charAt(0).toUpperCase() + biasLabel.slice(1)
    : "";

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const confidencePercent = Math.round(
    confidence <= 1 ? confidence * 100 : confidence
  );

  return (
    <article className="bg-white border border-[#E5E7EB] rounded-[12px] overflow-hidden shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between">
      <div>
        {/* Image Container with Info Icon */}
        <Link href={`/article/${id}`} className="block relative w-full h-[200px] sm:h-[210px] bg-[#F3F4F6] overflow-hidden group">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
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
            onClick={(e) => e.preventDefault()}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-xs text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>
        </Link>

        {/* Content Details */}
        <div className="p-4 flex flex-col gap-2">
          {/* Source & Sentiment Badge */}
          <div className="flex items-center justify-between text-[12px] font-medium text-[#6B7280]">
            <span>{sourceName}</span>
            {sentimentLabel && (
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${getSentimentBadgeClass(
                  sentimentLabel
                )}`}
              >
                {formattedSentiment}
              </span>
            )}
          </div>

          {/* Title */}
          <Link href={`/article/${id}`}>
            <h2 className="text-[16px] sm:text-[17px] font-bold text-[#0D0D0F] leading-[1.3] line-clamp-2 hover:text-[#1D4ED8] transition-colors cursor-pointer">
              {title}
            </h2>
          </Link>

          {/* Published Date */}
          {publishedDate && (
            <div className="text-[12px] text-[#6B7280]">
              {formatDate(publishedDate)}
            </div>
          )}
        </div>
      </div>

      {/* Footer Area: Bias Meter & Source Count */}
      <div className="p-4 pt-0 flex flex-col gap-3">
        {/* Bias Distribution Bar */}
        <div className="w-full h-7 rounded-[4px] overflow-hidden flex text-[11px] font-medium text-white select-none">
          {/* Left Segment */}
          {leftPercent > 0 && (
            <div
              style={{ width: `${leftPercent}%` }}
              className="bg-[#B42318] h-full flex items-center justify-center px-1 font-semibold truncate transition-all duration-300"
            >
              Left {Math.round(leftPercent)}%
            </div>
          )}

          {/* Center Segment */}
          {centerPercent > 0 && (
            <div
              style={{ width: `${centerPercent}%` }}
              className="bg-[#F3F4F6] text-[#374151] h-full flex items-center justify-center px-1 font-semibold truncate border-x border-white/50 transition-all duration-300"
            >
              Center {Math.round(centerPercent)}%
            </div>
          )}

          {/* Right Segment */}
          {rightPercent > 0 && (
            <div
              style={{ width: `${rightPercent}%` }}
              className="bg-[#1D4ED8] h-full flex items-center justify-center px-1 font-semibold truncate transition-all duration-300"
            >
              Right {Math.round(rightPercent)}%
            </div>
          )}
        </div>

        {/* AI Bias & Confidence */}
        <div className="flex items-center justify-between text-[12px] font-bold text-[#4B5563]">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-bold rounded uppercase">
              AI
            </span>
            <span>estimated: {formattedBiasLabel}</span>
          </div>
          <div>Confidence: {confidencePercent}%</div>
        </div>
      </div>
    </article>
  );
};
