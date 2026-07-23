import React from "react";
import { HeaderUtilityBar } from "@/components/home/header-utility-bar";
import { MainNav } from "@/components/home/main-nav";
import { TopicPillsBar } from "@/components/home/topic-pills-bar";
import { HomeCard, ArticleData } from "@/components/home/home-card";
import { HomeFooter } from "@/components/home/home-footer";
import { getArticlesWithAnalysis } from "@/lib/supabase/db";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch real articles with analysis from Supabase
  const articlesWithDetails = await getArticlesWithAnalysis(30, 0);

  // Map DB rows to the card data format
  const topNewsArticles: ArticleData[] = articlesWithDetails.map((a) => {
    const analysis = a.analysis;
    return {
      id: a.id,
      title: a.title,
      sourceName: a.source?.name || "Unknown Source",
      imageUrl: a.image_url,
      publishedDate: a.published_date,
      sentimentLabel: analysis?.sentiment_label || "neutral",
      biasLabel: analysis?.bias_label || "unclear",
      leftPercent: analysis?.left_percentage ?? 33,
      centerPercent: analysis?.center_percentage ?? 34,
      rightPercent: analysis?.right_percentage ?? 33,
      confidence: analysis?.confidence ?? 0,
    };
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0D0D0F] font-sans flex flex-col justify-between selection:bg-[#0D0D0F] selection:text-white overflow-x-hidden">
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

          {topNewsArticles.length > 0 ? (
            /* Top News 3-Column Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
              {topNewsArticles.map((article) => (
                <HomeCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[#F3F4F6] flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-[#9CA3AF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h2 className="text-[18px] font-bold text-[#374151] mb-2">
                No articles yet
              </h2>
              <p className="text-[14px] text-[#6B7280] max-w-md">
                Articles will appear here once they&apos;ve been scraped and analyzed.
                Use the scraping API to fetch news from configured sources.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <HomeFooter />
    </div>
  );
}
