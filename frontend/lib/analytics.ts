import { supabase } from "./supabase";

function getSessionId(): string {
  if (typeof window === "undefined") return "server";

  let id = sessionStorage.getItem("chael-session-id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("chael-session-id", id);
  }
  return id;
}

export async function logEvent(eventType: string, metadata?: Record<string, unknown>) {
  try {
    const sessionId = getSessionId();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    await supabase.from("usage_events").insert({
      session_id: sessionId,
      user_id: user?.id ?? null,
      event_type: eventType,
      metadata: metadata ?? null,
    });
  } catch (error) {
    console.error("Analytics log error:", error);
  }
}