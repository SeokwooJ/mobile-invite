import { invite } from "@/data/invite";
import FallingFlowers from "./FallingFlowers";

export default function CoverHero() {
  const coverImage =
    invite.cover?.image ?? invite.gallery?.[0] ?? "images/cover.jpg";
  const tagline = invite.cover?.tagline ?? "Two Become One";

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-[#f4f1ec]">
      {/* 디아망 벽지 느낌 오버레이 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.6),rgba(0,0,0,0.05))] z-0" />

      {/* 꽃 흩날림 */}
      <FallingFlowers count={18} />

      {/* 사진 영역 */}
      <div className="relative z-20 flex min-h-[100svh] items-center justify-center px-4">
        <div className="relative w-full max-w-[560px]">
          {/* 사진 */}
          <img
            src={coverImage}
            alt="cover"
            className="
              w-full
              h-auto
              object-contain
              rounded-[18px]
              shadow-[0_28px_80px_rgba(0,0,0,0.25)]
            "
          />

          {/* 사진 안 이름 (필기체 + 골드) */}
          <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
            <span
              className="
    handwrite
    text-[22px]
    text-[#FFF3A3]
    drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]
  "
            >
              {invite.groom}
            </span>

            <span
              className="
    handwrite
    text-[22px]
    text-[#FFF3A3]
    drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]
  "
            >
              {invite.bride}
            </span>
          </div>
        </div>
      </div>

      {/* 하단 메인 필기체 문구 */}
      <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center px-6">
        <div
          className="
    handwrite
    text-[64px]
    sm:text-[76px]
    leading-none
    text-[#FFEE6A]
    drop-shadow-[0_6px_24px_rgba(0,0,0,0.35)]
    text-center
  "
        >
          {tagline}
        </div>
      </div>

      {/* 스크롤 힌트 */}
      <div className="text-[#FFF3A3]/80 text-xs tracking-widest">SCROLL</div>
    </section>
  );
}
