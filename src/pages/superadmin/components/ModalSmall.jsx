import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function ModalSmall({ isOpen, onClose, title, icon, children }) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timer = setTimeout(() => setShow(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  // Portal renderiza no body para garantir que fique acima do sidebar e header
  return createPortal(
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-slate-900 w-full max-w-md rounded-xl p-6 relative transform transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-4">
          {icon && (
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-cyan-500 text-slate-900 text-xl">
              <i className={icon}></i>
            </div>
          )}
          <h2 className="text-lg font-bold text-cyan-500">{title}</h2>
          <button
            onClick={onClose}
            className="ml-auto cursor-pointer text-slate-400 hover:text-cyan-500 text-2xl font-bold transition-colors"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Conteúdo */}
        <div>{children}</div>
      </div>
    </div>,
    document.body
  );
}