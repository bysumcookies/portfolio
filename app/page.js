"use client";

import { useState } from "react";

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
        <div
          className={`absolute inset-0 transition-all duration-500 ease-in-out ${
            isChatOpen
              ? "opacity-0 scale-95 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <ChatClosedPanel onOpenChat={() => setIsChatOpen(true)} />
        </div>

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
      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] flex items-start pt-20 pb-16 sm:pt-24 sm:pb-20">
          <div className="w-full mx-auto px-6 sm:px-10 lg:px-14 max-w-[860px] lg:max-w-[920px] xl:max-w-[980px]">
            <HeroTitle />

            <div className="mt-6">
              <HeroCTA />
            </div>

            <div className="mt-16 sm:mt-18 lg:mt-20">
              <ChatSection />
            </div>

            <div className="mt-6">
              <SocialLinks />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
