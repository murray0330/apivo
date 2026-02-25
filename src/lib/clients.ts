/**
 * Client configuration map.
 * Each key is a widget ID that clients use in their embed script.
 * Add new clients here — no need to touch their site.
 */

export interface ClientConfig {
  assistantId: string;
  businessName: string;
  greeting: string;
  quickReplies: string[];
  primaryColor: string;     // hex, e.g. "#6366f1"
}

const clients: Record<string, ClientConfig> = {
  "abc-dental": {
    assistantId: "a1471688-687e-407e-a8ce-456bce6bdc0e",
    businessName: "ABC Dental Clinic",
    greeting:
      "Hi! Welcome to ABC Dental Clinic. To get started, are you a new or existing patient?",
    quickReplies: ["New Patient", "Existing Patient"],
    primaryColor: "#6366f1",
  },
  // Add more clients:
  // "bobs-plumbing": {
  //   assistantId: "...",
  //   businessName: "Bob's Plumbing",
  //   greeting: "Hi! How can we help you today?",
  //   quickReplies: ["Schedule Service", "Get a Quote"],
  //   primaryColor: "#2563eb",
  // },
};

export function getClient(widgetId: string): ClientConfig | null {
  return clients[widgetId] ?? null;
}
