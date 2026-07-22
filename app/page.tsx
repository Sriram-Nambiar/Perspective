"use client";

import React from "react";
import { HeaderUtilityBar } from "@/components/home/header-utility-bar";
import { MainNav } from "@/components/home/main-nav";
import { TopicPillsBar } from "@/components/home/topic-pills-bar";
import { HomeCard, ArticleData } from "@/components/home/home-card";
import { HomeFooter } from "@/components/home/home-footer";

export default function HomePage() {
  const topNewsArticles: ArticleData[] = [
    {
      id: "1",
      title: "PM Modi Chairs High-Level Meeting on India's Growth & Global Strategy",
      category: "Politics",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800&auto=format&fit=crop",
      leftBias: 20,
      centerBias: 31,
      rightBias: 49,
      sourcesCount: 12,
    },
    {
      id: "2",
      title:
        "Centre Approves ₹24,000 Cr Scheme to Boost Farmer Income Across States",
      category: "Agriculture",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop",
      leftBias: 18,
      centerBias: 42,
      rightBias: 40,
      sourcesCount: 7,
    },
    {
      id: "3",
      title: "Delhi Metro Phase 4 Expansion Gets Centre's Final Approval",
      category: "India",
      sourceCategory: "Infrastructure",
      imageUrl:
        "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=800&auto=format&fit=crop",
      leftBias: 16,
      centerBias: 62,
      rightBias: 22,
      sourcesCount: 8,
    },
    {
      id: "4",
      title:
        "India Beat Australia by 6 Wickets in Thrilling ODI, Take Series 2-1",
      category: "Sports",
      sourceCategory: "Cricket",
      imageUrl:
        "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop",
      leftBias: 54,
      centerBias: 28,
      rightBias: 18,
      sourcesCount: 63,
    },
    {
      id: "5",
      title:
        "Supreme Court Stays New WAQF Act Provisions, Seeks Centre's Response",
      category: "India",
      sourceCategory: "Law & Order",
      imageUrl:
        "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=800&auto=format&fit=crop",
      leftBias: 22,
      centerBias: 35,
      rightBias: 43,
      sourcesCount: 15,
    },
    {
      id: "6",
      title: "Sensex Surges 720 Points; Nifty Closes Above 24,500 Mark",
      category: "Business",
      sourceCategory: "Markets",
      imageUrl:
        "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop",
      leftBias: 25,
      centerBias: 50,
      rightBias: 25,
      sourcesCount: 11,
    },
    {
      id: "7",
      title: "ISRO Successfully Launches EOS-09 Satellite into Orbit",
      category: "Science",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1517976487492-5750f3195933?q=80&w=800&auto=format&fit=crop",
      leftBias: 12,
      centerBias: 45,
      rightBias: 43,
      sourcesCount: 9,
    },
    {
      id: "8",
      title:
        "Apple iPhone 16 Series Launches in India; Prices Start at ₹79,900",
      category: "Technology",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=800&auto=format&fit=crop",
      leftBias: 15,
      centerBias: 40,
      rightBias: 45,
      sourcesCount: 10,
    },
    {
      id: "9",
      title: "IMD Predicts Severe Heatwave in North & Central India This Week",
      category: "Weather",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?q=80&w=800&auto=format&fit=crop",
      leftBias: 33,
      centerBias: 34,
      rightBias: 33,
      sourcesCount: 14,
    },
    {
      id: "10",
      title: "RBI Keeps Repo Rate Unchanged; Signals Caution on Inflation",
      category: "Economy",
      sourceCategory: "India",
      imageUrl:
        "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop",
      leftBias: 30,
      centerBias: 45,
      rightBias: 25,
      sourcesCount: 13,
    },
    {
      id: "11",
      title: "'Jawan 2' Officially Announced; Release in Dec 2026",
      category: "Entertainment",
      sourceCategory: "Bollywood",
      imageUrl:
        "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800&auto=format&fit=crop",
      leftBias: 20,
      centerBias: 20,
      rightBias: 60,
      sourcesCount: 26,
    },
    {
      id: "12",
      title:
        "Heavy Rains Lash Mumbai; IMD Issues Red Alert for Coastal Maharashtra",
      category: "India",
      sourceCategory: "States",
      imageUrl:
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=800&auto=format&fit=crop",
      leftBias: 27,
      centerBias: 33,
      rightBias: 40,
      sourcesCount: 17,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0D0D0F] font-sans flex flex-col justify-between selection:bg-[#0D0D0F] selection:text-white">
      {/* Top Header Utility Bar & Main Navigation */}
      <div>
        <HeaderUtilityBar />
        <MainNav />
        <TopicPillsBar />

        {/* Main News Content Area */}
        <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 w-full">
          {/* Section Heading */}
          <div className="mb-6">
            <h1 className="text-[26px] md:text-[28px] font-bold text-[#0D0D0F] tracking-tight">
              Top News
            </h1>
          </div>

          {/* Top News 3-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {topNewsArticles.map((article) => (
              <HomeCard key={article.id} article={article} />
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
