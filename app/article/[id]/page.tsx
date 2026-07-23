import React from "react";
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

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await params;

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
                breadcrumbs={["Home", "India", "Agriculture"]}
                title="Centre Approves ₹2.4 Lakh Crore Scheme to Boost Farmer Income"
                author="Ananya Sharma"
                date="May 31, 2026"
                readTime="10 min read"
                imageUrl="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
                imageCaption="A farmer inspects his crop at a field in Punjab. The new scheme aims to double farmers' income by 2030."
                photoCredit="Photo: PTI"
              />

              {/* Inline Bias Distribution Box */}
              <InlineBiasBox
                leftPercent={18}
                centerPercent={42}
                rightPercent={40}
                sourcesCount={7}
              />

              {/* Article Body Content */}
              <article className="prose prose-neutral max-w-none text-[#1F2937] text-[15px] md:text-[16px] leading-[1.75] flex flex-col gap-4 font-normal">
                <p>
                  The Union Cabinet on Saturday approved a ₹2.4 lakh crore PM
                  Kisan Samriddhi Yojana to enhance productivity, ensure assured
                  prices and reduce input costs for farmers across the country.
                </p>

                <p>
                  The scheme, to be implemented from July 1, 2026, will benefit
                  an estimated 86 million small and marginal farmers. It
                  includes direct income support, crop diversification
                  incentives, low-interest loans and investment in storage and
                  cold chains.
                </p>

                {/* Quote Callout */}
                <blockquote className="my-3 pl-4 border-l-4 border-[#0D0D0F] italic font-medium text-[#111827] text-[15px] md:text-[16px] leading-relaxed">
                  &ldquo;This initiative reflects our commitment to the annadata of the
                  nation. Our goal is to double farmers&apos; income by 2030,&rdquo; Prime
                  Minister Narendra Modi said while addressing a farmers&apos;
                  gathering in Varanasi via video conference.
                </blockquote>

                <p>
                  Agriculture Minister Shivraj Singh Chouhan said the scheme
                  will also promote natural farming, reduce dependency on
                  chemical fertilisers and encourage water conservation.
                </p>

                <p>
                  States have been urged to ensure timely implementation and
                  transparency in beneficiary selection. The government will set
                  up a dashboard to track progress in real-time.
                </p>

                <p>
                  Farmer unions welcomed the announcement but demanded a legal
                  guarantee on minimum support price (MSP) for all crops. Talks
                  between the government and union leaders are expected in the
                  coming weeks.
                </p>

                <p>
                  Market experts believe the scheme will increase rural
                  consumption and give a boost to sectors such as FMCG,
                  agri-tech and farm equipment.
                </p>
              </article>

              {/* Related Stories Grid */}
              <RelatedStories />
            </div>

            {/* Right Sidebar Column (4 cols) */}
            <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-6">
              <SidebarBiasAnalysis
                overallLabel="Right"
                overallPercent={40}
                sourcesCount={7}
                leftPercent={18}
                centerPercent={42}
                rightPercent={40}
              />

              <SidebarAISummary
                generatedDate="May 31, 2026"
                readTime="3 min read"
              />

              <SidebarSourceBreakdown totalSources={7} />
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
