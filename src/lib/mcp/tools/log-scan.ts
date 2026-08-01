import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "log_scan",
  title: "Log a scan",
  description:
    "Record a new plant or animal health observation in the signed-in user's scan history.",
  inputSchema: {
    category: z.enum(["plant", "animal"]).describe("Whether the subject is a plant or an animal."),
    species: z.string().optional().describe("Species or crop name."),
    disease_name: z.string().optional().describe("Suspected disease or condition."),
    severity: z.enum(["low", "medium", "high"]).optional().describe("Severity of the condition."),
    symptoms: z.array(z.string()).optional().describe("Observed symptoms."),
    notes: z.string().optional().describe("Free-form notes."),
    location_name: z.string().optional().describe("Where the observation was made."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("scan_history")
      .insert({ ...input, user_id: ctx.getUserId() })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { scan: data },
    };
  },
});
