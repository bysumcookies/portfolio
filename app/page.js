"use client";

import { useState } from "react";
import Navbar from "../components/Navbar";
import PortfolioPanel from "../components/PortfolioPanel";
import ChatPanel from "../components/ChatPanel";
import HeroVisualCard from "../components/HeroVisualCard";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col">

      <Navbar />

      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] flex items-center">
          <div className="w-full max-w-6xl mx-auto px-6 sm:px-8">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-14 items-center">
              {/* Left - Intro */}
              <PortfolioPanel />

              {/* Right - Visual or Chat */}
              <div className="relative w-full max-w-[520px] mx-auto min-h-[460px]">
                <div 
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    isChatOpen 
                      ? "opacity-0 scale-95 pointer-events-none" 
                      : "opacity-100 scale-100"
                  }`}
                >
                  <HeroVisualCard onOpenChat={() => setIsChatOpen(true)} />
                </div>

                <div 
                  className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                    isChatOpen 
                      ? "opacity-100 scale-100" 
                      : "opacity-0 scale-95 pointer-events-none"
                  }`}
                >
                  <ChatPanel onClose={() => setIsChatOpen(false)} />
                </div>
              </div>
            </div>
          </div>
            </div>
      </main>

    </div>
  );
}
