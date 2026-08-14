import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

interface HealthStatus {
  ok: boolean;
  timestamp: string;
  services: {
    database: {
      status: "connected" | "error";
      type: "sandbox-postgresql";
    };
    supabase: {
      status: "configured" | "not-configured";
      note: string;
    };
  };
  project: "ZAIN SUPER MART";
}

export async function GET() {
  const status: HealthStatus = {
    ok: false,
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: "error",
        type: "sandbox-postgresql",
      },
      supabase: {
        status: "not-configured",
        note: "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
      },
    },
    project: "ZAIN SUPER MART",
  };

  // Check sandbox PostgreSQL (used by platform for basic health)
  try {
    await db.execute(sql`select 1`);
    status.services.database.status = "connected";
  } catch {
    status.services.database.status = "error";
  }

  // Check Supabase configuration
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (
    supabaseUrl &&
    supabaseKey &&
    supabaseUrl !== "https://placeholder.supabase.co" &&
    supabaseUrl.includes("supabase.co")
  ) {
    status.services.supabase.status = "configured";
    status.services.supabase.note = "Supabase project connected";
  }

  // Overall health is OK if sandbox database is connected
  // (Supabase configuration is separate concern)
  status.ok = status.services.database.status === "connected";

  return Response.json(status, {
    status: status.ok ? 200 : 500,
  });
}
