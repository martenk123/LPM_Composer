"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, FileCheck, Lock, Copy, FileDown, Sparkles as SparklesIcon, FileText, Scissors, ZoomIn, ZoomOut, RotateCcw, Info, HelpCircle, Send as SendIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useBrandVoice } from "../contexts/BrandVoiceContext";
import { useAccount } from "../contexts/AccountContext";
import EditorAvatar from "../components/EditorAvatar";
import ReviewPanel from "../components/ReviewPanel";

interface Message {
  id: number;
  type: "system" | "user";
  content: string;
  timestamp: string;
}

type DocumentStatus = "draft" | "in-review" | "approved" | "changes-requested" | "submitted-for-editing";

export default function ComposerPage() {
  const router = useRouter();
  const { settings, getVoiceLabel, updateSettings } = useBrandVoice();
  const { isPremium, submitDocumentForEditing, submittedDocuments, updateDocumentStatus } = useAccount();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content: "Hallo! La Plume is gereed. Wat wil je vandaag schrijven?",
      timestamp: "10:50",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBrandKitActive, setIsBrandKitActive] = useState(true);
  const [documentContent, setDocumentContent] = useState("");
  const [isAIWriting, setIsAIWriting] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>("draft");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [localToneFormal, setLocalToneFormal] = useState(settings.toneFormal);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);
  const [showActionTooltip, setShowActionTooltip] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);
  const documentContainerRef = useRef<HTMLDivElement>(null);

  // Sync local tone with settings when they change
  useEffect(() => {
    setLocalToneFormal(settings.toneFormal);
  }, [settings.toneFormal]);

  // Check if current document is in review (in-progress status)
  useEffect(() => {
    if (documentStatus === "submitted-for-editing" && submittedDocuments.length > 0 && documentContent) {
      // Find the most recent submitted document that matches current content
      const matchingDoc = submittedDocuments
        .filter((doc) => doc.content === documentContent && doc.status === "submitted-for-editing")
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
      
      if (matchingDoc) {
        // Check if document is "in-progress" based on age (same logic as dashboard)
        const docAge = Date.now() - new Date(matchingDoc.timestamp).getTime();
        const hoursOld = docAge / (1000 * 60 * 60);
        
        // If document is between 2-24 hours old, it's "in-progress"
        // Also allow manual activation via button, so we don't auto-activate
        // Auto-activation can be enabled by uncommenting the lines below:
        // if (hoursOld > 2 && hoursOld < 24) {
        //   setIsReviewMode(true);
        //   setCurrentDocumentId(matchingDoc.id);
        // }
      }
    }
  }, [documentStatus, submittedDocuments, documentContent]);

  // Calculate fit scale for document
  const [fitScale, setFitScale] = useState(1);

  useEffect(() => {
    const calculateFitScale = () => {
      if (documentContainerRef.current) {
        const container = documentContainerRef.current;
        const containerRect = container.getBoundingClientRect();
        
        // Calculate scale to fit with default margin (40px on each side)
        const margin = 40;
        const availableWidth = containerRect.width - (margin * 2);
        const availableHeight = containerRect.height - (margin * 2);
        
        // Document base width (max-w-3xl = 768px)
        const docWidth = 768;
        const docHeight = 1000; // min-h-[1000px]
        
        const scaleX = availableWidth / docWidth;
        const scaleY = availableHeight / docHeight;
        const calculatedFitScale = Math.min(scaleX, scaleY, 1); // Max 100% to fit
        
        setFitScale(calculatedFitScale);
      }
    };

    // Initial calculation
    calculateFitScale();
    
    // Listen for resize events
    window.addEventListener('resize', calculateFitScale);
    
    return () => {
      window.removeEventListener('resize', calculateFitScale);
    };
  }, []);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleSubmitForEditing = () => {
    setShowConfirmDialog(true);
  };

  const confirmSubmitForEditing = () => {
    if (documentContent.trim()) {
      submitDocumentForEditing(documentContent);
      setDocumentStatus("submitted-for-editing");
      setShowConfirmDialog(false);
    }
  };

  const cancelSubmitForEditing = () => {
    setShowConfirmDialog(false);
  };

  const handleReviewComplete = () => {
    if (currentDocumentId) {
      updateDocumentStatus(currentDocumentId, "completed");
      setIsReviewMode(false);
      setCurrentDocumentId(null);
      setDocumentStatus("approved");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Synchroniseer contentEditable div met documentContent state
  useEffect(() => {
    if (editableRef.current && !isAIWriting) {
      // Alleen updaten als de content anders is om cursor positie te behouden
      const currentText = editableRef.current.innerText || editableRef.current.textContent || "";
      if (currentText !== documentContent) {
        // Bewaar cursor positie
        const selection = window.getSelection();
        const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
        const cursorPosition = range ? range.startOffset : documentContent.length;
        
        // Update content
        editableRef.current.innerText = documentContent || "";
        
        // Herstel cursor positie
        if (range && editableRef.current.firstChild) {
          const newRange = document.createRange();
          newRange.setStart(editableRef.current.firstChild, Math.min(cursorPosition, documentContent.length));
          newRange.collapse(true);
          selection?.removeAllRanges();
          selection?.addRange(newRange);
        }
      }
    }
  }, [documentContent, isAIWriting]);

  // Update documentContent when AI generates text
  const updateDocumentContent = (newContent: string) => {
    setDocumentContent((prev) => {
      const updated = prev + (prev && !prev.endsWith(" ") ? " " : "") + newContent;
      
      // Update the contentEditable div directly for immediate visual feedback
      if (editableRef.current) {
        editableRef.current.innerText = updated;
        
        // Move cursor to end
        const range = document.createRange();
        const selection = window.getSelection();
        if (editableRef.current.lastChild) {
          range.setStartAfter(editableRef.current.lastChild);
          range.collapse(true);
        } else {
          range.selectNodeContents(editableRef.current);
          range.collapse(false);
        }
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      
      return updated;
    });
    
    // Scroll document to bottom as content grows
    if (documentRef.current) {
      setTimeout(() => {
        documentRef.current!.scrollTop = documentRef.current!.scrollHeight;
      }, 10);
    }
  };

  // Simulate API call with Brand Voice parameters
  const callAIChatAPI = async (userInput: string) => {
    // In production, this would be a real API call
    // Body parameters met Brand Voice settings
    const bodyParams = {
      message: userInput,
      brandVoice: {
        coreValues: settings.coreValues,
        forbiddenWords: settings.forbiddenWords,
        targetAudience: settings.targetAudience,
        toneFormal: settings.toneFormal,
        toneLength: settings.toneLength,
      },
    };

    // Simulate API call - in production: await fetch('/api/chat', { method: 'POST', body: JSON.stringify(bodyParams) })
    return generateContentWithBrandVoice(userInput, bodyParams.brandVoice);
  };

  const generateContentWithBrandVoice = (input: string, brandVoice: typeof settings): string => {
    const lowerInput = input.toLowerCase();
    
    // Apply Brand Voice settings
    const toneStyle = brandVoice.toneFormal >= 70 ? "formeel en professioneel" : brandVoice.toneFormal >= 40 ? "gebalanceerd" : "casual en toegankelijk";
    const lengthStyle = brandVoice.toneLength >= 70 ? "uitgebreid met veel detail" : brandVoice.toneLength >= 40 ? "middellang" : "bondig en direct";
    
    let baseContent = "";
    if (lowerInput.includes("artikel") || lowerInput.includes("article")) {
      baseContent = `In de hedendaagse wereld van digitale communicatie is het belang van weloverwogen geschreven content niet te onderschatten. ${input} vertegenwoordigt een kans om betekenisvolle verbindingen te leggen met je doelgroep.`;
    } else if (lowerInput.includes("social") || lowerInput.includes("campaign")) {
      baseContent = `Een effectieve social media campagne vereist meer dan alleen visuele aantrekkingskracht. Het gaat om het vertellen van een verhaal dat resoneert. ${input} vormt de basis voor een strategie die niet alleen aandacht trekt, maar ook engagement genereert.`;
    } else if (lowerInput.includes("herschrijf") || lowerInput.includes("rewrite")) {
      baseContent = `Herschrijven is een kunst die verder gaat dan simpelweg woorden vervangen. Het is een proces van verfijning, waarbij elke zin wordt geëvalueerd op helderheid, impact en authenticiteit.`;
    } else {
      baseContent = `${input} vormt het uitgangspunt voor een doordacht geschreven stuk. Door de essentie van je boodschap te distilleren en deze te presenteren met precisie en stijl, creëer je content die niet alleen informeert, maar ook inspireert.`;
    }

    // Add Brand Voice context
    return `${baseContent} De tekst is geschreven in een ${toneStyle} toon, ${lengthStyle} van opzet, gericht op ${brandVoice.targetAudience}. Core waarden: ${brandVoice.coreValues}.`;
  };

  const simulateAIWriting = (userInput: string) => {
    setIsAIWriting(true);
    
    // Call AI with Brand Voice parameters
    const contentToWrite = generateContentWithBrandVoice(userInput, settings);
    const words = contentToWrite.split(" ");
    let currentIndex = 0;
    
    const writeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const word = words[currentIndex];
        updateDocumentContent(word);
        currentIndex++;
      } else {
        clearInterval(writeInterval);
        setIsAIWriting(false);
      }
    }, 80); // Write one word every 80ms for smoother effect
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const userInputCopy = inputValue; // Save input before clearing
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // In production: await callAIChatAPI(userInputCopy) with Brand Voice parameters
    // Body parameters worden automatisch meegegeven via callAIChatAPI functie

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "system",
        content: "Ik ga dit nu voor je schrijven volgens je Brand Voice instellingen...",
        timestamp: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Start writing to document after another delay
      // AI output wordt automatisch naar documentContent geschreven via simulateAIWriting
      // Brand Voice parameters worden automatisch toegepast
      setTimeout(() => {
        simulateAIWriting(userInputCopy);
      }, 500);
    }, 800);
  };

  // Handle Quick Action buttons - stuur instructie naar chat met Brand Voice parameters
  const handleQuickAction = (action: "polish" | "lengthen" | "shorten") => {
    if (!documentContent.trim()) return;

    const instructions = {
      polish: "Polijst de tekst en maak deze professioneler en vloeiender.",
      lengthen: "Herschrijf de tekst en maak deze langer met meer detail en context.",
      shorten: "Herschrijf de tekst en maak deze korter en bondiger.",
    };

    const instruction = instructions[action];
    
    // Stuur instructie naar chat (met Brand Voice parameters in body)
    // In production: await callAIChatAPI(instruction)
    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: instruction,
      timestamp: new Date().toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "system",
        content: `Ik ga de tekst ${action === "polish" ? "polijsten" : action === "lengthen" ? "verlengen" : "verkorten"} volgens je Brand Voice instellingen...`,
        timestamp: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Start writing updated content to document
      setTimeout(() => {
        // Generate updated content based on action with Brand Voice applied
        let updatedContent = documentContent;
        if (action === "lengthen") {
          const extension = generateContentWithBrandVoice("uitbreiding", settings);
          updatedContent = documentContent + " " + extension;
        } else if (action === "shorten") {
          // Simulate shortening by taking first part
          const sentences = documentContent.split(".");
          updatedContent = sentences.slice(0, Math.max(1, Math.floor(sentences.length / 2))).join(".") + ".";
        } else {
          // Polish - apply Brand Voice refinement
          updatedContent = generateContentWithBrandVoice(documentContent, settings);
        }
        
        // Clear and rewrite
        setDocumentContent("");
        setTimeout(() => {
          simulateAIWriting(updatedContent);
        }, 300);
      }, 500);
    }, 800);
  };

  // Show ReviewPanel overlay when in review mode
  if (isReviewMode && documentContent) {
    return (
      <ReviewPanel
        documentContent={documentContent}
        documentId={currentDocumentId || ""}
        onComplete={handleReviewComplete}
      />
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Aside - Chat Interface (33%) */}
      <aside className="w-1/3 flex flex-col border-r border-stone bg-white">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === "user" ? "flex-row-reverse" : ""
              }`}
            >
              {/* Avatar - Only for system messages */}
              {message.type === "system" && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-stone/20 rounded-lg flex items-center justify-center border border-stone">
                    <Sparkles size={20} className="text-gold" />
                  </div>
                </div>
              )}

              {/* Message Content */}
              <div
                className={`flex-1 ${
                  message.type === "user" ? "flex flex-col items-end" : ""
                }`}
              >
                {message.type === "system" && (
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-ui uppercase tracking-wide text-deep-black/70 font-medium">
                      SYSTEM
                    </span>
                    <span className="text-xs text-deep-black/40 font-ui">
                      {message.timestamp}
                    </span>
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 ${
                    message.type === "system"
                      ? "bg-white border border-stone shadow-sm"
                      : "bg-deep-black text-white"
                  }`}
                >
                  <p
                    className={`${
                      message.type === "system"
                        ? "text-deep-black font-playfair text-base leading-relaxed"
                        : "text-white font-ui text-sm"
                    }`}
                  >
                    {message.content}
                  </p>
                </div>
                {message.type === "user" && (
                  <span className="text-xs text-deep-black/40 font-ui mt-1">
                    {message.timestamp}
                  </span>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area - Fixed at bottom */}
        <div className="border-t border-stone p-4 flex-shrink-0">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Spreek of typ je bericht..."
                className="w-full bg-off-white border border-stone rounded-lg px-4 py-3 pr-12 text-deep-black placeholder-deep-black/40 focus:outline-none focus:ring-2 focus:ring-gold/50 font-ui text-sm"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-gold/30 rounded-full flex items-center justify-center hover:bg-gold/40 transition-colors"
              >
                <Mic size={16} className="text-deep-black/70" />
              </button>
            </div>
            <button
              type="submit"
              disabled={!inputValue.trim() || isAIWriting}
              className="p-3 bg-deep-black text-white rounded-lg hover:bg-deep-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </aside>

      {/* Main - Document Section (66%) */}
      <main className="w-2/3 bg-slate-50 flex flex-col overflow-hidden">
        {/* Document Toolbar Header - Simplified met titel en iconen */}
        <div className="w-full flex items-center justify-between px-8 py-4 border-b border-stone/30 bg-white/95 backdrop-blur-sm z-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            {documentStatus === "in-review" && (
              <>
                <Lock size={18} className="text-gold" />
                <span className="px-3 py-1.5 bg-gold/20 text-gold rounded-full text-xs font-ui uppercase tracking-wide font-medium">
                  In Review
                </span>
              </>
            )}
            {documentStatus === "draft" && (
              <span className="px-3 py-1.5 bg-stone/30 text-deep-black/60 rounded-full text-xs font-ui uppercase tracking-wide font-medium">
                Draft
              </span>
            )}
            {documentStatus === "submitted-for-editing" && (
              <>
                <div className="flex items-center gap-2">
                  <EditorAvatar size="sm" showStatus={false} />
                  <Lock size={18} className="text-gold" />
                </div>
                <span className="px-3 py-1.5 bg-gold/20 text-gold rounded-full text-xs font-ui uppercase tracking-wide font-medium">
                  Ingezonden voor redactie
                </span>
              </>
            )}
            
            {/* Document Title met iconen */}
            <div className="flex items-center gap-2 pl-6 border-l border-stone/30">
              <h2 className="font-playfair text-lg text-deep-black">
                Document
              </h2>
              {/* Info icon met tooltip */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip("info")}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="p-1 hover:bg-stone/20 rounded transition-colors"
                >
                  <Info size={14} className="text-deep-black/50" />
                </button>
                {showTooltip === "info" && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-deep-black text-white rounded-lg p-3 text-xs font-ui z-50 shadow-lg">
                    <p>Dit is je document canvas. Type hier direct of laat de AI voor je schrijven via de chat.</p>
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-deep-black rotate-45"></div>
                  </div>
                )}
              </div>
              
              {/* Help icon met tooltip */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowTooltip("help")}
                  onMouseLeave={() => setShowTooltip(null)}
                  className="p-1 hover:bg-stone/20 rounded transition-colors"
                >
                  <HelpCircle size={14} className="text-deep-black/50" />
                </button>
                {showTooltip === "help" && (
                  <div className="absolute left-0 top-full mt-2 w-64 bg-deep-black text-white rounded-lg p-3 text-xs font-ui z-50 shadow-lg">
                    <p className="font-medium mb-1">Tips:</p>
                    <ul className="list-disc list-inside space-y-1 text-deep-black/80">
                      <li>Gebruik de Quick Actions onderaan voor snelle aanpassingen</li>
                      <li>Pas de tone aan via de slider in de toolbar</li>
                      <li>Zoom in/uit met de zoom controls</li>
                    </ul>
                    <div className="absolute -top-1 left-4 w-2 h-2 bg-deep-black rotate-45"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Document Container - Scrollable with fit to screen */}
        <div
          ref={documentContainerRef}
          className="flex-1 overflow-auto flex items-start justify-center p-10"
          style={{ minHeight: 0 }}
        >
          {/* Wit vel papier */}
          <div
            ref={documentRef}
            className={`max-w-3xl w-full bg-white min-h-[1000px] shadow-2xl relative transition-transform duration-200 ${
              documentStatus === "in-review" ? "border-2 border-gold" : ""
            }`}
            style={{
              transform: `scale(${fitScale * (zoomLevel / 100)})`,
              transformOrigin: "top center",
            }}
          >

          {/* La Plume Watermark - Top Right */}
          <div className="absolute top-20 right-8 opacity-10 pointer-events-none">
            <h1 className="font-playfair text-2xl text-deep-black">
              La Plume
            </h1>
          </div>

            {/* Editable Content Area - Gekoppeld aan documentContent state */}
            <div
              ref={editableRef}
              contentEditable={documentStatus === "draft" && !isAIWriting}
              suppressContentEditableWarning
              onInput={(e) => {
                const target = e.currentTarget;
                const text = target.innerText || target.textContent || "";
                // Update documentContent state wanneer gebruiker handmatig typt
                // AI output wordt automatisch bijgewerkt via updateDocumentContent functie
                if (!isAIWriting && documentStatus === "draft") {
                  setDocumentContent(text);
                }
              }}
              onKeyDown={(e) => {
                // Prevent editing when document is submitted
                if (documentStatus === "submitted-for-editing") {
                  e.preventDefault();
                }
              }}
              className={`w-full h-full p-16 focus:outline-none font-playfair text-deep-black ${
                documentStatus === "in-review" || documentStatus === "submitted-for-editing" ? "cursor-not-allowed opacity-90" : ""
              }`}
              style={{ 
                lineHeight: "1.6",
                minHeight: "100%",
              }}
              data-placeholder="Begin hier met schrijven..."
            >
              {documentContent}
            </div>
            
            {/* Placeholder styling */}
            <style jsx>{`
              [contenteditable][data-placeholder]:empty:before {
                content: attr(data-placeholder);
                color: rgba(10, 10, 10, 0.3);
                pointer-events: none;
              }
              [contenteditable="false"] {
                user-select: none;
              }
            `}</style>
          </div>
        </div>
      </main>

      {/* Quick Action Bar - Fixed at bottom met alle tools (alleen iconen) */}
      <div className="fixed bottom-6 left-1/3 right-0 flex justify-center z-50 px-8">
        <div className="bg-white rounded-lg shadow-xl border border-stone/40 px-4 py-3 flex items-center gap-2.5">
          {/* Quick Actions - Alleen iconen met uitgebreide tooltips */}
          <div className="relative group">
            <button
              onClick={() => handleQuickAction("polish")}
              disabled={!documentContent.trim() || isAIWriting}
              onMouseEnter={() => setShowActionTooltip("polish")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-2.5 bg-gold/10 text-deep-black rounded-lg hover:bg-gold/20 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <SparklesIcon size={18} />
            </button>
            {showActionTooltip === "polish" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                <div className="font-semibold mb-1">Polijst</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Verbeter de tekst met AI: grammatica, stijl en duidelijkheid worden geoptimaliseerd.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>
          
          <div className="relative group">
            <button
              onClick={() => handleQuickAction("lengthen")}
              disabled={!documentContent.trim() || isAIWriting}
              onMouseEnter={() => setShowActionTooltip("lengthen")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-2.5 bg-gold/10 text-deep-black rounded-lg hover:bg-gold/20 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FileText size={18} />
            </button>
            {showActionTooltip === "lengthen" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                <div className="font-semibold mb-1">Langer</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Maak de tekst uitgebreider met meer details, voorbeelden en context.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>
          
          <div className="relative group">
            <button
              onClick={() => handleQuickAction("shorten")}
              disabled={!documentContent.trim() || isAIWriting}
              onMouseEnter={() => setShowActionTooltip("shorten")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-2.5 bg-gold/10 text-deep-black rounded-lg hover:bg-gold/20 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Scissors size={18} />
            </button>
            {showActionTooltip === "shorten" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                <div className="font-semibold mb-1">Korter</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Verkort de tekst tot de essentie: behoud de kernboodschap, verwijder overbodige woorden.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-stone/30 mx-0.5"></div>

          {/* Tone of Voice Slider - Compact met tooltip */}
          <div 
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-stone/10 transition-colors relative group"
            onMouseEnter={() => setShowActionTooltip("tone")}
            onMouseLeave={() => setShowActionTooltip(null)}
          >
            <span className="text-xs font-ui text-deep-black/50 font-medium">Tone</span>
            <div className="flex items-center gap-1.5 w-32">
              <span className="text-[10px] font-ui text-deep-black/40 font-medium">C</span>
              <input
                type="range"
                min="0"
                max="100"
                value={localToneFormal}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setLocalToneFormal(value);
                  updateSettings({ toneFormal: value });
                }}
                className="flex-1 h-1.5 bg-stone rounded-lg appearance-none cursor-pointer accent-gold hover:accent-gold/80 transition-colors"
                style={{
                  background: `linear-gradient(to right, #D4C5A5 0%, #D4C5A5 ${localToneFormal}%, #d6d3d1 ${localToneFormal}%, #d6d3d1 100%)`,
                }}
              />
              <span className="text-[10px] font-ui text-deep-black/40 font-medium">F</span>
            </div>
            <span className="text-xs font-ui text-deep-black/70 font-medium min-w-[55px] text-right">
              {localToneFormal >= 70 ? "Formal" : localToneFormal >= 40 ? "Balanced" : "Casual"}
            </span>
            {showActionTooltip === "tone" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[220px] border border-stone/20">
                <div className="font-semibold mb-1">Tone of Voice</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Pas de formele toon aan: van casual (C) naar formeel (F). Dit beïnvloedt hoe de AI schrijft.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-stone/30 mx-0.5"></div>

          {/* Zoom Controls - Compact */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 bg-stone/20 rounded-lg border border-stone/30 hover:bg-stone/30 transition-colors">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              onMouseEnter={() => setShowActionTooltip("zoom-out")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-1.5 hover:bg-stone/40 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative hover:scale-110 disabled:hover:scale-100"
            >
              <ZoomOut size={16} className="text-deep-black/70" />
              {showActionTooltip === "zoom-out" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[180px] border border-stone/20">
                  <div className="font-semibold mb-1">Zoom uit</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Verklein de weergave van het document voor een beter overzicht.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </button>
            <span className="text-xs font-ui text-deep-black/70 font-medium min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              onMouseEnter={() => setShowActionTooltip("zoom-in")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-1.5 hover:bg-stone/40 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed relative hover:scale-110 disabled:hover:scale-100"
            >
              <ZoomIn size={16} className="text-deep-black/70" />
              {showActionTooltip === "zoom-in" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[180px] border border-stone/20">
                  <div className="font-semibold mb-1">Zoom in</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Vergroot de weergave van het document voor betere leesbaarheid.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </button>
            <button
              onClick={handleZoomReset}
              onMouseEnter={() => setShowActionTooltip("zoom-reset")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-1.5 hover:bg-stone/40 rounded transition-all duration-200 relative hover:scale-110"
            >
              <RotateCcw size={16} className="text-deep-black/70" />
              {showActionTooltip === "zoom-reset" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[180px] border border-stone/20">
                  <div className="font-semibold mb-1">Reset zoom</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Herstel de zoom naar 100% voor standaard weergave.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </button>
          </div>

          {/* Divider */}
          <div className="w-px h-10 bg-stone/30 mx-0.5"></div>

          {/* Copy Button - Alleen icoon */}
          <div className="relative group">
            <button
              onClick={() => {
                if (documentContent && typeof window !== "undefined") {
                  navigator.clipboard.writeText(documentContent);
                }
              }}
              disabled={!documentContent}
              onMouseEnter={() => setShowActionTooltip("copy")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-2.5 bg-white border border-stone rounded-lg hover:bg-stone/20 hover:border-stone/60 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <Copy size={18} className="text-deep-black/70" />
            </button>
            {showActionTooltip === "copy" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                <div className="font-semibold mb-1">Kopieer tekst</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Kopieer de volledige documentinhoud naar het klembord voor gebruik elders.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>
          
          {/* Export Button - Alleen icoon */}
          <div className="relative group">
            <button
              onClick={() => {
                if (documentContent && typeof window !== "undefined") {
                  const blob = new Blob([documentContent], { type: 'text/plain' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = 'document.txt';
                  a.click();
                  URL.revokeObjectURL(url);
                }
              }}
              disabled={!documentContent}
              onMouseEnter={() => setShowActionTooltip("export")}
              onMouseLeave={() => setShowActionTooltip(null)}
              className="p-2.5 bg-white border border-stone rounded-lg hover:bg-stone/20 hover:border-stone/60 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <FileDown size={18} className="text-deep-black/70" />
            </button>
            {showActionTooltip === "export" && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                <div className="font-semibold mb-1">Export naar PDF</div>
                <div className="text-white/80 text-[11px] leading-relaxed">
                  Download het document als tekstbestand voor gebruik elders.
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
              </div>
            )}
          </div>
          
          {/* Premium: Opsturen voor redactie Button met Avatar */}
          {isPremium && documentStatus === "draft" && (
            <>
              {/* Divider */}
              <div className="w-px h-10 bg-stone/30 mx-0.5"></div>
              
              {/* Saskia Avatar */}
              <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-stone/10 transition-colors">
                <EditorAvatar size="sm" showStatus={true} />
                <div className="flex flex-col">
                  <span className="text-xs font-ui text-deep-black/70 font-medium">Saskia</span>
                  <span className="text-[10px] font-ui text-green-600">is online</span>
                </div>
              </div>
              
              <div className="relative group">
                <button
                  onClick={handleSubmitForEditing}
                  disabled={!documentContent.trim()}
                  onMouseEnter={() => setShowActionTooltip("submit-editing")}
                  onMouseLeave={() => setShowActionTooltip(null)}
                  className="p-2.5 bg-gold text-deep-black rounded-lg hover:bg-gold/90 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
                >
                  <SendIcon size={18} />
                </button>
                {showActionTooltip === "submit-editing" && (
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[240px] border border-stone/20">
                    <div className="font-semibold mb-1">Opsturen voor redactie</div>
                    <div className="text-white/80 text-[11px] leading-relaxed">
                      Stuur dit document naar Saskia voor professionele redactie. Zij controleert op grammatica, stijl en duidelijkheid.
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                  </div>
                )}
              </div>
            </>
          )}
          
          {/* Review Button - Alleen icoon (voor non-premium) */}
          {!isPremium && documentStatus === "draft" && (
            <div className="relative group">
              <button
                onClick={() => {
                  setDocumentStatus("in-review");
                  if (typeof window !== "undefined") {
                    localStorage.setItem("reviewDocument", JSON.stringify({
                      content: documentContent,
                      timestamp: new Date().toISOString(),
                    }));
                  }
                }}
                onMouseEnter={() => setShowActionTooltip("review")}
                onMouseLeave={() => setShowActionTooltip(null)}
                className="p-2.5 bg-gold text-deep-black rounded-lg hover:bg-gold/90 hover:scale-105 transition-all duration-200"
              >
                <FileCheck size={18} />
              </button>
              {showActionTooltip === "review" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[220px] border border-stone/20">
                  <div className="font-semibold mb-1">Redactionele Review Aanvragen</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Vraag een redactionele review aan voor dit document. Upgrade naar Premium voor professionele redactie door Saskia.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </div>
          )}
          {documentStatus === "in-review" && (
            <div className="relative group">
              <button
                onClick={() => router.push("/review")}
                onMouseEnter={() => setShowActionTooltip("view-review")}
                onMouseLeave={() => setShowActionTooltip(null)}
                className="p-2.5 bg-gold/20 text-gold rounded-lg hover:bg-gold/30 hover:scale-105 transition-all duration-200 border border-gold/30"
              >
                <FileCheck size={18} />
              </button>
              {showActionTooltip === "view-review" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                  <div className="font-semibold mb-1">Bekijk in Review Panel</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Bekijk dit document in het review panel voor goedkeuring of wijzigingen.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </div>
          )}
          {documentStatus === "submitted-for-editing" && (
            <div className="relative group">
              <button
                onClick={() => {
                  // Find matching document and activate review mode
                  const matchingDoc = submittedDocuments
                    .filter((doc) => doc.content === documentContent)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                  
                  if (matchingDoc) {
                    setCurrentDocumentId(matchingDoc.id);
                    setIsReviewMode(true);
                  }
                }}
                onMouseEnter={() => setShowActionTooltip("view-review")}
                onMouseLeave={() => setShowActionTooltip(null)}
                className="p-2.5 bg-gold/20 text-gold rounded-lg border border-gold/30 hover:bg-gold/30 hover:scale-105 transition-all duration-200"
              >
                <FileCheck size={18} />
              </button>
              {showActionTooltip === "view-review" && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-deep-black text-white rounded-lg text-xs font-ui z-50 shadow-2xl max-w-[200px] border border-stone/20">
                  <div className="font-semibold mb-1">Bekijk in Review Panel</div>
                  <div className="text-white/80 text-[11px] leading-relaxed">
                    Open Saskia's werkbank om de redactie te bekijken.
                  </div>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-deep-black rotate-45 border-r border-b border-stone/20"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bevestigingsdialoog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl border border-stone p-8 max-w-md mx-4 animate-fade-in">
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <EditorAvatar size="lg" showStatus={true} />
                <div>
                  <h3 className="font-playfair text-2xl text-deep-black mb-1">
                    Document opsturen voor redactie?
                  </h3>
                  <p className="font-ui text-xs text-deep-black/60">
                    Saskia (Jouw Redacteur) is online
                  </p>
                </div>
              </div>
              <p className="font-ui text-deep-black/70 text-sm leading-relaxed">
                Wil je dit document naar Saskia sturen voor professionele redactie?
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={cancelSubmitForEditing}
                className="flex-1 px-6 py-3 bg-stone/30 text-deep-black rounded-md font-ui text-sm font-medium hover:bg-stone/40 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={confirmSubmitForEditing}
                disabled={!documentContent.trim()}
                className="flex-1 px-6 py-3 bg-gold text-deep-black rounded-md font-ui text-sm font-medium uppercase tracking-wide hover:bg-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Bevestigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
