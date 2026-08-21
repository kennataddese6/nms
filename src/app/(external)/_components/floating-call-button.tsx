"use client";

import * as React from "react";

import { ChevronRight, MessageCircle, Phone, Sparkles, X } from "lucide-react";

export function FloatingCallButton() {
  const [isOpen, setIsOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  // Close when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const phoneNumbers = [
    { label: "Branch 1 (Mobile)", number: "07359760335", raw: "07359760335", wa: "447359760335" },
    { label: "Branch 1 (Mobile 2)", number: "07863862973", raw: "07863862973", wa: "447863862973" },
    { label: "Branch 1 (Landline)", number: "020 8109 8601", raw: "02081098601", wa: null },
  ];

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Popover Options Card */}
      {isOpen && (
        <div className="mb-3 w-80 max-w-[calc(100vw-3rem)] rounded-3xl border-2 border-orange-200 bg-white/95 backdrop-blur-md p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-orange-100 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 font-bold text-sm">
                📞
              </span>
              <div>
                <h4 className="text-sm font-black text-foreground">Contact Bubbly Nursery</h4>
                <p className="text-[11px] text-muted-foreground">We are here to help you</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-muted-foreground hover:bg-neutral-100 hover:text-foreground transition-colors"
              aria-label="Close contact menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            {/* WhatsApp Option */}
            <div className="space-y-2">
              <span className="block text-[10px] font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <MessageCircle className="h-3 w-3" /> WhatsApp Chat
              </span>
              <a
                href="https://wa.me/447359760335?text=Hello%20Bubbly%20Day%20Nursery%2C%20I%20would%20like%20to%20enquire%20about%20childcare."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between w-full p-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                    <MessageCircle className="h-4 w-4 fill-white text-emerald-500" />
                  </div>
                  <span>Chat on WhatsApp</span>
                </div>
                <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            {/* Direct Phone Call Options */}
            <div className="space-y-2 pt-1 border-t border-neutral-100">
              <span className="block text-[10px] font-black uppercase tracking-wider text-sky-700 flex items-center gap-1">
                <Phone className="h-3 w-3" /> Direct Phone Lines
              </span>
              <div className="space-y-1.5">
                {phoneNumbers.map((item) => (
                  <a
                    key={item.raw}
                    href={`tel:${item.raw}`}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-950 text-xs font-bold transition-colors group"
                  >
                    <div>
                      <span className="block text-[10px] text-sky-700 font-semibold">{item.label}</span>
                      <span>{item.number}</span>
                    </div>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white group-hover:scale-110 transition-transform shadow-sm">
                      <Phone className="h-3.5 w-3.5 fill-white" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100 text-center">
            <span className="text-[10px] text-muted-foreground italic">Mon – Fri: 7:30 AM – 6:00 PM</span>
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200 border-2 border-white focus:outline-none focus:ring-4 focus:ring-emerald-300"
        aria-expanded={isOpen}
        aria-label="Call or WhatsApp us"
      >
        <div className="relative flex items-center justify-center">
          {/* Animated ping ring */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
            {isOpen ? <X className="h-5 w-5" /> : <Phone className="h-4 w-4 fill-white" />}
          </div>
        </div>
        <span className="font-extrabold text-sm tracking-wide pr-1">{isOpen ? "Close" : "Call Us"}</span>
      </button>
    </div>
  );
}
