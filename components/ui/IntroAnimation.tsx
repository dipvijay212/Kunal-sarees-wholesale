"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

export function IntroAnimation() {
  const [stage, setStage] = useState<"mounted" | "entering" | "revealing" | "exiting" | "hidden">("mounted");

  useEffect(() => {
    // Check if user already saw the intro during this browser session
    try {
      const alreadySeen = sessionStorage.getItem("ks_intro_seen");
      if (alreadySeen === "1") {
        const tHide = setTimeout(() => setStage("hidden"), 0);
        return () => clearTimeout(tHide);
      }
    } catch {
      // Ignore if sessionStorage is unavailable
    }

    // Sequence timer:
    // 0ms: mounted & entering
    // 100ms: logo & brand reveal starts
    // 1600ms: exit transition begins (smooth fade & scale lift)
    // 2300ms: completely hidden / unmounted
    const tEnter = setTimeout(() => setStage("revealing"), 80);
    const tExit = setTimeout(() => setStage("exiting"), 1700);
    const tDone = setTimeout(() => {
      setStage("hidden");
      try {
        sessionStorage.setItem("ks_intro_seen", "1");
      } catch {}
    }, 2350);

    return () => {
      clearTimeout(tEnter);
      clearTimeout(tExit);
      clearTimeout(tDone);
    };
  }, []);

  const handleDismiss = () => {
    setStage("exiting");
    try {
      sessionStorage.setItem("ks_intro_seen", "1");
    } catch {}
    setTimeout(() => setStage("hidden"), 650);
  };

  if (stage === "hidden") {
    return null;
  }

  const isRevealing = stage === "revealing" || stage === "exiting";
  const isExiting = stage === "exiting";

  return (
    <div
      role="dialog"
      aria-label="Welcome to Kunal Sarees"
      onClick={handleDismiss}
      className={cn(
        "fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#24060A] text-cream transition-all duration-700 ease-out select-none cursor-pointer",
        isExiting ? "opacity-0 scale-[1.03] pointer-events-none" : "opacity-100 scale-100"
      )}
    >
      {/* Radial ambient gold lighting glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(214,184,120,0.18)_0%,rgba(56,12,20,0.85)_55%,rgba(36,6,10,1)_100%)]"
      />

      {/* Subtle traditional gold background texture lines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#D6B878_1px,transparent_1px)] [background-size:24px_24px]"
      />

      {/* Top Skip Button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleDismiss();
        }}
        className="absolute top-5 right-5 z-20 rounded-full border border-gold-light/30 bg-black/30 px-3.5 py-1 text-[0.6875rem] font-semibold tracking-widest text-gold-light/90 uppercase backdrop-blur-md transition-all hover:border-gold-light hover:bg-gold-light hover:text-maroon-dark"
      >
        स्किप करें &rarr;
      </button>

      {/* Main Animated Luxury Emblem & Typography Container */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        
        {/* Emblem Mark with Animated Concentric Gold Rings */}
        <div className="relative flex items-center justify-center">
          {/* Outer rotating dashed mandala ring */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute size-32 sm:size-40 rounded-full border border-dashed border-gold/40 transition-all duration-1000 ease-out animate-[spin_20s_linear_infinite]",
              isRevealing ? "scale-100 opacity-80" : "scale-75 opacity-0"
            )}
          />

          {/* Middle shimmering luxury ring */}
          <div
            aria-hidden="true"
            className={cn(
              "absolute size-28 sm:size-34 rounded-full border-2 border-gold-light/50 transition-all duration-700 ease-out shadow-[0_0_25px_rgba(214,184,120,0.3)]",
              isRevealing ? "scale-100 opacity-100" : "scale-80 opacity-0"
            )}
          />

          {/* KS Brand Mark Logo */}
          <div
            className={cn(
              "relative size-20 sm:size-24 rounded-full bg-cream p-1 shadow-2xl ring-2 ring-gold transition-all duration-700 delay-100 ease-out",
              isRevealing ? "scale-100 opacity-100" : "scale-50 opacity-0"
            )}
          >
            <Image
              src={siteConfig.brand.logo.src}
              alt={siteConfig.name}
              width={160}
              height={160}
              priority
              className="size-full rounded-full object-cover"
            />
          </div>
        </div>

        {/* Small Eyebrow: Surat Direct B2B Wholesale */}
        <div
          className={cn(
            "mt-6 flex items-center gap-2 text-[0.625rem] sm:text-xs font-semibold tracking-[0.2em] text-gold-light uppercase transition-all duration-700 delay-200 ease-out",
            isRevealing ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          <span className="h-px w-4 sm:w-6 bg-gold-light/60" />
          <span>सूरत डायरेक्ट होलसेल</span>
          <span className="h-px w-4 sm:w-6 bg-gold-light/60" />
        </div>

        {/* Main Title: KUNAL SAREES */}
        <h1
          className={cn(
            "mt-3 font-serif text-3xl sm:text-5xl font-bold tracking-[0.16em] sm:tracking-[0.24em] text-transparent bg-clip-text bg-gradient-to-r from-cream via-[#FFF0D4] to-gold-light uppercase transition-all duration-700 delay-300 ease-out drop-shadow-sm",
            isRevealing ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
          )}
        >
          {siteConfig.name}
        </h1>

        {/* Tagline: Premium Wholesale Sarees */}
        <p
          className={cn(
            "mt-2 text-xs sm:text-sm font-medium tracking-[0.16em] sm:tracking-[0.2em] text-cream/85 transition-all duration-700 delay-400 ease-out",
            isRevealing ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
        >
          प्रीमियम होलसेल साड़ियों का खूबसूरत कलेक्शन
        </p>

        {/* Elegant Animated Gold Loading Shimmer Line */}
        <div
          className={cn(
            "mt-8 w-36 sm:w-48 h-[2px] rounded-full bg-white/10 overflow-hidden transition-all duration-700 delay-450",
            isRevealing ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
        >
          <div
            className={cn(
              "h-full bg-gradient-to-r from-gold via-gold-light to-white transition-all duration-[1400ms] ease-out",
              isRevealing ? "w-full" : "w-0"
            )}
          />
        </div>

        {/* Subtle touch/click hint */}
        <span
          className={cn(
            "mt-4 text-[0.6875rem] font-medium tracking-wider text-gold-light/60 transition-all duration-700 delay-500",
            isRevealing ? "opacity-80" : "opacity-0"
          )}
        >
          साइट देखने के लिए कहीं भी टच करें
        </span>
      </div>
    </div>
  );
}
