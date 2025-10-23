import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/database/prisma", () => {
  return {
    prisma: {
      booking: {
        updateMany: vi.fn(),
      },
    },
  };
});

import { prisma } from "@/lib/database/prisma";
import { POST as expire } from "../expire/route";

function req(secret?: string) {
  return new Request("http://localhost", {
    method: "POST",
    headers: secret ? { "x-expire-secret": secret } : undefined,
  });
}

beforeEach(() => vi.resetAllMocks());

describe("POST /api/bookings/expire", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    process.env = { ...OLD_ENV };
    process.env.BOOKINGS_EXPIRE_SECRET = "s3cret";
  });

  it("401 when secret missing or invalid", async () => {
    const r1 = await expire(req());
    expect(r1.status).toBe(401);
    const r2 = await expire(req("wrong"));
    expect(r2.status).toBe(401);
  });

  it("expires pending bookings", async () => {
    (prisma.booking.updateMany as any).mockResolvedValue({ count: 3 });
    const res = await expire(req("s3cret"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.expired).toBe(3);
    expect(prisma.booking.updateMany).toHaveBeenCalled();
  });
});
