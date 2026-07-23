"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

export interface RelatedStory {
  id: string;
  title: string;
  categoryTag: string;
  date: string;
  readTime: string;
  imageUrl: string;
}

export interface RelatedStoriesProps {
  stories?: RelatedStory[];
}

export const RelatedStories: React.FC<RelatedStoriesProps> = ({
  stories = [
    {
      id: "rel-1",
      title: "Vande Bharat Sleeper Trains to Connect 10 More Cities",
      categoryTag: "India • Infrastructure",
      date: "May 29, 2026",
      readTime: "8 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "rel-2",
      title: "Opposition Delegation Meets President Over Key Bills",
      categoryTag: "Politics • India",
      date: "May 29, 2026",
      readTime: "6 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "rel-3",
      title: "Sensex Rallies 600 Points; Nifty Crosses Above 24,800",
      categoryTag: "Business • Markets",
      date: "May 29, 2026",
      readTime: "7 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "rel-4",
      title: "INS Vikrant Completes 2 Years of Operations",
      categoryTag: "India • Defence",
      date: "May 28, 2026",
      readTime: "6 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "rel-5",
      title: "UPI Transactions Cross 20 Billion in May",
      categoryTag: "India • Technology",
      date: "May 28, 2026",
      readTime: "5 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1556742049-0a67d578673a?q=80&w=400&auto=format&fit=crop",
    },
    {
      id: "rel-6",
      title: "Delhi Air Quality Improves Slightly After Rain",
      categoryTag: "India • Environment",
      date: "May 28, 2026",
      readTime: "6 min read",
      imageUrl:
        "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=400&auto=format&fit=crop",
    },
  ],
}) => {
  return (
    <div className="w-full mt-10 pt-8 border-t border-[#E5E7EB]">
      <h2 className="text-[20px] md:text-[22px] font-bold text-[#0D0D0F] tracking-tight mb-6">
        Related Stories
      </h2>

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
                {story.categoryTag}
              </div>
              <h3 className="text-[13px] md:text-[14px] font-bold text-[#0D0D0F] leading-snug line-clamp-2 group-hover:text-[#003B95] transition-colors">
                {story.title}
              </h3>
              <div className="text-[11px] text-[#9CA3AF] mt-0.5">
                {story.date} • {story.readTime}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
