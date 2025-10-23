"use client";

import { useAuthModal } from "@/components/auth/AuthModalContext";
import { useSession } from "next-auth/react";

interface YourDetailsCardProps {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  disabled?: boolean;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
}

export default function YourDetailsCard({
  firstName,
  lastName,
  email,
  phone,
  disabled = false,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
}: YourDetailsCardProps) {
  const { data: session } = useSession();
  const { openModal } = useAuthModal();
  const isLoggedIn = !!session?.user;

  return (
    <section className="p-5 bg-white border rounded-2xl border-black/10 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold sm:text-lg">Your Details</h2>
      </div>

      {!isLoggedIn && (
        <div className="p-3 mb-4 border rounded-lg bg-amber-50 border-amber-200">
          <div className="flex items-center gap-1 text-sm text-amber-800">
            <button
              type="button"
              onClick={() => openModal("signin")}
              className="text-sm font-bold cursor-pointer hover:underline"
            >
              Sign in
            </button>
            <span>to autofill your details and track your bookings.</span>
          </div>
        </div>
      )}

      <div className={`space-y-4 ${disabled ? "opacity-60" : ""}`}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="block mb-2 font-medium text-slate-800">
              First name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(e) => onFirstNameChange(e.target.value)}
              placeholder="Your first name"
              required
              disabled={disabled}
              className="w-full px-4 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:border-transparent transition-shadow"
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-2 font-medium text-slate-800">
              Last name <span className="text-red-500">*</span>
            </span>
            <input
              type="text"
              value={lastName}
              onChange={(e) => onLastNameChange(e.target.value)}
              placeholder="Your last name"
              required
              disabled={disabled}
              className="w-full px-4 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:border-transparent transition-shadow"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="block mb-2 font-medium text-slate-800">
              Email <span className="text-red-500">*</span>
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={disabled}
              className="w-full px-4 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:border-transparent transition-shadow"
            />
          </label>

          <label className="block text-sm">
            <span className="block mb-2 font-medium text-slate-800">
              Phone number
            </span>
            <input
              type="tel"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              placeholder="+60 12-345 6789"
              disabled={disabled}
              className="w-full px-4 py-2.5 border border-black/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ec2227] focus:border-transparent transition-shadow"
            />
          </label>
        </div>
      </div>
    </section>
  );
}
