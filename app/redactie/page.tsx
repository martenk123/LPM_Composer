"use client";

import { useState } from "react";
import { CheckCircle, MessageSquare, X, ArrowLeft } from "lucide-react";
import EditorAvatar from "../components/EditorAvatar";
import { useRouter } from "next/navigation";

interface ReviewComment {
  id: string;
  text: string;
  position: number;
}

interface ReviewLogItem {
  id: string;
  message: string;
  timestamp: string;
}

export default function RedactiePage() {
  const router = useRouter();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // Demo document content voor de redactiekant
  const demoDocumentContent = "Dit is een artikel over digitale transformatie in de moderne zakelijke wereld. Bedrijven moeten zich continu aanpassen aan nieuwe technologieën en veranderende klantverwachtingen. De sleutel tot succes ligt in het vinden van de juiste balans tussen innovatie en stabiliteit. Organisaties die succesvol zijn in deze transitie, investeren niet alleen in technologie, maar ook in hun mensen en processen.";

  const [reviewComments] = useState<ReviewComment[]>([
    {
      id: "comment-1",
      text: "Zinsbouw versoepeld voor betere leesbaarheid",
      position: 50,
    },
    {
      id: "comment-2",
      text: "Tone-of-voice gecontroleerd op basis van merkrichtlijnen",
      position: 150,
    },
  ]);

  const [reviewLog] = useState<ReviewLogItem[]>([
    {
      id: "log-1",
      message: "Tone-of-voice gecontroleerd op basis van merkrichtlijnen.",
      timestamp: "14:30",
    },
    {
      id: "log-2",
      message: "Zinsbouw versoepeld voor betere leesbaarheid.",
      timestamp: "14:32",
    },
    {
      id: "log-3",
      message: "Grammatica en spelling gecontroleerd.",
      timestamp: "14:35",
    },
    {
      id: "log-4",
      message: "Consistentie in terminologie gecontroleerd.",
      timestamp: "14:38",
    },
  ]);

  // Highlight content
  const getHighlightedContent = () => {
    if (!demoDocumentContent) return "";
    
    let content = demoDocumentContent;
    
    const highlightWords = [
      { word: "digitale transformatie", comment: reviewComments[0] },
      { word: "moderne zakelijke wereld", comment: reviewComments[1] },
      { word: "bedrijven", comment: reviewComments[0] },
      { word: "aanpassen", comment: reviewComments[1] },
    ];

    highlightWords.sort((a, b) => b.word.length - a.word.length);

    highlightWords.forEach(({ word, comment }) => {
      const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      content = content.replace(
        regex,
        `<mark class="bg-yellow-200/60 px-1 rounded relative group hover:bg-yellow-300/70 transition-colors" data-comment-id="${comment.id}">$1</mark>`
      );
    });

    return content || demoDocumentContent;
  };

  const handleComplete = () => {
    // Toon success modal
    setShowSuccessModal(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccessModal(false);
    // Optioneel: navigeer terug naar dashboard
    // router.push("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex">
      {/* Terug naar Dashboard Knop - Links Boven */}
      <button
        onClick={() => router.push("/dashboard")}
        className="fixed top-4 left-4 z-50 px-6 py-3 bg-deep-black text-white rounded-lg shadow-lg hover:bg-deep-black/90 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        aria-label="Terug naar Dashboard"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-ui text-sm font-medium uppercase tracking-wide">
          Terug naar Dashboard
        </span>
      </button>

      {/* Main Document Area with Highlights */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white min-h-full shadow-2xl p-16 relative">
          {/* Saskia's Werkbank Header */}
          <div className="mb-8 pb-6 border-b-2 border-gold">
            <div className="flex items-center gap-4 mb-2">
              <EditorAvatar size="md" showStatus={true} />
              <div>
                <h2 className="font-playfair text-2xl text-deep-black">
                  Saskia&apos;s Werkbank
                </h2>
                <p className="font-ui text-sm text-deep-black/60">
                  Professionele redactie in uitvoering
                </p>
              </div>
            </div>
          </div>

          {/* Document Content with Highlights */}
          <div className="relative">
            <div
              className="font-playfair text-deep-black leading-relaxed whitespace-pre-wrap"
              dangerouslySetInnerHTML={{ __html: getHighlightedContent() }}
            />
            
            {/* Floating Comment Avatars */}
            {reviewComments.map((comment, index) => (
              <div
                key={comment.id}
                className="absolute right-0 transform translate-x-full ml-4 flex items-start gap-2 group z-10"
                style={{ 
                  top: `${(index + 1) * 120}px`,
                }}
              >
                <div className="flex flex-col items-end">
                  <div className="bg-white rounded-lg shadow-lg border border-gold/30 p-3 max-w-[220px] mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0">
                        <EditorAvatar size="xs" showStatus={false} />
                      </div>
                      <p className="font-handwriting text-xs text-deep-black/80 leading-relaxed">
                        {comment.text}
                      </p>
                    </div>
                  </div>
                  <div className="cursor-pointer hover:scale-110 transition-transform">
                    <EditorAvatar size="sm" showStatus={true} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Redactie Log Sidebar */}
      <div className="w-96 bg-white border-l-2 border-gold shadow-2xl flex flex-col">
        <div className="p-6 border-b border-stone/30 flex-shrink-0">
          <h3 className="font-playfair text-xl text-deep-black mb-2">
            Redactie Log
          </h3>
          <p className="font-ui text-xs text-deep-black/60">
            Overzicht van uitgevoerde acties
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {reviewLog.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-4 bg-off-white rounded-lg border border-stone/30 hover:border-gold/30 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                  <MessageSquare size={16} className="text-gold" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-ui text-sm text-deep-black leading-relaxed mb-1">
                  {item.message}
                </p>
                <p className="font-ui text-xs text-deep-black/50">
                  {item.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Complete Button - Duidelijk en prominent */}
        <div className="p-6 border-t-2 border-gold/30 flex-shrink-0 bg-gold/5">
          <button
            onClick={handleComplete}
            className="w-full px-8 py-5 bg-gold text-deep-black rounded-lg font-ui text-base font-semibold uppercase tracking-wide hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl transform hover:scale-[1.02]"
          >
            <CheckCircle size={24} />
            <span>Redactie Voltooien & Vrijgeven</span>
          </button>
          <p className="text-center mt-3 font-ui text-xs text-deep-black/50">
            Na voltooiing wordt het document vrijgegeven aan de auteur
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl border border-stone p-8 max-w-md mx-4 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-playfair text-2xl text-deep-black mb-1">
                    Redactie Voltooid
                  </h3>
                  <p className="font-ui text-xs text-deep-black/60">
                    Document vrijgegeven
                  </p>
                </div>
              </div>
              <p className="font-ui text-deep-black/70 text-sm leading-relaxed">
                Het document is succesvol geredigeerd en vrijgegeven. De auteur kan het nu gebruiken.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleCloseSuccess}
                className="flex-1 px-6 py-3 bg-gold text-deep-black rounded-md font-ui text-sm font-medium uppercase tracking-wide hover:bg-gold/90 transition-colors"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
