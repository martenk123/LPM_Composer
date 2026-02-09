"use client";

import { useState, useEffect } from "react";
import { Settings as SettingsIcon, Users, Palette, Crown, Sparkles, Check, LogOut, AlertTriangle } from "lucide-react";
import { useBrandVoice } from "../contexts/BrandVoiceContext";
import { useAccount } from "../contexts/AccountContext";
import EditorAvatar from "../components/EditorAvatar";
import { useRouter } from "next/navigation";

type Tab = "general" | "brand-voice" | "team";

export default function SettingsPage() {
  const router = useRouter();
  const { settings, updateSettings } = useBrandVoice();
  const { accountTier, upgradeToPremium, downgradeToBasic, isPremium } = useAccount();
  const [activeTab, setActiveTab] = useState<Tab>("brand-voice");
  const [coreValues, setCoreValues] = useState(settings.coreValues);
  const [forbiddenWords, setForbiddenWords] = useState(settings.forbiddenWords);
  const [targetAudience, setTargetAudience] = useState(settings.targetAudience);
  const [toneFormal, setToneFormal] = useState(settings.toneFormal);
  const [toneLength, setToneLength] = useState(settings.toneLength);
  const [isSaving, setIsSaving] = useState(false);
  const [showDowngradeConfirm, setShowDowngradeConfirm] = useState(false);

  // Sync local state with context
  useEffect(() => {
    setCoreValues(settings.coreValues);
    setForbiddenWords(settings.forbiddenWords);
    setTargetAudience(settings.targetAudience);
    setToneFormal(settings.toneFormal);
    setToneLength(settings.toneLength);
  }, [settings]);

  const handleSave = async () => {
    setIsSaving(true);
    // Save to context (which saves to localStorage)
    updateSettings({
      coreValues,
      forbiddenWords,
      targetAudience,
      toneFormal,
      toneLength,
    });
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
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors mb-1 ${
                  activeTab === "team"
                    ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                    : "text-deep-black/60 hover:bg-stone/30"
                }`}
              >
                <Users size={20} className="flex-shrink-0" />
                <span className="font-ui text-sm font-medium">Team</span>
              </button>
              
              {/* Logout Button */}
              <div className="pt-4 border-t border-stone/50 mt-2">
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      // Clear all localStorage
                      localStorage.clear();
                      // Redirect to login
                      router.push("/login");
                    }
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut size={20} className="flex-shrink-0" />
                  <span className="font-ui text-sm font-medium">Uitloggen</span>
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Upgrade naar Premium Sectie - Opvallend bovenaan */}
            {!isPremium && (
              <div className="mb-8 bg-gradient-to-br from-gold/20 via-gold/10 to-gold/5 rounded-lg border-2 border-gold p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full -ml-24 -mb-24"></div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center shadow-lg">
                        <Crown size={32} className="text-deep-black" />
                      </div>
                      <div>
                        <h2 className="font-playfair text-3xl text-deep-black mb-2">
                          Upgrade naar Premium
                        </h2>
                        <p className="font-ui text-deep-black/70 text-sm mb-2">
                          Ontgrendel alle premium functies en krijg toegang tot geavanceerde tools
                        </p>
                        <div className="flex items-baseline gap-2">
                          <span className="font-playfair text-2xl text-deep-black">€299</span>
                          <span className="font-ui text-sm text-deep-black/60">per maand</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={upgradeToPremium}
                      className="px-8 py-4 bg-gold text-deep-black rounded-lg font-ui text-sm font-medium uppercase tracking-wider hover:bg-gold/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2"
                    >
                      <Sparkles size={18} />
                      Upgrade Nu
                    </button>
                  </div>
                  
                  {/* Premium Features List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gold/20">
                      <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-ui text-sm font-medium text-deep-black mb-1">
                          Onbeperkte AI-generaties
                        </h3>
                        <p className="font-ui text-xs text-deep-black/60">
                          Geen limieten op het aantal woorden of documenten
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gold/20">
                      <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-ui text-sm font-medium text-deep-black mb-1">
                          Geavanceerde Brand Voice
                        </h3>
                        <p className="font-ui text-xs text-deep-black/60">
                          Meerdere voice profielen en geavanceerde aanpassingen
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gold/20">
                      <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-ui text-sm font-medium text-deep-black mb-1">
                          Priority Support
                        </h3>
                        <p className="font-ui text-xs text-deep-black/60">
                          Snelle reactietijden en persoonlijke ondersteuning
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-4 bg-white/50 rounded-lg border border-gold/20">
                      <Check size={20} className="text-gold flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-ui text-sm font-medium text-deep-black mb-1">
                          Export naar meerdere formaten
                        </h3>
                        <p className="font-ui text-xs text-deep-black/60">
                          PDF, Word, HTML en meer export opties
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Premium Badge als gebruiker premium heeft */}
            {isPremium && (
              <div className="mb-8 bg-gradient-to-r from-gold/20 to-gold/10 rounded-lg border border-gold p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center">
                      <Crown size={24} className="text-deep-black" />
                    </div>
                    <div>
                      <h3 className="font-playfair text-xl text-deep-black mb-1">
                        Premium Account Actief
                      </h3>
                      <p className="font-ui text-sm text-deep-black/60 mb-1">
                        Je hebt toegang tot alle premium functies
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-playfair text-xl text-deep-black">€299</span>
                        <span className="font-ui text-xs text-deep-black/60">per maand</span>
                      </div>
                    </div>
                  </div>
                  <span className="px-4 py-2 bg-gold text-deep-black rounded-full text-xs font-ui uppercase tracking-wide font-medium">
                    Premium
                  </span>
                </div>
                
                {/* Saskia Redacteur Sectie */}
                <div className="pt-4 border-t border-gold/30 flex items-center gap-4">
                  <EditorAvatar size="lg" showStatus={true} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-playfair text-lg text-deep-black">Saskia</h4>
                      <span className="px-2 py-0.5 bg-green-500/20 text-green-700 rounded-full text-xs font-ui font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    </div>
                    <p className="font-ui text-sm text-deep-black/70 mb-1">
                      Jouw Redacteur
                    </p>
                    <p className="font-ui text-xs text-deep-black/60">
                      Stuur je documenten naar Saskia voor professionele redactie via de Composer
                    </p>
                  </div>
                </div>
                
                {/* Downgrade Button */}
                <div className="pt-4 border-t border-gold/30 mt-4">
                  <button
                    onClick={() => setShowDowngradeConfirm(true)}
                    className="w-full px-4 py-2 bg-stone/30 text-deep-black rounded-md font-ui text-sm font-medium hover:bg-stone/40 transition-colors"
                  >
                    Downgrade naar Basic
                  </button>
                </div>
              </div>
            )}

            {activeTab === "general" && (
              <div className="bg-white rounded-lg border border-stone p-8">
                <h2 className="font-playfair text-3xl text-deep-black mb-6">
                  General Settings
                </h2>
                
                {/* Huidig Abonnement */}
                <div className="mb-8 p-6 bg-off-white rounded-lg border border-stone">
                  <h3 className="font-playfair text-xl text-deep-black mb-4">
                    Huidig Abonnement
                  </h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-ui text-sm font-medium text-deep-black mb-1">
                        {isPremium ? "Premium Account" : "Basic Account"}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="font-playfair text-2xl text-deep-black">
                          {isPremium ? "€299" : "€49"}
                        </span>
                        <span className="font-ui text-sm text-deep-black/60">per maand</span>
                      </div>
                    </div>
                    {isPremium && (
                      <span className="px-4 py-2 bg-gold text-deep-black rounded-full text-xs font-ui uppercase tracking-wide font-medium">
                        Premium
                      </span>
                    )}
                  </div>
                </div>
                
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
                  Configureer hoe La Plume schrijft voor jouw merk
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

      {/* Downgrade Confirm Modal */}
      {showDowngradeConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-stone p-8 max-w-md mx-4 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle size={32} className="text-red-600" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl text-deep-black mb-1">
                    Downgrade naar Basic?
                  </h3>
                  <p className="font-ui text-xs text-deep-black/60">
                    Bevestig je keuze
                  </p>
                </div>
              </div>
              <p className="font-ui text-deep-black/70 text-sm leading-relaxed">
                Weet je zeker dat je wilt downgraden naar Basic? Je verliest toegang tot premium functies zoals redactie door Saskia.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDowngradeConfirm(false)}
                className="flex-1 px-6 py-3 bg-stone/30 text-deep-black rounded-md font-ui text-sm font-medium hover:bg-stone/40 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={() => {
                  downgradeToBasic();
                  setShowDowngradeConfirm(false);
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white rounded-md font-ui text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Downgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
