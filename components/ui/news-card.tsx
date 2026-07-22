import React from "react";
import { Clock, Bookmark, Info } from "lucide-react";
import { BiasMeter } from "./bias-meter";

export interface NewsCardProps {
  category?: string;
  source?: string;
  title: string;
  excerpt: string;
  imageUrl?: string;
  leftBias?: number;
  centerBias?: number;
  rightBias?: number;
  timeAgo?: string;
  readTime?: string;
  className?: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({
  category = "India",
  source = "Politics",
  title = "India's GDP Growth Revised Upward to 7% for FY25: Report",
  excerpt = "The report highlights strong domestic demand, improved manufacturing output and robust service sector performance.",
  imageUrl = "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800&auto=format&fit=crop",
  leftBias = 25,
  centerBias = 50,
  rightBias = 25,
  timeAgo = "2h ago",
  readTime = "8 min read",
  className = "",
}) => {
  return (
    <article
      className={`bg-white border border-[#E5E7EB] rounded-[12px] p-5 shadow-sys-md transition-all duration-200 hover:shadow-sys-lg flex flex-col md:flex-row gap-5 max-w-[800px] ${className}`}
    >
      {/* Article Image Container */}
      <div className="relative w-full md:w-56 h-48 md:h-auto shrink-0 rounded-[8px] overflow-hidden bg-[#F0F0F0]">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#6B7280]">
            No image
          </div>
        )}
        <button
          type="button"
          aria-label="Info"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white backdrop-blur-xs hover:bg-black/60 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Article Details */}
      <div className="flex flex-col justify-between flex-1 gap-3">
        <div className="flex flex-col gap-1.5">
          {/* Metadata Category */}
          <div className="text-[11px] font-medium text-[#6B7280] tracking-wide uppercase">
            <span>{category}</span>
            <span className="mx-1">•</span>
            <span>{source}</span>
          </div>

          {/* Title */}
          <h3 className="text-h3 text-[#0D0D0F] font-semibold leading-tight hover:text-[#1D4ED8] transition-colors cursor-pointer">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="body-medium text-[#6B7280] line-clamp-2">{excerpt}</p>
        </div>

        {/* Bias Meter */}
        <div className="mt-1">
          <BiasMeter
            left={leftBias}
            center={centerBias}
            right={rightBias}
            showLabels={true}
            showTicks={false}
          />
        </div>

        {/* Footer Meta */}
        <div className="flex items-center justify-between text-[12px] text-[#6B7280] pt-2 border-t border-[#E5E7EB]">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
            <span>{timeAgo}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-[#0D0D0F] transition-colors"
            >
              <Bookmark className="w-3.5 h-3.5 stroke-[2]" />
              <span>{readTime}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
