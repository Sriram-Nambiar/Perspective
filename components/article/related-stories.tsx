"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface RelatedStory {
  id: string;
  title: string;
  sourceName: string;
  publishedDate: string;
  imageUrl: string;
}

export interface RelatedStoriesProps {
  stories: RelatedStory[];
}

export const RelatedStories: React.FC<RelatedStoriesProps> = ({ stories }) => {
  return (
    <div className="w-full mt-10 pt-8 border-t border-[#E5E7EB]">
      <h2 className="text-[20px] md:text-[22px] font-bold text-[#0D0D0F] tracking-tight mb-6">
        Related Stories
      </h2>

      {stories && stories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stories.map((story) => (
            <Link
              key={story.id}
              href={`/article/${story.id}`}
              className="group flex items-start gap-3.5 p-2 rounded-xl hover:bg-white hover:shadow-sm transition-all"
            >
              {/* Thumbnail */}
              <div className="w-24 h-20 relative rounded-lg overflow-hidden shrink-0 bg-[#E5E7EB]">
                <Image
                  src={story.imageUrl}
                  alt={story.title}
                  fill
                  sizes="96px"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content Stack */}
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="text-[11px] font-medium text-[#6B7280]">
                  {story.sourceName}
                </div>
                <h3 className="text-[13px] md:text-[14px] font-bold text-[#0D0D0F] leading-snug line-clamp-2 group-hover:text-[#003B95] transition-colors">
                  {story.title}
                </h3>
                <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                  {story.publishedDate}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-[13px] text-[#6B7280] italic">
          No related stories available.
        </p>
      )}
    </div>
  );
};
