// Mock registry for local dev. In production this comes from GET /agents.
// Adding an agent = adding one row. No UI change needed.
export const DOMAINS = {
  MANUFACTURING: "Manufacturing",
  QUALITY: "Quality",
  SUPPLY: "Supply chain",
  ENGINEERING: "Engineering",
  COMMERCIAL: "Commercial",
};
export const ROLE_LABELS = { ...DOMAINS, ADMIN: "Admin (all)" };

const SOURCES = {
  MANUFACTURING: ["MES", "Historian", "SAP"],
  QUALITY: ["LIMS", "QMS", "eBR"],
  SUPPLY: ["SAP", "WMS"],
  ENGINEERING: ["CMMS", "Calibration DB"],
  COMMERCIAL: ["ERP", "Demand planning"],
};
const DOMAIN_ACCESS = {
  MANUFACTURING: ["MANUFACTURING", "QUALITY", "ENGINEERING"],
  QUALITY: ["QUALITY", "MANUFACTURING"],
  SUPPLY: ["SUPPLY", "MANUFACTURING", "COMMERCIAL"],
  ENGINEERING: ["ENGINEERING", "MANUFACTURING"],
  COMMERCIAL: ["COMMERCIAL", "SUPPLY"],
};
const ALL = ["MANUFACTURING", "QUALITY", "SUPPLY", "ENGINEERING", "COMMERCIAL"];

// [name, domain, description, status, subAgents, rolesOverride]
const ROWS = [
  ["Shift Handover", "MANUFACTURING", "Full end-of-shift handover: KPIs, batch phases, watchouts, checklist.", "live", ["Summary", "Timeline", "Checklist"], ALL],
  ["Real Time Process Snapshot", "MANUFACTURING", "Persona-scoped KPI board. Drill into how each number is calculated.", "live", ["TSMS", "Sterility", "Supervisor", "Operator"], ALL],
  ["Dynamic Scheduling", "MANUFACTURING", "Planned vs actual, AI resequencing, campaign overview for PFS3.", "live", ["Operations Center", "Planning Studio"]],
  ["Batch Tracker", "MANUFACTURING", "Track every batch through its phases with milestones.", "live", ["Phase view", "Milestones"]],
  ["Downtime Analyzer", "MANUFACTURING", "Find where line time is lost and why.", "live", ["Events", "Root causes"]],
  ["Yield Optimizer", "MANUFACTURING", "Spot yield loss by step and suggest fixes.", "beta", ["Step yield", "Trends"]],
  ["Line Clearance", "MANUFACTURING", "Guided line clearance with e-sign off.", "live", ["Checklist", "History"]],
  ["OEE Monitor", "MANUFACTURING", "Availability, performance and quality per line.", "live", ["Line OEE", "Losses"]],
  ["Deviation Assistant", "QUALITY", "Draft, classify and track deviations.", "live", ["Intake", "Similar cases", "Status"]],
  ["CAPA Tracker", "QUALITY", "Open corrective actions, owners and due dates.", "live", ["Open items", "Effectiveness"]],
  ["Batch Record Review", "QUALITY", "Review electronic batch records by exception.", "beta", ["Exceptions", "Release readiness"]],
  ["Sterility Watch", "QUALITY", "Environmental monitoring and sterility trends.", "live", ["EM trends", "Alerts"]],
  ["QC Lab Results", "QUALITY", "Sample status and test results from the lab.", "live", ["Samples", "Results"]],
  ["Audit Readiness", "QUALITY", "Documents and evidence ready for inspection.", "beta", ["Evidence", "Gaps"]],
  ["Inventory Planner", "SUPPLY", "Stock levels, expiry and reorder signals.", "live", ["Stock", "Expiry"]],
  ["Material Availability", "SUPPLY", "Will materials arrive before the batch starts?", "live", ["Shortages", "Inbound"]],
  ["Logistics Tracker", "SUPPLY", "Shipments, cold chain and delivery status.", "live", ["Shipments", "Cold chain"]],
  ["Supplier Risk", "SUPPLY", "Supplier performance and risk signals.", "beta", ["Scorecards", "Alerts"]],
  ["Equipment Health", "ENGINEERING", "Condition and failure risk of key equipment.", "live", ["Sensors", "Predictions"]],
  ["Maintenance Planner", "ENGINEERING", "Plan and sequence maintenance around production.", "live", ["Work orders", "Calendar"]],
  ["Calibration Tracker", "ENGINEERING", "Instruments due for calibration.", "live", ["Due soon", "History"]],
  ["Change Control", "ENGINEERING", "Track change requests through approval.", "maint", ["Requests", "Impact"]],
  ["Demand Forecast", "COMMERCIAL", "Forecast demand by product and market.", "live", ["Forecast", "Accuracy"]],
  ["Order Status", "COMMERCIAL", "Where is each customer order?", "live", ["Orders", "Delays"]],
  ["Product Supply Outlook", "COMMERCIAL", "Weeks of supply by product.", "beta", ["Outlook", "Risks"]],
  ["Market Allocation", "COMMERCIAL", "Allocate limited supply across markets.", "beta", ["Scenarios", "Approvals"]],
];

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const AGENT_REGISTRY = ROWS.map(([name, domain, description, status, subs, roles], i) => ({
  id: `agt-${i + 1}`,
  slug: slugify(name),
  name,
  domain,
  description,
  status, // live | beta | maint
  subAgents: subs.map((s) => ({ id: slugify(s), name: s })),
  dataSources: SOURCES[domain],
  roles: roles || DOMAIN_ACCESS[domain],
}));

export const ATTENTION_ITEMS = [
  { id: "a1", text: "Sterility excursion needs review", agentSlug: "sterility-watch", roles: ["QUALITY"], severity: "bad" },
  { id: "a2", text: "Handover checklist: 3 items open", agentSlug: "shift-handover", roles: ["MANUFACTURING"], severity: "warn" },
  { id: "a3", text: "Syringes behind plan (75.7% of due)", agentSlug: "dynamic-scheduling", roles: ["MANUFACTURING"], severity: "warn" },
  { id: "a4", text: "Material shortage risk for next batch", agentSlug: "material-availability", roles: ["SUPPLY"], severity: "warn" },
  { id: "a5", text: "4 instruments due for calibration in 2 days", agentSlug: "calibration-tracker", roles: ["ENGINEERING"], severity: "warn" },
  { id: "a6", text: "Order delays in 2 markets", agentSlug: "order-status", roles: ["COMMERCIAL"], severity: "warn" },
];
