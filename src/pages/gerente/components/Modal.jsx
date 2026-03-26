import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Modal({ isOpen, onClose, title, icon, children }) {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    if (isOpen) setShow(true);
    else {
      const timer = setTimeout(() => setShow(false), 400);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!show) return null;

  return createPortal(
    <div
      className={`
        fixed inset-0 z-9999 flex items-center justify-center px-4
        bg-slate-950/80 backdrop-blur
        transition-opacity duration-300
        ${isOpen ? "opacity-100" : "opacity-0"}
      `}
    >
      {/* Modal */}
      <div
        className={`
          w-full max-w-3xl
          bg-slate-900 border border-blue-900/40
          rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.6)]
          transform transition-all duration-300
          ${isOpen ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}
        `}
      >
        {/* HEADER */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-blue-900/30">
          {icon && (
            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-950 border border-blue-900/40">
              <i className={`${icon} text-cyan-500`}></i>
            </div>
          )}

          <h2 className="text-lg font-bold text-white tracking-wide">{title}</h2>

          <button
            onClick={onClose}
            className="ml-auto cursor-pointer text-slate-500 hover:text-cyan-300 transition text-xl"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto text-slate-300">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}