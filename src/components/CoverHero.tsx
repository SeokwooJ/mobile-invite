"use client";

import { invite } from "@/data/invite";
import FallingFlowers from "./FallingFlowers";
import { useEffect, useState } from "react";

export default function CoverHero() {
  const rawCoverImage =
    invite.cover?.image ?? invite.gallery?.[0] ?? "images/cover.jpg";
  const [coverImage, setCoverImage] = useState(rawCoverImage);
  const [viewportHeight, setViewportHeight] = useState("100svh");

  // basePath 자동 감지 및 이미지 경로 처리
  useEffect(() => {
    if (typeof window === "undefined") {
      setCoverImage(rawCoverImage);
      return;
    }

    const hostname = window.location.hostname;
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0";

    let processedImage = rawCoverImage;
    // 절대 경로가 아니면 basePath 추가
    if (
      processedImage.startsWith("/") &&
      !processedImage.startsWith("//") &&
      !processedImage.startsWith("http")
    ) {
      // 로컬 개발 환경이 아닌 경우 basePath 추가
      if (!isLocalhost) {
        processedImage = `/mobile-invite${processedImage}`;
      }
    } else if (!processedImage.startsWith("/") && !processedImage.startsWith("http")) {
      // 상대 경로인 경우
      if (!isLocalhost) {
        processedImage = `/mobile-invite/${processedImage}`;
      } else {
        processedImage = `/${processedImage}`;
      }
    }

    setCoverImage(processedImage);
  }, [rawCoverImage]);

  // Cover 이미지 preload
  useEffect(() => {
    if (!coverImage) return;
    
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = coverImage;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [coverImage]);

  useEffect(() => {
    // 모바일에서 스크롤 시 크기 변경 방지를 위해 초기 높이 고정
    if (typeof window === "undefined") return;

    const isMobile = window.innerWidth < 640; // sm breakpoint

    if (isMobile) {
      // 초기 높이를 한 번만 설정하고 절대 변경하지 않음
      const initialHeight = window.innerHeight;
      setViewportHeight(`${initialHeight}px`);

      // CSS 변수로도 설정하여 더 확실하게 고정
      document.documentElement.style.setProperty(
        "--initial-vh",
        `${initialHeight}px`
      );

      // 스크롤 이벤트를 감지하되 높이는 변경하지 않음 (디버깅용)
      let lastHeight = initialHeight;
      const checkHeight = () => {
        const currentHeight = window.innerHeight;
        // 높이가 변경되었어도 무시하고 초기 높이 유지
        if (Math.abs(currentHeight - lastHeight) > 10) {
          // 리사이즈만 반영 (주소창 변화는 무시)
          lastHeight = currentHeight;
        }
      };

      // 리사이즈 이벤트만 처리 (스크롤로 인한 높이 변화는 무시)
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          // 실제 리사이즈만 반영 (화면 회전 등)
          const newHeight = window.innerHeight;
          if (Math.abs(newHeight - initialHeight) > 50) {
            setViewportHeight(`${newHeight}px`);
            document.documentElement.style.setProperty(
              "--initial-vh",
              `${newHeight}px`
            );
          }
        }, 150);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);
      };
    } else {
      setViewportHeight("100svh");
    }
  }, []);

  const handleScrollDown = () => {
    // ID로 직접 다음 섹션 찾기
    const coverSection = document.getElementById("cover-section");
    if (coverSection) {
      coverSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // ID를 찾을 수 없으면 화면 높이만큼 스크롤
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };

  return (
    <section
      className="relative w-full overflow-hidden bg-[#faf9f6]"
      style={{
        height: viewportHeight,
        minHeight: viewportHeight,
        maxHeight: viewportHeight,
      }}
    >
      {/* 편지지 느낌의 배경 */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(250,249,246,0.95),rgba(240,238,230,0.98))] z-0" />

      {/* 편지지 텍스처 */}
      <div
        className="absolute inset-0 opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* 꽃 흩날림 */}
      <FallingFlowers count={18} />

      {/* 사진 영역 */}
      <div className="relative z-20 flex items-center justify-center px-0 sm:px-4 py-0 sm:py-20 h-full">
        <div
          className="relative w-full sm:h-auto sm:max-w-[560px]"
          style={{
            height: "100%",
          }}
        >
          {/* 사진 */}
          <div className="relative w-full h-full">
            <img
              src={coverImage}
              alt="cover"
              fetchPriority="high"
              className="
                w-full
                h-full
                object-cover
                sm:rounded-2xl
                sm:shadow-[0_20px_60px_rgba(0,0,0,0.15)]
                sm:border-2
                sm:border-[#e8e3d8]
              "
              style={{
                willChange: "transform",
                transform: "translateZ(0)",
                backfaceVisibility: "hidden",
              }}
            />

            {/* 사진 안 이름 (우아한 필기체) */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 flex justify-between pointer-events-none">
              <span
                className="
                  handwrite
                  text-[22px]
                  sm:text-[28px]
                  text-white
                  drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                  font-medium
                "
              >
                {invite.groom}
              </span>

              <span
                className="
                  handwrite
                  text-[22px]
                  sm:text-[28px]
                  text-white
                  drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                  font-medium
                "
              >
                {invite.bride}
              </span>
            </div>

            {/* We're getting married! 텍스트 애니메이션 */}
            <div className="absolute top-4 sm:top-8 left-1/2 transform -translate-x-1/2 pointer-events-none w-full px-4 sm:px-6">
              <div className="text-center">
                <span
                  className="
                    handwrite
                    text-[28px]
                    sm:text-[40px]
                    text-white
                    drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)]
                    font-bold
                    inline-block
                    opacity-0
                    animate-[writeReveal_4s_ease-out_1.5s_forwards]
                  "
                  style={{ fontWeight: 700 }}
                >
                  We're getting married!
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 스크롤 버튼 */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center gap-2 text-[#8b7a6a]/70 hover:text-[#8b7a6a] transition-colors group cursor-pointer"
        aria-label="다음 섹션으로 스크롤"
      >
        <span className="text-xs tracking-widest">SCROLL</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 animate-bounce group-hover:scale-110 transition-transform"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
          />
        </svg>
      </button>
    </section>
  );
}
