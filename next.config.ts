/** @type {import('next').NextConfig} */
const repo = "mobile-invite"; // ← GitHub 레포 이름이랑 반드시 동일하게!
const isProd = process.env.NODE_ENV === "production";

// Google Maps API 키 (Google Cloud Console에서 도메인 제한 설정 완료)
// 로컬 개발: 환경 변수 또는 fallback 사용
// 프로덕션: GitHub Secrets에서 주입되거나 fallback 사용 (도메인 제한으로 안전)
const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 
  "AIzaSyC69K-tY1IoQTquNXQjz1QLFoMYOlJWo7g";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: apiKey,
  },
};

module.exports = nextConfig;
