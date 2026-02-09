export default async function getAiSuggestion({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  const response = await fetch("http://localhost:8000/ticket/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      description: description,
    }),
  });
  if (!response.ok) {
    throw new Error("AI suggestion failed");
  }
  return await response.json();
}
