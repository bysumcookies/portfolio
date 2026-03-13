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
    <section className="relative h-full w-full">
      <div className="relative h-full w-full min-h-[420px] sm:min-h-[440px] lg:min-h-[460px]">
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
    <main className="flex flex-1 flex-col">
      <div className="flex flex-1 items-start pt-6 pb-3 sm:pt-7 sm:pb-4 lg:pt-8 lg:pb-4">
        <div className="mx-auto flex w-full max-w-[860px] flex-col px-6 sm:max-w-[920px] sm:px-10 lg:max-w-[980px] lg:px-14">
          <HeroTitle />

          <div className="mt-4 sm:mt-5">
            <HeroCTA />
          </div>

          <div className="mt-16 sm:mt-20 lg:mt-24">
            <ChatSection />
          </div>

          <div className="mt-3">
            <SocialLinks />
          </div>
          
        </div>
      </div>
    </main>
  );
}
