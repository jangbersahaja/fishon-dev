"use client";

import { useEffect, useRef } from "react";

interface GiscusCommentsProps {
  url: string;
  identifier: string;
  title: string;
}

export default function GiscusComments({
  url,
  identifier,
  title,
}: GiscusCommentsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && !ref.current.hasChildNodes()) {
      const scriptElem = document.createElement("script");
      scriptElem.src = "https://giscus.app/client.js";
      scriptElem.async = true;
      scriptElem.crossOrigin = "anonymous";

      // Configure Giscus
      scriptElem.setAttribute("data-repo", "jangbersahaja/fishon-market");
      scriptElem.setAttribute("data-repo-id", "R_kgDONanwIg"); // Replace with your actual repo ID
      scriptElem.setAttribute("data-category", "Comments");
      scriptElem.setAttribute("data-category-id", "DIC_kwDONanwIs4ClJWi"); // Replace with your category ID
      scriptElem.setAttribute("data-mapping", "pathname");
      scriptElem.setAttribute("data-strict", "0");
      scriptElem.setAttribute("data-reactions-enabled", "1");
      scriptElem.setAttribute("data-emit-metadata", "0");
      scriptElem.setAttribute("data-input-position", "bottom");
      scriptElem.setAttribute("data-theme", "light");
      scriptElem.setAttribute("data-lang", "en");
      scriptElem.setAttribute("data-loading", "lazy");

      ref.current.appendChild(scriptElem);
    }
  }, [url, identifier, title]);

  return (
    <div className="mt-12 border-t border-gray-200 pt-8">
      <h3 className="mb-6 text-lg font-semibold">Comments</h3>
      <div ref={ref} />
      <noscript>
        <p className="text-sm text-gray-600">
          Please enable JavaScript to view comments powered by{" "}
          <a 
            href="https://giscus.app" 
            className="text-[#EC2227] hover:underline"
            target="_blank" 
            rel="noopener noreferrer"
          >
            Giscus
          </a>
          .
        </p>
      </noscript>
    </div>
  );
}
