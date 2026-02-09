export default async function getTickets() {
  try {
    const response = await fetch("http://localhost:8000/tickets");

    if (!response.ok) {
      throw new Error("Can not fetch tickets");
    }
    const data = await response.json();
    return data;
  } catch (e) {
    console.error(e);
  }
}
