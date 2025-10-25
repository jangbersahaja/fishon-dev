"use client";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { DashboardNav } from "./DashboardNav";

type DashboardHeaderProps = {
  user: {
    name?: string;
    image?: string;
    [key: string]: any;
  };
};

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className=" lg:hidden">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-4 h-16 bg-[#ec2227]">
        <Link
          href="/home"
          className="flex items-center gap-2"
          aria-label="Fishon.my home"
        >
          <span className="relative h-14 w-28">
            <Image
              src="/images/logos/fishon-logo-white.png"
              alt="Fishon"
              sizes="200px"
              fill
              className="object-contain"
              priority
            />
          </span>
        </Link>
        {user.image ? (
          <div className="relative w-10 h-10 overflow-hidden rounded-full ring ring-white">
            <Image
              src={user.image}
              fill
              sizes="100px"
              alt="User profile picture"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full text-[#ec2227] flex items-center justify-center bg-white font-semibold">
            {user.name?.[0]?.toUpperCase() || "A"}
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold text-gray-900">Dashboard</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="pb-4 mt-4">
            <DashboardNav />
          </div>
        )}
      </div>
    </div>
  );
}
