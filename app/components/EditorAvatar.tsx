"use client";

import { useState } from "react";
import Image from "next/image";

interface EditorAvatarProps {
  size?: "xs" | "sm" | "md" | "lg";
  showStatus?: boolean;
  showLabel?: boolean;
  className?: string;
}

export default function EditorAvatar({ 
  size = "md", 
  showStatus = true, 
  showLabel = false,
  className = "" 
}: EditorAvatarProps) {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  const statusSizeClasses = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
  };

  const imageSize = {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 64,
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-gold/30 bg-gold/20 flex items-center justify-center`}>
          {!imageError ? (
            <Image
              src="/SASKIA.png"
              alt="Saskia - Jouw Redacteur"
              width={imageSize[size]}
              height={imageSize[size]}
              className="object-cover w-full h-full"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gold/20 text-gold font-playfair font-bold" style={{ fontSize: size === "xs" ? "12px" : size === "sm" ? "14px" : size === "md" ? "18px" : "24px" }}>
              S
            </div>
          )}
        </div>
        {showStatus && (
          <div className={`absolute -bottom-0.5 -right-0.5 ${statusSizeClasses[size]} bg-green-500 rounded-full border-2 border-white`} title="Online"></div>
        )}
      </div>
      {showLabel && (
        <div className="flex flex-col">
          <span className="font-ui text-sm font-medium text-deep-black">Saskia</span>
          <span className="font-ui text-xs text-deep-black/60">Jouw Redacteur</span>
          {showStatus && (
            <span className="font-ui text-xs text-green-600 mt-0.5">is online</span>
          )}
        </div>
      )}
    </div>
  );
}
