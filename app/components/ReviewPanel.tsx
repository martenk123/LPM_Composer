"use client";

import { useState } from "react";
import { CheckCircle, MessageSquare } from "lucide-react";
import EditorAvatar from "./EditorAvatar";

interface ReviewComment {
  id: string;
  text: string;
  position: number; // Character position in document
}

interface ReviewLogItem {
  id: string;
  message: string;
  timestamp: string;
}

interface ReviewPanelProps {
  documentContent: string;
  documentId: string;
  onComplete: () => void;
}

export default function ReviewPanel({ documentContent, onComplete }: ReviewPanelProps) {
  const [reviewComments] = useState<ReviewComment[]>([
    {
      id: "comment-1",
      text: "Zinsbouw versoepeld voor betere leesbaarheid",
      position: 50, // Approximate position
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

  // Split document into segments with highlights
  const getHighlightedContent = () => {
    if (!documentContent) return "";
    
    // Simple implementation: highlight certain words/phrases
    let content = documentContent;
    
    // Highlight keywords that Saskia would review
    const highlightWords = [
      { word: "digitale transformatie", comment: reviewComments[0] },
      { word: "moderne zakelijke wereld", comment: reviewComments[1] },
      { word: "bedrijven", comment: reviewComments[0] },
      { word: "aanpassen", comment: reviewComments[1] },
    ];

    // Sort by length (longest first) to avoid partial matches
    highlightWords.sort((a, b) => b.word.length - a.word.length);

    highlightWords.forEach(({ word, comment }) => {
      const regex = new RegExp(`(${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
      content = content.replace(
        regex,
        `<mark class="bg-yellow-200/60 px-1 rounded relative group hover:bg-yellow-300/70 transition-colors" data-comment-id="${comment.id}">$1</mark>`
      );
    });

    return content || documentContent;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex">
      {/* Main Document Area with Highlights */}
      <div className="flex-1 overflow-auto p-8 bg-slate-50">
        <div className="max-w-4xl mx-auto bg-white min-h-full shadow-2xl p-16 relative">
          {/* Saskia's Werkbank Header */}
          <div className="mb-8 pb-6 border-b-2 border-gold">
            <div className="flex items-center gap-4 mb-2">
              <EditorAvatar size="md" showStatus={true} />
              <div>
                <h2 className="font-playfair text-2xl text-deep-black">
                  Saskia's Werkbank
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
            
            {/* Floating Comment Avatars - Positioned relative to highlighted marks */}
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

        {/* Complete Button */}
        <div className="p-6 border-t border-stone/30 flex-shrink-0">
          <button
            onClick={onComplete}
            className="w-full px-6 py-4 bg-gold text-deep-black rounded-lg font-ui text-sm font-medium uppercase tracking-wide hover:bg-gold/90 transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <CheckCircle size={20} />
            Redactie Voltooien & Vrijgeven
          </button>
        </div>
      </div>
    </div>
  );
}
