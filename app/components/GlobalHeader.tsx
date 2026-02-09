"use client";

import { useState } from "react";
import { User, Edit } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

export default function GlobalHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isEditorMode, setIsEditorMode] = useState(false);

  // Show editor toggle only on certain pages (not login)
  const showEditorToggle = pathname !== "/login" && pathname !== "/review";

  const toggleEditorMode = () => {
    setIsEditorMode(!isEditorMode);
    if (!isEditorMode) {
      // Navigate to review page if there's a document in review
      const reviewDoc = localStorage.getItem("reviewDocument");
      if (reviewDoc) {
        router.push("/review");
      }
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-28 bg-deep-black flex items-center justify-between px-6 z-30">
      {/* Left Side - Logo */}
      <div className="flex items-center">
        <div className="h-[100px] w-auto">
          <Image
            src="/LPM_Logo_Lang.svg"
            alt="La Plume Intelligence"
            width={500}
            height={100}
            className="h-full w-auto object-contain"
            style={{ filter: 'brightness(0)' }}
            priority
          />
        </div>
      </div>

      {/* Right Side - Status & User Profile */}
      <div className="flex items-center gap-4">
        {/* Editor Mode Toggle */}
        {showEditorToggle && (
          <button
            onClick={toggleEditorMode}
            className={`px-4 py-1.5 rounded-full flex items-center gap-2 border transition-colors ${
              isEditorMode
                ? "bg-gold/20 border-gold text-gold"
                : "bg-deep-black/50 border-stone/20 text-white/60 hover:text-white"
            }`}
          >
            <Edit size={14} />
            <span className="text-xs font-ui uppercase font-medium">
              {isEditorMode ? "Editor Mode" : "Editor"}
            </span>
          </button>
        )}

        {/* Status Indicator */}
        <div className="bg-deep-black/50 px-4 py-1.5 rounded-full flex items-center gap-2 border border-stone/20">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-green-500 text-xs font-ui uppercase font-medium">
            ONLINE
          </span>
        </div>

        {/* User Profile */}
        <button className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-deep-black/50 transition-colors">
          <div className="w-8 h-8 bg-stone/20 rounded-full flex items-center justify-center border border-stone/30">
            <User size={16} className="text-white" />
          </div>
        </button>
      </div>
    </header>
  );
}
