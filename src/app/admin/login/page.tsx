import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function login(formData: FormData) {
  "use server";
  const password = formData.get("password");
  const next = (formData.get("next") as string) || "/admin";
  const expected = process.env.ADMIN_PASSWORD || "admin";

  if (password === expected) {
    cookies().set("admin_auth", "1", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    redirect(next);
  }
  redirect("/admin/login?error=1");
}

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const error = params.error;
  const next = params.next || "/admin";
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        action={login}
        className="w-full max-w-sm rounded-lg bg-white p-6 shadow"
      >
        <h1 className="mb-4 text-xl font-semibold">Admin Login</h1>
        {error && (
          <p className="mb-3 rounded border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            Invalid password
          </p>
        )}
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          name="password"
          type="password"
          className="mt-1 w-full rounded border border-gray-300 px-3 py-2 focus:border-[#ec2227] focus:outline-none focus:ring-2 focus:ring-[#ec2227]/20"
          placeholder="Enter admin password"
          required
        />
        <button
          type="submit"
          className="mt-4 w-full rounded bg-[#ec2227] px-4 py-2 font-semibold text-white hover:bg-[#c41d22]"
        >
          Login
        </button>
      </form>
    </div>
  );
}
