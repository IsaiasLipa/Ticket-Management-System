export default function ErrorToast({
  errorMessages,
}: {
  errorMessages: string[];
}) {
  if (!errorMessages.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm space-y-2">
      {errorMessages.map((message, index) => (
        <div
          key={`${index}-${message}`}
          className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 shadow-lg"
        >
          {message}
        </div>
      ))}
    </div>
  );
}
