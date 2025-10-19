import type { BackendCharter } from "./captain-api";
import { prismaCaptain } from "./prisma-captain";

/**
 * Read-only DB accessors for public charter data exposed via SQL views.
 *
 * This expects the Fishon Captain database to define a view named
 * `v_public_charters` with shape:
 *   id text PRIMARY KEY,
 *   charter jsonb  -- JSON matching BackendCharter
 *
 * See fishon-captain/docs for the SQL to create these views.
 */

export function isCaptainDbConfigured(): boolean {
  return !!process.env.CAPTAIN_DATABASE_URL;
}

export async function viewExists(): Promise<boolean> {
  if (!isCaptainDbConfigured()) return false;
  // Avoid using to_regclass to prevent regclass deserialization issues in some drivers
  try {
    const rows = await prismaCaptain.$queryRaw<Array<{ exists: boolean }>>`
      select exists(
        select 1 from information_schema.views
        where table_schema = 'public' and table_name = 'v_public_charters'
      ) as "exists"
    `;
    return !!rows?.[0]?.exists;
  } catch (e) {
    console.error("Error checking for public.v_public_charters existence", e);
    // Be conservative: report not existing so callers can provide clear guidance
    return false;
  }
}

function missingViewError(): Error {
  return new Error(
    "Required view public.v_public_charters not found. Please run the SQL in fishon-captain/docs/plan-data-market-reader-views.md to create it and grant SELECT to market_reader."
  );
}

export async function fetchChartersFromDb(
  limit = 100
): Promise<BackendCharter[]> {
  if (!isCaptainDbConfigured()) return [];

  // Use json aggregation from the view; each row contains a `charter` jsonb column
  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(500, Math.floor(limit)))
    : 100;
  const exists = await viewExists();
  if (!exists) throw missingViewError();
  try {
    // Prefer materialized view (if present), then list view, then full view
    const mvExists = await prismaCaptain.$queryRaw<Array<{ exists: boolean }>>`
      select exists(
        select 1 from pg_matviews where schemaname = 'public' and matviewname = 'mv_public_charters_list'
      ) as "exists"
    `;

    if (mvExists?.[0]?.exists) {
      const rows = await prismaCaptain.$queryRaw<
        Array<{ charter: BackendCharter }>
      >`
        select charter from public.mv_public_charters_list limit ${safeLimit}
      `;
      return rows.map((r) => r.charter);
    }

    const listViewExists = await prismaCaptain.$queryRaw<
      Array<{ exists: boolean }>
    >`
      select exists(
        select 1 from information_schema.views
        where table_schema = 'public' and table_name = 'v_public_charters_list'
      ) as "exists"
    `;

    if (listViewExists?.[0]?.exists) {
      const rows = await prismaCaptain.$queryRaw<
        Array<{ charter: BackendCharter }>
      >`
        select charter from public.v_public_charters_list limit ${safeLimit}
      `;
      return rows.map((r) => r.charter);
    }

    const rows = await prismaCaptain.$queryRaw<
      Array<{ charter: BackendCharter }>
    >`
      select charter from public.v_public_charters order by (charter->>'name') asc limit ${safeLimit}
    `;
    return rows.map((r) => r.charter);
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("42P01") || msg.includes("does not exist")) {
      throw missingViewError();
    }
    throw e;
  }
}

export async function fetchCharterByIdFromDb(
  id: string
): Promise<BackendCharter | null> {
  if (!isCaptainDbConfigured()) return null;
  const exists = await viewExists();
  if (!exists) throw missingViewError();
  try {
    const rows = await prismaCaptain.$queryRaw<
      Array<{ charter: BackendCharter }>
    >`
      select charter from public.v_public_charters where id = ${id} limit 1
    `;
    return rows.length ? rows[0].charter : null;
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("42P01") || msg.includes("does not exist")) {
      throw missingViewError();
    }
    throw e;
  }
}

export async function searchChartersFromDb(
  criteria: {
    location?: string;
    charterType?: string;
    q?: string; // generic text search on name
  },
  limit = 100
): Promise<BackendCharter[]> {
  if (!isCaptainDbConfigured()) return [];
  const safeLimit = Number.isFinite(limit)
    ? Math.max(1, Math.min(500, Math.floor(limit)))
    : 100;

  const exists = await viewExists();
  if (!exists) throw missingViewError();

  // Normalize inputs: undefined -> null for SQL checks
  const stateOrDistrict = criteria.location ?? null;
  const charterType = criteria.charterType ?? null;
  const q = criteria.q ?? criteria.location ?? null;

  try {
    // Prefer list view for filtering common facets
    const listViewExists = await prismaCaptain.$queryRaw<
      Array<{ exists: boolean }>
    >`
      select exists(
        select 1 from information_schema.views
        where table_schema = 'public' and table_name = 'v_public_charters_list'
      ) as "exists"
    `;

    if (listViewExists?.[0]?.exists) {
      const rows = await prismaCaptain.$queryRaw<
        Array<{ charter: BackendCharter }>
      >`
        select charter from public.v_public_charters_list
        where
          (${stateOrDistrict} is null or (charter->>'state') ilike '%' || ${stateOrDistrict} || '%' or (charter->>'district') ilike '%' || ${stateOrDistrict} || '%')
          and (${charterType} is null or (charter->>'charterType') ilike '%' || ${charterType} || '%')
          and (${q} is null or (charter->>'name') ilike '%' || ${q} || '%')
        limit ${safeLimit}
      `;
      return rows.map((r) => r.charter);
    }

    // Fall back to full view (same filters); heavier payload but broader compatibility
    const rows = await prismaCaptain.$queryRaw<
      Array<{ charter: BackendCharter }>
    >`
      select charter from public.v_public_charters
      where
        (${stateOrDistrict} is null or (charter->>'state') ilike '%' || ${stateOrDistrict} || '%' or (charter->>'district') ilike '%' || ${stateOrDistrict} || '%')
        and (${charterType} is null or (charter->>'charterType') ilike '%' || ${charterType} || '%')
        and (${q} is null or (charter->>'name') ilike '%' || ${q} || '%')
      limit ${safeLimit}
    `;
    return rows.map((r) => r.charter);
  } catch (e: any) {
    const msg = String(e?.message || e);
    if (msg.includes("42P01") || msg.includes("does not exist")) {
      throw missingViewError();
    }
    throw e;
  }
}
