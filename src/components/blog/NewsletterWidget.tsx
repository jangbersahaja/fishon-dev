"use client";

import { useState } from "react";

export default function NewsletterWidget() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Successfully subscribed!");
        setEmail("");
        setName("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="rounded-lg bg-[#EC2227] p-6 text-white">
      <h3 className="mb-2 text-xl font-bold">Subscribe to Our Newsletter</h3>
      <p className="mb-4 text-sm opacity-90">
        Get the latest fishing tips, charter updates, and exclusive guides delivered to your inbox.
      </p>

      {status === "success" ? (
        <div className="rounded-md bg-white/20 p-3 text-sm">
          ✓ {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-md border-0 px-4 py-2 text-gray-900 placeholder-gray-500"
          />
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-md border-0 px-4 py-2 text-gray-900 placeholder-gray-500"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-md bg-white px-4 py-2 font-semibold text-[#EC2227] transition hover:bg-gray-100 disabled:opacity-50"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe"}
          </button>
          {status === "error" && (
            <p className="text-sm text-white/90">⚠ {message}</p>
          )}
        </form>
      )}
    </div>
  );
}
