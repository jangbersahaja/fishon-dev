"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginInner() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // Force post-auth navigation to /book across all sign-in flows
  const callbackUrl = "/book";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    if (res?.error) {
      setError("Invalid email or password");
      return;
    }
    router.push(res?.url || callbackUrl);
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Sign in</h1>
      {/* Social auth */}
      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full rounded border border-black/20 py-2 mb-4 flex items-center justify-center gap-2 hover:bg-black/5"
      >
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
        >
          <path
            d="M12 12v4.8h6.86c-.3 1.86-2.07 5.46-6.86 5.46-4.14 0-7.52-3.42-7.52-7.66s3.38-7.66 7.52-7.66c2.36 0 3.94 1 4.84 1.86l3.3-3.18C18.74 3.3 15.74 2 12 2 5.72 2 .6 7.14.6 13.6c0 6.46 5.12 11.6 11.4 11.6 6.58 0 10.9-4.62 10.9-11.14 0-.74-.08-1.3-.18-1.86H12z"
            fill="#4285F4"
          />
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-2 my-4">
        <div className="h-px bg-black/10 flex-1" />
        <span className="text-xs text-black/50">or</span>
        <div className="h-px bg-black/10 flex-1" />
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 w-full rounded border px-3 py-2"
            required
          />
        </div>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-black text-white py-2"
        >
          Sign in
        </button>
      </form>
      <p className="mt-4 text-sm">
        No account?{" "}
        <a className="underline" href="/register">
          Create one
        </a>
      </p>
    </main>
  );
}

export default function LoginPage() {
  // Suspense wrapper kept for parity; safe even without useSearchParams
  return (
    <Suspense fallback={<main className="p-6">Loading…</main>}>
      <LoginInner />
    </Suspense>
  );
}
