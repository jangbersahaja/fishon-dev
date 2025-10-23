"use client";

import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useEffect } from "react";

export default function LoginClient() {
  const { openModal } = useAuthModal();

  useEffect(() => {
    openModal("signin", undefined, { showHomeButton: true });
  }, [openModal]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#ec2227]">
      <div className="text-center">
        {/* Loading spinner */}
        <div
          className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-white border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
        <p className="mt-4 text-white text-sm font-medium">
          Loading sign in...
        </p>
      </div>
    </main>
  );
}
