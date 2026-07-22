"use client";

import React, { useState } from "react";
import {
  Menu,
  Search,
  Bookmark,
  Clock,
  Info,
  Share2,
  ExternalLink,
  Calendar,
  TrendingUp,
  Tag,
  User,
  Bell,
  SlidersHorizontal,
  CheckCircle2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { BiasMeter } from "@/components/ui/bias-meter";
import { NewsCard } from "@/components/ui/news-card";
import { MonumentSkyline } from "@/components/ui/monument-skyline";

export default function DesignSystemPage() {
  const [selectedChip, setSelectedChip] = useState<string>("World Cup");

  const chipsList = ["World Cup", "IPL", "Business & Markets", "More"];

  return (
    <div className="min-h-screen bg-[#F0F0F0] text-[#0D0D0F] p-4 sm:p-8 font-sans">
      <div className="max-w-[1280px] mx-auto flex flex-col gap-6">
        {/* Top Header / Banner */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
          <div>
            <span className="text-[12px] font-semibold text-[#6B7280] tracking-wider uppercase">
              UI DESIGN SYSTEM
            </span>
            <h1 className="text-h1 font-bold text-[#0D0D0F]">
              biasly News Specification
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#E5E7EB] rounded-[4px] text-[12px] font-medium text-[#374151]">
              v1.0 • June 1, 2026
            </span>
          </div>
        </header>

        {/* TOP ROW: BRAND, TYPOGRAPHY, UI ELEMENTS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* BRAND CARD WITH MONUMENT WATERMARK (3 cols) */}
          <div className="relative lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between overflow-hidden">
            {/* Monument Skyline Background Watermark */}
            <div className="absolute inset-x-0 bottom-0 opacity-40 pointer-events-none">
              <MonumentSkyline dark={false} />
            </div>

            <div className="relative z-10 text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-6">
              BRAND
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center my-auto py-8 text-center">
              <div className="flex items-baseline gap-1.5 mb-3">
                <span className="text-[38px] font-extrabold tracking-tight text-[#0D0D0F]">
                  biasly
                </span>
                <span className="bg-[#0D0D0F] text-white text-[13px] font-semibold px-2 py-0.5 rounded-[4px]">
                  News
                </span>
              </div>
              <p className="body-medium text-[#6B7280] max-w-[200px] leading-relaxed">
                Balanced news coverage, powered by AI.
              </p>
            </div>
          </div>

          {/* TYPOGRAPHY CARD (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                TYPOGRAPHY
              </div>
              <div className="flex items-start justify-between mb-4 border-b border-[#E5E7EB] pb-3">
                <div>
                  <div className="caption-text text-[#6B7280] uppercase tracking-wider">
                    FONT FAMILY
                  </div>
                  <h2 className="text-[28px] font-bold text-[#0D0D0F] leading-tight">
                    Poppins
                  </h2>
                </div>
                <p className="caption-text text-[#6B7280] max-w-[220px]">
                  Poppins is a modern geometric sans-serif typeface that ensures
                  clarity and excellent readability.
                </p>
              </div>

              {/* Typography Spec Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[12px]">
                  <thead>
                    <tr className="text-[#6B7280] border-b border-[#E5E7EB] caption-text">
                      <th className="pb-2 font-medium">STYLE</th>
                      <th className="pb-2 font-medium">USE</th>
                      <th className="pb-2 font-medium">SIZE</th>
                      <th className="pb-2 font-medium">WEIGHT</th>
                      <th className="pb-2 font-medium">LINE HEIGHT</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5E7EB]">
                    <tr>
                      <td className="py-2.5 font-bold text-[18px]">H1</td>
                      <td className="py-2.5 text-[#6B7280]">Page / Screen Title</td>
                      <td className="py-2.5 text-[#6B7280]">32px</td>
                      <td className="py-2.5 font-semibold">Bold</td>
                      <td className="py-2.5 text-[#6B7280]">1.2</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold text-[16px]">H2</td>
                      <td className="py-2 text-[#6B7280]">Section Title</td>
                      <td className="py-2 text-[#6B7280]">24px</td>
                      <td className="py-2 font-semibold">SemiBold</td>
                      <td className="py-2 text-[#6B7280]">1.3</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-semibold text-[15px]">H3</td>
                      <td className="py-2 text-[#6B7280]">Card / Module Title</td>
                      <td className="py-2 text-[#6B7280]">20px</td>
                      <td className="py-2 font-semibold">SemiBold</td>
                      <td className="py-2 text-[#6B7280]">1.3</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium text-[14px]">H4</td>
                      <td className="py-2 text-[#6B7280]">Subheading</td>
                      <td className="py-2 text-[#6B7280]">16px</td>
                      <td className="py-2 font-medium">Medium</td>
                      <td className="py-2 text-[#6B7280]">1.4</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[13px]">Body Large</td>
                      <td className="py-2 text-[#6B7280]">Important content</td>
                      <td className="py-2 text-[#6B7280]">16px</td>
                      <td className="py-2">Regular</td>
                      <td className="py-2 text-[#6B7280]">1.6</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[13px]">Body Medium</td>
                      <td className="py-2 text-[#6B7280]">Body text</td>
                      <td className="py-2 text-[#6B7280]">14px</td>
                      <td className="py-2">Regular</td>
                      <td className="py-2 text-[#6B7280]">1.6</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[13px]">Body Small</td>
                      <td className="py-2 text-[#6B7280]">Supporting text</td>
                      <td className="py-2 text-[#6B7280]">13px</td>
                      <td className="py-2">Regular</td>
                      <td className="py-2 text-[#6B7280]">1.6</td>
                    </tr>
                    <tr>
                      <td className="py-2 text-[11px] font-medium">Caption</td>
                      <td className="py-2 text-[#6B7280]">Labels, meta text</td>
                      <td className="py-2 text-[#6B7280]">11px</td>
                      <td className="py-2">Regular</td>
                      <td className="py-2 text-[#6B7280]">1.4</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* UI ELEMENTS CARD (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div className="flex flex-col gap-5">
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">
                UI ELEMENTS
              </div>

              {/* BUTTON MATRIX */}
              <div>
                <div className="caption-text text-[#6B7280] font-semibold uppercase mb-2">
                  BUTTONS
                </div>
                <div className="grid grid-cols-4 gap-2 text-center text-[11px] text-[#6B7280] mb-2 font-medium">
                  <div>Default</div>
                  <div>Hover</div>
                  <div>Outline</div>
                  <div>Disabled</div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Primary Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-16 text-[11px] font-medium text-[#6B7280]">
                      Primary
                    </span>
                    <Button size="sm" variant="primary">
                      Button
                    </Button>
                    <Button size="sm" variant="primary" className="bg-[#26262A]">
                      Button
                    </Button>
                    <Button size="sm" variant="primary" outline>
                      Button
                    </Button>
                    <Button size="sm" variant="primary" disabled>
                      Button
                    </Button>
                  </div>

                  {/* Secondary Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-16 text-[11px] font-medium text-[#6B7280]">
                      Secondary
                    </span>
                    <Button size="sm" variant="secondary">
                      Button
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-[#E5E7EB]">
                      Button
                    </Button>
                    <Button size="sm" variant="secondary" outline>
                      Button
                    </Button>
                    <Button size="sm" variant="secondary" disabled>
                      Button
                    </Button>
                  </div>

                  {/* Text Row */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-16 text-[11px] font-medium text-[#6B7280]">
                      Text
                    </span>
                    <Button size="sm" variant="text">
                      Button
                    </Button>
                    <Button size="sm" variant="text" className="text-[#1D4ED8]">
                      Button
                    </Button>
                    <span className="text-[#9CA3AF] text-center w-full">—</span>
                    <span className="text-[#9CA3AF] text-center w-full">—</span>
                  </div>
                </div>
              </div>

              {/* CHIP / CATEGORY */}
              <div>
                <div className="caption-text text-[#6B7280] font-semibold uppercase mb-2">
                  CHIP / CATEGORY
                </div>
                <div className="flex flex-wrap gap-2">
                  {chipsList.map((chip) => (
                    <Chip
                      key={chip}
                      label={chip}
                      active={selectedChip === chip}
                      onClick={() => setSelectedChip(chip)}
                    />
                  ))}
                </div>
              </div>

              {/* BIAS METER PREVIEW */}
              <div>
                <div className="caption-text text-[#6B7280] font-semibold uppercase mb-2">
                  BIAS METER
                </div>
                <BiasMeter left={25} center={50} right={25} />
              </div>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW: COLORS, ICONS, CARD EXAMPLE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* COLORS CARD (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                COLORS
              </div>

              {/* PRIMARY */}
              <div className="mb-4">
                <div className="caption-text font-semibold text-[#6B7280] uppercase mb-2">
                  PRIMARY
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#0D0D0F] border border-black/10 shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">TEXT PRIMARY</span>
                    <span className="text-[10px] text-[#6B7280]">#0D0D0F</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#6B7280] shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">TEXT SECONDARY</span>
                    <span className="text-[10px] text-[#6B7280]">#6B7280</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#F6F6F6] border border-[#E5E7EB] shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">SURFACE</span>
                    <span className="text-[10px] text-[#6B7280]">#F6F6F6</span>
                  </div>
                </div>
              </div>

              {/* SEMANTIC */}
              <div className="mb-4">
                <div className="caption-text font-semibold text-[#6B7280] uppercase mb-2">
                  SEMANTIC
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#B42318] shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">LEFT BIAS</span>
                    <span className="text-[10px] text-[#6B7280]">#B42318</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#E5E7EB] border border-[#D1D5DB] shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">CENTER</span>
                    <span className="text-[10px] text-[#6B7280]">#E5E7EB</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-16 rounded-[8px] bg-[#1D4ED8] shadow-xs mb-1" />
                    <span className="text-[10px] font-bold">RIGHT BIAS</span>
                    <span className="text-[10px] text-[#6B7280]">#1D4ED8</span>
                  </div>
                </div>
              </div>

              {/* NEUTRALS */}
              <div>
                <div className="caption-text font-semibold text-[#6B7280] uppercase mb-2">
                  NEUTRALS
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-full h-12 rounded-[8px] bg-[#FFFFFF] border border-[#E5E7EB] mb-1" />
                    <span className="text-[9px] font-bold">BG PRIMARY</span>
                    <span className="text-[9px] text-[#6B7280]">#FFFFFF</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-12 rounded-[8px] bg-[#F0F0F0] border border-[#E5E7EB] mb-1" />
                    <span className="text-[9px] font-bold">BG SEC.</span>
                    <span className="text-[9px] text-[#6B7280]">#F0F0F0</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-12 rounded-[8px] bg-[#E5E7EB] mb-1" />
                    <span className="text-[9px] font-bold">BORDER</span>
                    <span className="text-[9px] text-[#6B7280]">#E5E7EB</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-full h-12 rounded-[8px] bg-[#E5E7EB] mb-1" />
                    <span className="text-[9px] font-bold">DIVIDER</span>
                    <span className="text-[9px] text-[#6B7280]">#E5E7EB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ICONS CARD (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                ICONS
              </div>
              <div className="grid grid-cols-5 gap-4 py-4 text-[#0D0D0F]">
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Menu className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Search className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Bookmark className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Clock className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Info className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Share2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <ExternalLink className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Calendar className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <TrendingUp className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Tag className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <User className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <Bell className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <SlidersHorizontal className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <CheckCircle2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="flex items-center justify-center p-2 rounded-md hover:bg-[#F6F6F6] cursor-pointer">
                  <MoreHorizontal className="w-5 h-5 stroke-[2]" />
                </div>
              </div>
            </div>
            <div className="text-[11px] text-[#6B7280] pt-3 border-t border-[#E5E7EB]">
              Line style • 2px stroke • Rounded caps
            </div>
          </div>

          {/* CARD EXAMPLE (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                CARD EXAMPLE
              </div>
              <NewsCard
                category="India"
                source="Politics"
                title="India's GDP Growth Revised Upward to 7% for FY25: Report"
                excerpt="The report highlights strong domestic demand, improved manufacturing output and robust service sector performance."
                imageUrl="https://images.unsplash.com/photo-1532375810709-75b1da00537c?q=80&w=800&auto=format&fit=crop"
                leftBias={25}
                centerBias={50}
                rightBias={25}
                timeAgo="2h ago"
                readTime="8 min read"
              />
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: SPACING, GRID, SHADOWS, BORDER RADIUS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          {/* SPACING SYSTEM (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-2">
                SPACING SYSTEM <span className="text-[10px] font-normal text-[#9CA3AF]">(4px BASE UNIT)</span>
              </div>

              <div className="flex items-end gap-2.5 h-32 py-4 border-b border-[#E5E7EB]">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "8px" }} />
                  <span className="text-[10px] text-[#6B7280]">4px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "16px" }} />
                  <span className="text-[10px] text-[#6B7280]">8px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "32px" }} />
                  <span className="text-[10px] text-[#6B7280]">16px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "48px" }} />
                  <span className="text-[10px] text-[#6B7280]">24px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "64px" }} />
                  <span className="text-[10px] text-[#6B7280]">32px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "80px" }} />
                  <span className="text-[10px] text-[#6B7280]">40px</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-5 bg-[#C7D2FE] rounded-xs" style={{ height: "100px" }} />
                  <span className="text-[10px] text-[#6B7280]">64px</span>
                </div>
              </div>
            </div>
            <div className="text-[11px] text-[#6B7280] pt-3">
              Consistent spacing scale based on 4px base unit
            </div>
          </div>

          {/* GRID SYSTEM (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-3">
                GRID SYSTEM
              </div>

              {/* Grid visual */}
              <div className="relative bg-[#EEF2FF] p-2 rounded-[8px] border border-[#C7D2FE] mb-4">
                <div className="grid grid-cols-12 gap-1 h-20">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-[#C7D2FE]/60 rounded-xs h-full flex items-center justify-center text-[8px] text-[#3730A3] font-mono"
                    />
                  ))}
                </div>
                <div className="absolute right-2 top-2 text-[9px] text-[#4338CA] bg-white/80 px-1.5 py-0.5 rounded-xs font-mono">
                  Container 1280px
                </div>
              </div>

              <div className="space-y-1.5 text-[12px]">
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1">
                  <span className="text-[#6B7280]">Container</span>
                  <span className="font-semibold">1280px</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1">
                  <span className="text-[#6B7280]">Columns</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between border-b border-[#E5E7EB] pb-1">
                  <span className="text-[#6B7280]">Gutter</span>
                  <span className="font-semibold">24px</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6B7280]">Margin</span>
                  <span className="font-semibold">24px</span>
                </div>
              </div>
            </div>
          </div>

          {/* SHADOWS (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                SHADOWS
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-[6px] border border-[#E5E7EB] shadow-sys-sm" />
                  <div>
                    <div className="text-[11px] font-bold">SMALL</div>
                    <div className="text-[10px] text-[#6B7280]">
                      0px 1px 2px rgba(0,0,0,0.05)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-[6px] border border-[#E5E7EB] shadow-sys-md" />
                  <div>
                    <div className="text-[11px] font-bold">MEDIUM</div>
                    <div className="text-[10px] text-[#6B7280]">
                      0px 4px 12px rgba(0,0,0,0.08)
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-[6px] border border-[#E5E7EB] shadow-sys-lg" />
                  <div>
                    <div className="text-[11px] font-bold">LARGE</div>
                    <div className="text-[10px] text-[#6B7280]">
                      0px 12px 24px rgba(0,0,0,0.12)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BORDER RADIUS (3 cols) */}
          <div className="lg:col-span-3 bg-white rounded-[12px] p-6 border border-[#E5E7EB] shadow-sys-sm flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider mb-4">
                BORDER RADIUS
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white border-2 border-[#0D0D0F] rounded-[4px]" />
                  <div className="flex justify-between w-full pr-2 text-[12px]">
                    <span className="font-bold">SMALL</span>
                    <span className="text-[#6B7280]">4px</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white border-2 border-[#0D0D0F] rounded-[8px]" />
                  <div className="flex justify-between w-full pr-2 text-[12px]">
                    <span className="font-bold">MEDIUM</span>
                    <span className="text-[#6B7280]">8px</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white border-2 border-[#0D0D0F] rounded-[12px]" />
                  <div className="flex justify-between w-full pr-2 text-[12px]">
                    <span className="font-bold">LARGE</span>
                    <span className="text-[#6B7280]">12px</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 bg-white border-2 border-[#0D0D0F] rounded-full" />
                  <div className="flex justify-between w-full pr-2 text-[12px]">
                    <span className="font-bold">FULL</span>
                    <span className="text-[#6B7280]">9999px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BRAND FOOTER BAR WITH MONUMENT SILHOUETTE */}
        <footer className="relative bg-[#0D0D0F] text-white rounded-[12px] px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] overflow-hidden">
          {/* Dark Watermark Skyline */}
          <div className="absolute right-0 bottom-0 top-0 w-1/2 opacity-30 pointer-events-none flex items-center">
            <MonumentSkyline dark={true} />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <span className="text-[20px] font-bold tracking-tight">
              biasly <span className="text-[12px] font-medium text-[#9CA3AF]">News</span>
            </span>
            <span className="text-[#6B7280] hidden sm:inline">•</span>
            <span className="text-[#9CA3AF] text-[12px]">
              Balanced news coverage, powered by AI.
            </span>
          </div>

          <div className="relative z-10 flex items-center gap-6 text-[#9CA3AF] text-[12px]">
            <span>Design System v1.0</span>
            <span>June 1, 2026</span>
          </div>

          <div className="relative z-10 text-[12px] font-medium text-white">
            Stay consistent. Stay unbiased.
          </div>
        </footer>
      </div>
    </div>
  );
}
