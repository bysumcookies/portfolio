"use client";

import { useState } from "react";

import Navbar from "../components/Navbar";
import HeroTitle from "../components/HeroTitle";
import HeroCTA from "../components/HeroCTA";
import SocialLinks from "../components/SocialLinks";

import ChatOpenPanel from "../components/ChatOpenPanel";
import ChatClosedPanel from "../components/ChatClosedPanel";

function ChatSection() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="relative w-full">
      <div className="relative w-full min-h-[520px]">
        {/* Closed */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            isChatOpen
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <ChatClosedPanel onOpenChat={() => setIsChatOpen(true)} />
        </div>

        {/* Open */}
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            isChatOpen
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <ChatOpenPanel onClose={() => setIsChatOpen(false)} />
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1">
        {/* 포스터 레이아웃 */}
        <div className="min-h-[calc(100vh-4rem)] flex items-start pt-20 pb-16 sm:pt-24 sm:pb-20">
          {/* ✅ 하나의 컨테이너 폭으로 전부 통일 (좌우 라인 맞추기)
              ✅ 데스크탑에서 과하게 넓어지지 않도록 max-w를 단계적으로 제한 */}
          <div className="w-full mx-auto px-6 sm:px-10 lg:px-14 max-w-[860px] lg:max-w-[920px] xl:max-w-[980px]">
            {/* 1) Title */}
            <HeroTitle />

            {/* 2) CTA (타이틀과 살짝 붙게) */}
            <div className="mt-6">
              <HeroCTA />
            </div>

            {/* ✅ 3) Title/CTA 묶음 ↔ Chat 간격을 더 띄움 */}
            <div className="mt-16 sm:mt-18 lg:mt-20">
              <ChatSection />
            </div>

            {/* ✅ 4) SocialLinks = 채팅 바로 밑 */}
            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
