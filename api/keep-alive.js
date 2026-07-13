import { createClient } from "@supabase/supabase-js";

// Keep-alive endpoint for a free-tier Supabase project.
// An external cron (cron-job.org) hits this once a day so the database
// registers activity and does not get paused for inactivity.
//
// It must run a REAL query (a static response would not count as activity),
// so it does a minimal read against a table that always exists.

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

export default async function handler(req, res) {
  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Cheapest possible read: one column, one row. `projects` is a real table
    // with a public read policy, so the anon key is enough and no sensitive
    // data is returned. `head: true` avoids transferring the row body.
    const { error } = await supabase
      .from("projects")
      .select("id", { head: true })
      .limit(1);

    if (error) throw error;

    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false, error: error.message });
  }
}
