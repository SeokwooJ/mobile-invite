"use client";

import { useEffect } from "react";
import Section from "./Section";

export default function Comments() {
  useEffect(() => {
    // 이미 스크립트가 있으면 중복 로드 방지
    if (document.querySelector('script[data-giscus="true"]')) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-giscus", "true");

    // ✅ 여기 4개는 giscus 설정 페이지에서 발급받은 값으로 교체해야 함
    script.setAttribute("data-repo", "Jangsukwoo/mobile-invite");
    script.setAttribute("data-repo-id", "REPO_ID_HERE");
    script.setAttribute("data-category", "General");
    script.setAttribute("data-category-id", "CATEGORY_ID_HERE");

    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "ko");
    script.setAttribute("data-loading", "lazy");

    document.body.appendChild(script);
  }, []);

  return (
    <Section>
      <h2 className="text-lg font-semibold text-center mb-6">축하 메시지</h2>
      <div className="giscus" />
      <p className="text-xs text-gray-500 text-center mt-6">
        * 댓글 작성은 GitHub 로그인이 필요할 수 있어요.
      </p>
    </Section>
  );
}
