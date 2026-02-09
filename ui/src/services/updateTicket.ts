// TODO: add a proper type for ticketUpdate
export default async function updateTicket(
  ticketId: string,
  ticketUpdate: any,
) {
  try {
    const response = await fetch(`http://localhost:8000/ticket/${ticketId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(ticketUpdate),
    });

    if (!response.ok) {
      throw new Error("Can not update ticket");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
