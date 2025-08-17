'use client';

import { ChevronUp } from "lucide-react";
import { Button } from "./button";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScrollToTopBtn () {
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false);

  const handleScroll = () => {
    const position = window.scrollY;
    setScrollPosition(position);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!showScrollBtn && scrollPosition > 500) {
      setShowScrollBtn(true);
    } else if (showScrollBtn && scrollPosition < 400) {
      setShowScrollBtn(false);
    }
  }, [scrollPosition]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed right-4 bottom-4">
        <Button
          className={
            cn(
              'transition ease-in-out duration-500 drop-shadow-md bg-white hover:bg-white/75 text-neutral-500',
              { 'opacity-100 translate-y-0': showScrollBtn },
              { 'opacity-0 translate-y-10': !showScrollBtn }
            )}
          variant="secondary"
          onClick={scrollToTop}
          animate={false}
          aria-label="Scroll to the top of the page"
        >
          <ChevronUp color="#000" />
        </Button>
    </div>
  );
};
