"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface BrandVoiceSettings {
  coreValues: string;
  forbiddenWords: string;
  targetAudience: string;
  toneFormal: number; // 0-100
  toneLength: number; // 0-100
}

interface BrandVoiceContextType {
  settings: BrandVoiceSettings;
  updateSettings: (settings: Partial<BrandVoiceSettings>) => void;
  getVoiceLabel: () => string;
}

const defaultSettings: BrandVoiceSettings = {
  coreValues: "Professional, Trustworthy, Innovative",
  forbiddenWords: "cheap, guarantee, best",
  targetAudience: "B2B professionals, C-level executives",
  toneFormal: 70,
  toneLength: 60,
};

const BrandVoiceContext = createContext<BrandVoiceContextType | undefined>(undefined);

export function BrandVoiceProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BrandVoiceSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("brandVoiceSettings");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setSettings({ ...defaultSettings, ...parsed });
        } catch (e) {
          console.error("Failed to parse brand voice settings", e);
        }
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("brandVoiceSettings", JSON.stringify(settings));
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<BrandVoiceSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const getVoiceLabel = () => {
    const toneLabel = settings.toneFormal >= 70 ? "Formal" : settings.toneFormal >= 40 ? "Balanced" : "Casual";
    const lengthLabel = settings.toneLength >= 70 ? "Long" : settings.toneLength >= 40 ? "Medium" : "Short";
    return `${toneLabel} • ${lengthLabel}`;
  };

  return (
    <BrandVoiceContext.Provider value={{ settings, updateSettings, getVoiceLabel }}>
      {children}
    </BrandVoiceContext.Provider>
  );
}

export function useBrandVoice() {
  const context = useContext(BrandVoiceContext);
  if (context === undefined) {
    throw new Error("useBrandVoice must be used within a BrandVoiceProvider");
  }
  return context;
}
