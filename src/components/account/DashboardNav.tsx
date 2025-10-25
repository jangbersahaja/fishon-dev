"use client";

import { cn } from "@/lib/utils";
import {
  Calendar,
  Heart,
  HelpCircle,
  LayoutDashboard,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  {
    name: "Overview",
    href: "/account/overview",
    icon: LayoutDashboard,
  },
  {
    name: "Bookings",
    href: "/account/bookings",
    icon: Calendar,
  },
  {
    name: "Reviews",
    href: "/account/reviews",
    icon: Star,
  },
  {
    name: "Favorites",
    href: "/account/favorites",
    icon: Heart,
  },
  {
    name: "Profile",
    href: "/account/profile",
    icon: User,
  },
  {
    name: "Support",
    href: "/account/support",
    icon: HelpCircle,
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1">
      {navigation.map((item) => {
        const isActive =
          pathname === item.href || pathname?.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
              isActive
                ? "bg-[#ec2227] text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
