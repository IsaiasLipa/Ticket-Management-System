import type { Ticket } from "../types/types";

export default async function createTicket(newTicket: Ticket) {
  try {
    const response = await fetch("http://localhost:8000/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newTicket: newTicket,
      }),
    });
    if (!response.ok) {
      throw new Error("AI suggestion failed");
    }
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}
