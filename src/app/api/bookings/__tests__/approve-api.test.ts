import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/prisma", () => {
  return {
    prisma: {
      booking: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      user: {
        findUnique: vi.fn(),
      },
    },
  };
});

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/email", () => ({ sendMail: vi.fn() }));
vi.mock("@/lib/webhook", () => ({ sendWithRetry: vi.fn() }));

import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/database/prisma";
import { POST as approve } from "../approve/route";

function req(body: any, headers?: Record<string, string>) {
  return new Request("http://localhost", {
    method: "POST",
    headers: { "content-type": "application/json", ...(headers || {}) },
    body: JSON.stringify(body),
  });
}

beforeEach(() => {
  vi.resetAllMocks();
  process.env.CAPTAIN_API_SECRET = "set-a-strong-shared-secret";
  (auth as any).mockResolvedValue({ user: { id: "u1", role: "ANGLER" } });
});

describe("POST /api/bookings/approve", () => {
  it("rejects unauthorized without secret and non-staff", async () => {
    const res = await approve(req({ id: "b1" }));
    expect(res.status).toBe(401);
  });

  it("approves with secret header", async () => {
    (prisma.booking.findUnique as any).mockResolvedValue({
      id: "b1",
      status: "PENDING",
      userId: "u1",
      captainCharterId: "c1",
    });
    (prisma.booking.update as any).mockResolvedValue({
      id: "b1",
      status: "APPROVED",
      userId: "u1",
      captainCharterId: "c1",
    });
    const res = await approve(
      req(
        { id: "b1" },
        { "x-captain-api-secret": "set-a-strong-shared-secret" }
      )
    );
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.ok).toBe(true);
  });
});
