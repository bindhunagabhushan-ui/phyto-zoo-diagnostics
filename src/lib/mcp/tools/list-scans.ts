import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_scans",
  title: "List scans",
  description:
    "List the signed-in user's most recent plant or animal health scans, newest first.",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("How many scans to return (default 10)."),
    category: z.enum(["plant", "animal"]).optional().describe("Filter by scan category."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit, category }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("scan_history")
      .select(
        "id, category, species, disease_name, severity, confidence_score, location_name, notes, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(limit ?? 10);
    if (category) query = query.eq("category", category);

    const { data, error } = await query;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { scans: data ?? [] },
    };
  },
});
