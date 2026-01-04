import { invite } from "@/data/invite";
import FallingFlowers from "./FallingFlowers";

export default function CoverHero() {
  const coverImage =
    invite.cover?.image ?? invite.gallery?.[0] ?? "images/cover.jpg";
  const tagline = invite.cover?.tagline ?? "Invite Our Wedding";

  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      <img
        src={coverImage}
        alt="cover"
        className="
            absolute inset-0 
            h-full w-full 
            object-cover 
            object-center
            scale-[1.02]
        "
      />

      <div className="absolute inset-0 bg-black/25" />
      <FallingFlowers count={18} />

      <div className="flex items-center justify-between text-[16px] tracking-[0.35em] text-yellow-100/90 font-light">
        <span>{invite.groom}</span>
        <span>{invite.bride}</span>
      </div>

      <div className="absolute bottom-20 left-0 right-0 z-30 flex justify-center">
        <div
          className="
            handwrite 
            text-[48px] 
            sm:text-[56px]
            leading-none 
            text-yellow-100 
            drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)]
        "
        >
          {tagline}
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-center">
        <div className="text-yellow-100/70 text-xs tracking-widest">SCROLL</div>
      </div>
    </section>
  );
}
