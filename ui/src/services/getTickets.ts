export default async function getTickets(pageNum: number = 1) {
  const response = await fetch(
    `http://localhost:8000/tickets?pageNum=${pageNum}`,
  );

  if (!response.ok) {
    throw new Error("Can not fetch tickets");
  }
  return await response.json();
}
