import { type JSX } from "react";
import ReactDom from "react-dom";
export default function Modal({
  isOpen,
  children,
  onClose,
}: {
  isOpen: boolean;
  children: JSX.Element;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const portalRoot = document.getElementById("portal");
  if (!portalRoot) return null;

  return ReactDom.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={() => onClose()}
    >
      <div
        className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>,
    portalRoot,
  );
}
