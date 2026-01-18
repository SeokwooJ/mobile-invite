"use client";

import { useEffect, useRef, useState } from "react";

export default function Section({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            // 한 번만 애니메이션을 트리거하기 위해 관찰 중단
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // 10%가 보이면 트리거
        rootMargin: "0px 0px -50px 0px", // 하단 50px 전에 트리거
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`px-6 py-16 max-w-2xl mx-auto bg-[#faf9f6] border-y border-[#e8e3d8]/50 transition-all duration-700 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-8"
      }`}
    >
      {children}
    </section>
  );
}
