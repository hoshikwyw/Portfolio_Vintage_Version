import { createClient } from "@supabase/supabase-js";

// Keep-alive endpoint for a free-tier Supabase project.
// An external cron (cron-job.org / Vercel Cron) hits this once a day so the
// database registers activity and is not paused for inactivity.
//
// Security notes:
// - The query is fully static (no request input reaches it), so there is no
//   SQL/param injection surface. Supabase's client also parameterizes queries
//   rather than concatenating SQL strings.
// - Reads use the public anon key against a table with a public read policy;
//   the real security boundary is Supabase Row Level Security, not this file.
// - When CRON_SECRET is set, callers must present it — this stops the public
//   URL from being used to spam your database.

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

const CRON_SECRET = process.env.CRON_SECRET;

// Extract a caller-supplied secret from either an `Authorization: Bearer …`
// header (Vercel Cron style) or a `?secret=` query param (cron-job.org style).
function getProvidedSecret(req) {
  const auth = req.headers?.authorization;
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.query?.secret;
}

export default async function handler(req, res) {
  // Harmless hardening headers — this endpoint only ever returns JSON.
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Cache-Control", "no-store");

  // Only reads are meaningful here.
  if (req.method !== "GET" && req.method !== "HEAD") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // Optional shared-secret gate (enabled only when CRON_SECRET is configured).
  if (CRON_SECRET && getProvidedSecret(req) !== CRON_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Cheapest possible read: one column, header-only, one row. Static input.
    const { error } = await supabase
      .from("projects")
      .select("id", { head: true })
      .limit(1);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (error) {
    // Log the detail server-side; never leak it to the caller.
    console.error("keep-alive failed:", error);
    return res.status(500).json({ ok: false, error: "Internal error" });
  }
}
