import React from "react";
import { notFound } from "next/navigation";
import { HeaderUtilityBar } from "@/components/home/header-utility-bar";
import { MainNav } from "@/components/home/main-nav";
import { TopicPillsBar } from "@/components/home/topic-pills-bar";
import { ArticleHeader } from "@/components/article/article-header";
import { InlineBiasBox } from "@/components/article/inline-bias-box";
import { RelatedStories } from "@/components/article/related-stories";
import { SidebarBiasAnalysis } from "@/components/article/sidebar-bias-analysis";
import { SidebarAISummary } from "@/components/article/sidebar-ai-summary";
import { SidebarSourceBreakdown } from "@/components/article/sidebar-source-breakdown";
import { NewsletterBanner } from "@/components/article/newsletter-banner";
import { HomeFooter } from "@/components/home/home-footer";
import { getArticleWithAnalysisById, getArticlesWithAnalysis } from "@/lib/supabase/db";
import type { Json } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function estimateReadTime(text: string): string {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function parseJsonArray(val: Json | null | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) {
    return val.map((item) => {
      if (typeof item === "string") return item;
      return String(item);
    });
  }
  return [];
}

function parseLoadedTerms(
  val: Json | null | undefined
): Array<{ term: string; explanation: string; biasTarget?: string }> {
  if (!val || !Array.isArray(val)) return [];
  return val
    .filter(
      (item): item is { term: string; explanation: string; biasTarget?: string } =>
        typeof item === "object" &&
        item !== null &&
        "term" in item &&
        "explanation" in item
    )
    .map((item) => ({
      term: String(item.term),
      explanation: String(item.explanation),
      biasTarget: item.biasTarget ? String(item.biasTarget) : undefined,
    }));
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const article = await getArticleWithAnalysisById(id);

  if (!article) {
    notFound();
  }

  const analysis = article.analysis;
  const source = article.source;

  // Fetch related articles (recent articles from the same source, excluding current)
  const allRecent = await getArticlesWithAnalysis(7, 0);
  const relatedArticles = allRecent
    .filter((a) => a.id !== article.id)
    .slice(0, 6)
    .map((a) => ({
      id: a.id,
      title: a.title,
      sourceName: a.source?.name || "Unknown",
      publishedDate: formatDate(a.published_date),
      imageUrl: a.image_url,
    }));

  // Parse raw_text into paragraphs
  const paragraphs = article.raw_text
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const framingNotes = analysis ? parseJsonArray(analysis.framing_notes) : [];
  const loadedTerms = analysis ? parseLoadedTerms(analysis.loaded_terms) : [];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#0D0D0F] font-sans flex flex-col justify-between selection:bg-[#0D0D0F] selection:text-white overflow-x-hidden">
      <div>
        {/* Navigation Headers */}
        <HeaderUtilityBar />
        <MainNav />
        <TopicPillsBar />

        {/* Main Article Container */}
        <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Main Content Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col">
              {/* Article Header & Featured Image */}
              <ArticleHeader
                breadcrumbs={["Home", source?.name || "News"]}
                title={article.title}
                author={source?.name || "Staff Reporter"}
                date={formatDate(article.published_date)}
                readTime={estimateReadTime(article.raw_text)}
                imageUrl={article.image_url}
                imageCaption={article.title}
                photoCredit={`Source: ${source?.name || "Unknown"}`}
              />

              {/* Inline Bias Distribution Box */}
              {analysis && (
                <InlineBiasBox
                  leftPercent={analysis.left_percentage}
                  centerPercent={analysis.center_percentage}
                  rightPercent={analysis.right_percentage}
                />
              )}

              {/* Article Body Content */}
              <article className="prose prose-neutral max-w-none text-[#1F2937] text-[15px] md:text-[16px] leading-[1.75] flex flex-col gap-4 font-normal">
                {paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </article>

              {/* Related Stories Grid */}
              <RelatedStories stories={relatedArticles} />
            </div>

            {/* Right Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
              {analysis && (
                <>
                  <SidebarBiasAnalysis
                    overallLabel={
                      (analysis.bias_label || "unclear").charAt(0).toUpperCase() +
                      (analysis.bias_label || "unclear").slice(1)
                    }
                    leftPercent={analysis.left_percentage}
                    centerPercent={analysis.center_percentage}
                    rightPercent={analysis.right_percentage}
                    confidence={analysis.confidence}
                    sentimentLabel={
                      (analysis.sentiment_label || "neutral").charAt(0).toUpperCase() +
                      (analysis.sentiment_label || "neutral").slice(1)
                    }
                  />

                  <SidebarAISummary
                    summary={analysis.summary}
                    disclaimer={analysis.disclaimer}
                    generatedDate={formatDate(analysis.created_at)}
                  />

                  <SidebarSourceBreakdown
                    sourceName={source?.name || "Unknown Source"}
                    biasLabel={
                      (analysis.bias_label || "unclear").charAt(0).toUpperCase() +
                      (analysis.bias_label || "unclear").slice(1)
                    }
                    leftPercent={analysis.left_percentage}
                    centerPercent={analysis.center_percentage}
                    rightPercent={analysis.right_percentage}
                    framingNotes={framingNotes}
                    loadedTerms={loadedTerms}
                  />
                </>
              )}

              {!analysis && (
                <div className="w-full bg-white border border-[#E5E7EB] rounded-xl p-5 shadow-sm text-center">
                  <p className="text-[14px] text-[#6B7280]">
                    AI analysis is pending for this article.
                  </p>
                </div>
              )}
            </aside>
          </div>

          {/* Newsletter Banner */}
          <NewsletterBanner />
        </main>
      </div>

      {/* Global Dark Footer */}
      <HomeFooter />
    </div>
  );
}
