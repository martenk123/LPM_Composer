"use client";

import { Menu, Mic, Send, Sparkles } from "lucide-react";

export default function Home() {
  const currentDate = new Date();
  const dateString = currentDate.toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
  });

  return (
    <div className="min-h-screen bg-off-white flex flex-col">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-32 px-4">
        {/* Date Stamp */}
        <div className="mb-8">
          <div className="bg-stone/40 px-4 py-1.5 rounded-full">
            <p className="text-deep-black/60 text-xs font-ui">
              Vandaag, {dateString}
            </p>
          </div>
        </div>

        {/* System Message */}
        <div className="w-full max-w-3xl flex gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-stone">
              <Sparkles size={20} className="text-gold" />
            </div>
          </div>

          {/* Message Content */}
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-xs font-ui uppercase tracking-wide text-deep-black/70 font-medium">
                SYSTEM
              </span>
              <span className="text-xs text-deep-black/40 font-ui">
                10:50
              </span>
            </div>
            <div className="bg-white rounded-lg border border-stone shadow-sm p-4">
              <p className="text-deep-black font-playfair text-base leading-relaxed">
                Hallo! Het La Plume Intelligence platform is gereed. Ik heb connectie gemaakt met de productie-database en de actuele status van het trelloboard opgehaald. Met wie heb ik het genoegen?
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Input Area */}
      <footer className="fixed bottom-0 left-20 right-0 flex justify-center pb-6 px-4">
        <div className="w-full max-w-3xl bg-stone/30 rounded-lg px-4 py-3 flex items-center gap-3 border border-stone/50">
          {/* Hamburger Menu */}
          <button className="p-2 hover:bg-stone/40 rounded transition-colors">
            <Menu size={20} className="text-deep-black/60" />
          </button>

          {/* Input Field */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Spreek of typ je bericht..."
              className="w-full bg-white rounded-lg px-4 py-3 pr-32 text-deep-black placeholder-deep-black/40 focus:outline-none focus:ring-2 focus:ring-gold/50 font-ui text-sm border border-stone/50"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-xs text-deep-black/40 font-mono">
                CMD + ENTER
              </span>
              <button className="w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center hover:bg-gold/40 transition-colors">
                <Mic size={16} className="text-deep-black/70" />
              </button>
            </div>
          </div>

          {/* Send Button */}
          <button className="p-2 hover:bg-stone/40 rounded transition-colors">
            <Send size={20} className="text-deep-black/60" />
          </button>
        </div>
      </footer>
    </div>
  );
}
