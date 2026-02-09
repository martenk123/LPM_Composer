"use client";

import { useState } from "react";
import { Settings as SettingsIcon, Users, Palette } from "lucide-react";

type Tab = "general" | "brand-voice" | "team";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("brand-voice");
  const [coreValues, setCoreValues] = useState("Professional, Trustworthy, Innovative");
  const [forbiddenWords, setForbiddenWords] = useState("cheap, guarantee, best");
  const [targetAudience, setTargetAudience] = useState("B2B professionals, C-level executives");
  const [toneFormal, setToneFormal] = useState(70); // 0 = Casual, 100 = Formal
  const [toneLength, setToneLength] = useState(60); // 0 = Short, 100 = Long
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    // Could add toast notification here
  };

  return (
    <div className="min-h-screen bg-off-white animate-fade-in">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-5xl text-deep-black mb-2">
            Settings
          </h1>
          <p className="font-ui text-deep-black/60 text-sm uppercase tracking-wider">
            Configure your workspace preferences
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-white rounded-lg border border-stone p-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors mb-1 ${
                  activeTab === "general"
                    ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                    : "text-deep-black/60 hover:bg-stone/30"
                }`}
              >
                <SettingsIcon size={20} className="flex-shrink-0" />
                <span className="font-ui text-sm font-medium">General</span>
              </button>
              <button
                onClick={() => setActiveTab("brand-voice")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors mb-1 ${
                  activeTab === "brand-voice"
                    ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                    : "text-deep-black/60 hover:bg-stone/30"
                }`}
              >
                <Palette size={20} className="flex-shrink-0" />
                <span className="font-ui text-sm font-medium">Brand Voice</span>
              </button>
              <button
                onClick={() => setActiveTab("team")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                  activeTab === "team"
                    ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                    : "text-deep-black/60 hover:bg-stone/30"
                }`}
              >
                <Users size={20} className="flex-shrink-0" />
                <span className="font-ui text-sm font-medium">Team</span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === "general" && (
              <div className="bg-white rounded-lg border border-stone p-8">
                <h2 className="font-playfair text-3xl text-deep-black mb-6">
                  General Settings
                </h2>
                <p className="font-ui text-deep-black/60">
                  General settings coming soon...
                </p>
              </div>
            )}

            {activeTab === "brand-voice" && (
              <div className="bg-white rounded-lg border border-stone p-8">
                <h2 className="font-playfair text-3xl text-deep-black mb-8">
                  Brand Voice
                </h2>
                <p className="font-ui text-sm text-deep-black/60 mb-8 uppercase tracking-wide">
                  Configure how La Plume Intelligence writes for your brand
                </p>

                <div className="space-y-8">
                  {/* Core Values */}
                  <div>
                    <label
                      htmlFor="core-values"
                      className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
                    >
                      Core Values
                    </label>
                    <input
                      id="core-values"
                      type="text"
                      value={coreValues}
                      onChange={(e) => setCoreValues(e.target.value)}
                      className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black"
                      placeholder="e.g., Professional, Trustworthy, Innovative"
                    />
                    <p className="mt-2 font-ui text-xs text-deep-black/50">
                      Separate values with commas
                    </p>
                  </div>

                  {/* Forbidden Words */}
                  <div>
                    <label
                      htmlFor="forbidden-words"
                      className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
                    >
                      Forbidden Words
                    </label>
                    <input
                      id="forbidden-words"
                      type="text"
                      value={forbiddenWords}
                      onChange={(e) => setForbiddenWords(e.target.value)}
                      className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black"
                      placeholder="e.g., cheap, guarantee, best"
                    />
                    <p className="mt-2 font-ui text-xs text-deep-black/50">
                      Words to avoid in generated content
                    </p>
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label
                      htmlFor="target-audience"
                      className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
                    >
                      Target Audience
                    </label>
                    <input
                      id="target-audience"
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black"
                      placeholder="e.g., B2B professionals, C-level executives"
                    />
                    <p className="mt-2 font-ui text-xs text-deep-black/50">
                      Describe your primary audience
                    </p>
                  </div>

                  {/* Tone Sliders */}
                  <div className="space-y-6 pt-4 border-t border-stone">
                    {/* Formal <-> Casual */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-ui font-medium text-deep-black/70 uppercase tracking-wide">
                          Tone: Formal ↔ Casual
                        </label>
                        <span className="text-sm font-ui text-deep-black/60">
                          {toneFormal >= 70 ? "Formal" : toneFormal >= 40 ? "Balanced" : "Casual"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={toneFormal}
                        onChange={(e) => setToneFormal(Number(e.target.value))}
                        className="w-full h-2 bg-stone rounded-lg appearance-none cursor-pointer accent-gold"
                        style={{
                          background: `linear-gradient(to right, #D4C5A5 0%, #D4C5A5 ${toneFormal}%, #d6d3d1 ${toneFormal}%, #d6d3d1 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-ui text-deep-black/50">Casual</span>
                        <span className="text-xs font-ui text-deep-black/50">Formal</span>
                      </div>
                    </div>

                    {/* Short <-> Long */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-ui font-medium text-deep-black/70 uppercase tracking-wide">
                          Length: Short ↔ Long
                        </label>
                        <span className="text-sm font-ui text-deep-black/60">
                          {toneLength >= 70 ? "Long" : toneLength >= 40 ? "Medium" : "Short"}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={toneLength}
                        onChange={(e) => setToneLength(Number(e.target.value))}
                        className="w-full h-2 bg-stone rounded-lg appearance-none cursor-pointer accent-gold"
                        style={{
                          background: `linear-gradient(to right, #D4C5A5 0%, #D4C5A5 ${toneLength}%, #d6d3d1 ${toneLength}%, #d6d3d1 100%)`,
                        }}
                      />
                      <div className="flex justify-between mt-1">
                        <span className="text-xs font-ui text-deep-black/50">Short</span>
                        <span className="text-xs font-ui text-deep-black/50">Long</span>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-6 border-t border-stone">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-8 py-3 bg-deep-black text-white font-ui text-sm font-medium uppercase tracking-wider rounded-md hover:bg-gold hover:text-deep-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? "Saving..." : "Save Brand Voice"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div className="bg-white rounded-lg border border-stone p-8">
                <h2 className="font-playfair text-3xl text-deep-black mb-6">
                  Team Settings
                </h2>
                <p className="font-ui text-deep-black/60">
                  Team management coming soon...
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
