import { supabase } from "./supabase";

export async function calculateStreak(userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("assessments")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) return 0;

  const dates = new Set(
    data.map((row) => new Date(row.created_at).toDateString())
  );

  let streak = 0;
  const cursor = new Date();

  while (dates.has(cursor.toDateString())) {
    streak++;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}