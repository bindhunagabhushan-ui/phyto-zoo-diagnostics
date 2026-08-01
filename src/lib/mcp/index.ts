import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listScansTool from "./tools/list-scans";
import getScanTool from "./tools/get-scan";
import logScanTool from "./tools/log-scan";
import listAlertZonesTool from "./tools/list-alert-zones";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "phytozoo-health-check",
  title: "PhytoZoo Health Check",
  version: "0.1.0",
  instructions:
    "Tools for PhytoZoo Health Check, a plant and animal disease diagnostics app. Use `list_scans` and `get_scan` to review the signed-in user's diagnostic history, `log_scan` to record a new observation, and `list_alert_zones` to check active outbreak zones.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listScansTool, getScanTool, logScanTool, listAlertZonesTool],
});
