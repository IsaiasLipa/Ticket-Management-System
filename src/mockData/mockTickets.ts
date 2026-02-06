import type { Ticket } from "../types/types";

export const mockTickets: Ticket[] = [
  {
    id: "TCK-001",
    title: "Login fails for some users",
    description:
      "Users report being redirected back to the login screen after entering valid credentials.",
    status: "open",
    category: "Bug",
    tags: ["auth", "regression", "frontend"],
    priority: "high",
    ai_response:
      "Fixed the auth redirect loop by honoring active sessions, refreshed cookies on login, and added a server-side session check.",
  },
  {
    id: "TCK-002",
    title: "Add bulk ticket assignment",
    description:
      "Admins want to select multiple tickets and assign them to an agent in one action.",
    status: "in_progress",
    category: "Feature",
    tags: ["admin", "workflow"],
    priority: "medium",
    ai_response:
      "Implemented multi-select in the ticket list and a bulk-assign API that queues notifications to agents.",
  },
  {
    id: "TCK-003",
    title: "Email notifications delayed",
    description:
      "Outbound ticket update emails arrive 10–20 minutes late for some accounts.",
    status: "blocked",
    category: "Infrastructure",
    tags: ["email", "queue", "ops"],
    priority: "urgent",
    ai_response:
      "Increased worker concurrency, tuned retry backoff, and moved the queue to a dedicated Redis instance.",
  },
  {
    id: "TCK-004",
    title: "Search by tag",
    description:
      "Allow agents to filter tickets using a tag chip selector in the search bar.",
    status: "open",
    category: "Enhancement",
    tags: ["search", "ux"],
    priority: "low",
    ai_response:
      "Added tag chips to the search bar and wired the backend to filter tickets by tag.",
  },
  {
    id: "TCK-005",
    title: "SLA breach report inaccurate",
    description:
      "The weekly SLA breach report includes tickets already marked as resolved.",
    status: "resolved",
    category: "Bug",
    tags: ["reports", "backend"],
    priority: "high",
    ai_response:
      "Fixed the report query to exclude tickets resolved before the reporting window and corrected the join logic.",
  },
  {
    id: "TCK-006",
    title: "Improve ticket details layout",
    description:
      "Tighten spacing, group metadata, and make status changes more prominent.",
    status: "closed",
    category: "Design",
    tags: ["ui", "layout"],
    priority: "medium",
    ai_response:
      "Rebuilt the details pane with a grid layout, grouped metadata, and emphasized the status area.",
  },
  {
    id: "TCK-007",
    title: "Attachment upload fails on mobile",
    description:
      "Users on iOS report that file uploads stall at 0% when adding attachments.",
    status: "open",
    category: "Bug",
    tags: ["mobile", "attachments", "ios"],
    priority: "high",
    ai_response:
      "Switched iOS uploads to multipart with proper content-length handling and added a resilient progress listener.",
  },
  {
    id: "TCK-008",
    title: "Weekly summary email opt-out",
    description:
      "Provide a toggle for users to opt out of weekly ticket summary emails.",
    status: "in_progress",
    category: "Feature",
    tags: ["email", "preferences"],
    priority: "low",
    ai_response:
      "Added a profile toggle and updated the scheduler to skip weekly summaries for opted-out users.",
  },
  {
    id: "TCK-009",
    title: "Audit log export",
    description:
      "Allow admins to export the audit log as CSV for compliance reviews.",
    status: "open",
    category: "Compliance",
    tags: ["audit", "export", "admin"],
    priority: "medium",
    ai_response:
      "Built a CSV export endpoint with streaming and added an admin-only download action.",
  },
  {
    id: "TCK-010",
    title: "Ticket merge duplicates",
    description:
      "Merging tickets with identical subjects creates duplicate comments.",
    status: "blocked",
    category: "Bug",
    tags: ["merge", "comments", "backend"],
    priority: "urgent",
    ai_response:
      "Deduplicated comments by ID during merge and wrapped the operation in a single transaction.",
  },
  {
    id: "TCK-011",
    title: "Dark mode in agent view",
    description: "Add a dark theme option for agents working late shifts.",
    status: "open",
    category: "Enhancement",
    tags: ["theme", "accessibility", "ui"],
    priority: "medium",
    ai_response:
      "Implemented theme tokens with CSS variables and added a persistent dark mode toggle for agents.",
  },
  {
    id: "TCK-012",
    title: "Faster dashboard load",
    description:
      "Optimize dashboard queries to reduce initial load time under 2 seconds.",
    status: "in_progress",
    category: "Performance",
    tags: ["database", "caching", "ops"],
    priority: "high",
    ai_response:
      "Added caching for the dashboard payload, indexed hot queries, and reduced N+1 requests.",
  },
  {
    id: "TCK-013",
    title: "Customer satisfaction survey",
    description:
      "Send a one-click CSAT survey after a ticket is marked resolved.",
    status: "resolved",
    category: "Product",
    tags: ["csat", "feedback", "email"],
    priority: "medium",
    ai_response:
      "Triggered a one-click CSAT email on resolve and stored responses for reporting.",
  },
  {
    id: "TCK-014",
    title: "Agent availability indicator",
    description:
      "Show agent availability status (online, busy, away) in assignment picker.",
    status: "closed",
    category: "UX",
    tags: ["presence", "workflow"],
    priority: "low",
    ai_response:
      "Integrated presence data from the agent service and surfaced availability in the assignment picker.",
  },
];
