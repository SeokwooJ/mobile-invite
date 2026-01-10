"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Section from "./Section";
import { invite } from "@/data/invite";
import "leaflet/dist/leaflet.css";

// Leaflet은 SSR을 지원하지 않으므로 동적 import로 클라이언트에서만 로드
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);

// Leaflet 마커 아이콘 설정은 useEffect에서 처리

function LinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="block w-full rounded-xl border-2 border-[#d4c4b0] px-4 py-3 text-sm text-center text-[#6b5d4a] hover:bg-[#f0ede5] transition-colors font-light"
    >
      {label}
    </a>
  );
}

export default function Location() {
  const loc = invite.location;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Leaflet 마커 아이콘 설정 (Next.js에서 필요)
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        delete (L.default.Icon.Default.prototype as any)._getIconUrl;
        L.default.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
          iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
          shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
        });
      });
    }
  }, []);

  // 네이버지도 링크용 URL
  const naverMapLinkUrl =
    loc.naverMapUrl ||
    `https://map.naver.com/v5/search/${encodeURIComponent(loc.address)}`;

  // 카카오맵 Embed URL (좌표 기반)
  const kakaoMapEmbedUrl =
    loc.latitude && loc.longitude
      ? `https://map.kakao.com/link/map/${encodeURIComponent(loc.address)},${
          loc.latitude
        },${loc.longitude}`
      : null;

  return (
    <Section>
      <div className="text-center space-y-6">
        <h2
          className="text-2xl font-light text-[#5a4a3a] tracking-wide"
          style={{ fontFamily: "serif" }}
        >
          오시는 길
        </h2>
        <div className="w-16 h-px bg-[#d4c4b0] mx-auto"></div>

        <div className="text-base text-center text-[#6b5d4a] space-y-3 font-light mb-6">
          <p className="text-lg font-normal">{invite.venue}</p>
          <p className="text-sm text-[#8b7a6a]">{loc.address}</p>
        </div>

        {/* 네이버지도 링크 + Leaflet 지도 미리보기 */}
        {isMounted ? (
          <div className="space-y-4">
            {/* 네이버지도 링크 (클릭 가능한 카드) - 가장 위에 표시 */}
            <a
              href={naverMapLinkUrl}
              target="_blank"
              rel="noreferrer"
              className="block rounded-xl overflow-hidden border-2 border-[#03C75A] shadow-md bg-white relative hover:shadow-lg transition-all group"
            >
              <div className="w-full h-[160px] bg-[linear-gradient(to_bottom_right,#03C75A,#02B350)] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22 fill=%22%23fff%22/%3E%3C/svg%3E')]"></div>
                <div className="relative text-center z-10 px-4">
                  <div className="text-white text-xl font-bold mb-1">
                    네이버지도
                  </div>
                  <div className="text-white/95 text-sm mb-3">
                    {loc.address}
                  </div>
                  <div className="bg-white/25 backdrop-blur-sm rounded-full px-5 py-2 text-xs text-white font-medium group-hover:bg-white/35 transition-colors inline-block">
                    클릭하여 네이버지도에서 보기 →
                  </div>
                </div>
              </div>
            </a>

            {/* Leaflet 지도 미리보기 - API 키 불필요, 모바일에서도 작동 */}
            {loc.latitude && loc.longitude ? (
              <div className="space-y-2">
                <div className="rounded-xl overflow-hidden border-2 border-[#e8e3d8] shadow-md bg-[#f5f5f5] relative" style={{ height: "400px", width: "100%" }}>
                  {isMounted && (
                    <MapContainer
                      center={[loc.latitude!, loc.longitude!]}
                      zoom={16}
                      style={{ height: "100%", width: "100%", zIndex: 0 }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={[loc.latitude!, loc.longitude!]}>
                        <Popup>
                          <div className="text-sm font-semibold text-[#5a4a3a]">
                            {loc.address}
                          </div>
                        </Popup>
                      </Marker>
                    </MapContainer>
                  )}
                </div>
                {kakaoMapEmbedUrl && (
                  <a
                    href={kakaoMapEmbedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full rounded-xl border-2 border-[#FEE500] bg-[#FEE500] px-4 py-3 text-sm text-center text-black hover:bg-[#FDD835] transition-colors font-medium"
                  >
                    카카오맵에서 자세히 보기 →
                  </a>
                )}
              </div>
            ) : (
              // 좌표가 없을 경우 링크 카드만 표시
              kakaoMapEmbedUrl && (
                <a
                  href={kakaoMapEmbedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-xl overflow-hidden border-2 border-[#FEE500] shadow-md bg-white relative hover:shadow-lg transition-all group"
                >
                  <div className="w-full h-[160px] bg-[linear-gradient(to_bottom_right,#FEE500,#FDD835)] flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22 fill=%22%23000%22/%3E%3C/svg%3E')]"></div>
                    <div className="relative text-center z-10 px-4">
                      <div className="text-black text-xl font-bold mb-1">
                        카카오맵
                      </div>
                      <div className="text-black/90 text-sm mb-3">
                        {loc.address}
                      </div>
                      <div className="bg-black/20 backdrop-blur-sm rounded-full px-5 py-2 text-xs text-black font-medium group-hover:bg-black/30 transition-colors inline-block">
                        클릭하여 카카오맵에서 보기 →
                      </div>
                    </div>
                  </div>
                </a>
              )
            )}
          </div>
        ) : (
          <div className="w-full h-[400px] flex items-center justify-center text-[#8b7a6a] rounded-xl border-2 border-[#e8e3d8] bg-[#f5f5f5] mb-6">
            지도를 불러오는 중...
          </div>
        )}

        {/* 지도 선택 버튼 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {loc.naverMapUrl && (
            <LinkButton href={loc.naverMapUrl} label="네이버지도" />
          )}
          {loc.kakaoMapUrl && (
            <LinkButton href={loc.kakaoMapUrl} label="카카오맵" />
          )}
          <LinkButton href={loc.googleMapUrl} label="구글지도" />
        </div>

        <div className="mt-6 text-xs text-[#8b7a6a] leading-relaxed">
          <p className="mb-1">
            * 지도 버튼을 누르면 해당 앱/웹으로 이동합니다.
          </p>
          <p>* 지도가 보이지 않을 경우 위 버튼을 눌러주세요.</p>
        </div>
      </div>
    </Section>
  );
}
