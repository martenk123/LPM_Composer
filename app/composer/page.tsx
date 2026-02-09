"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Mic, Sparkles, FileCheck, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: number;
  type: "system" | "user";
  content: string;
  timestamp: string;
}

type DocumentStatus = "draft" | "in-review" | "approved" | "changes-requested";

export default function ComposerPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "system",
      content: "Hallo! Het La Plume Intelligence platform is gereed. Wat wil je vandaag schrijven?",
      timestamp: "10:50",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isBrandKitActive, setIsBrandKitActive] = useState(true);
  const [documentContent, setDocumentContent] = useState("");
  const [isAIWriting, setIsAIWriting] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>("draft");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const editableRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIWriting = (userInput: string) => {
    setIsAIWriting(true);
    
    // Generate content based on user input
    const generateContent = (input: string): string => {
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes("artikel") || lowerInput.includes("article")) {
        return `In de hedendaagse wereld van digitale communicatie is het belang van weloverwogen geschreven content niet te onderschatten. ${input} vertegenwoordigt een kans om betekenisvolle verbindingen te leggen met je doelgroep. Door zorgvuldig te kiezen voor de juiste toon, structuur en boodschap, creëer je niet alleen informatie, maar ook waarde.`;
      } else if (lowerInput.includes("social") || lowerInput.includes("campaign")) {
        return `Een effectieve social media campagne vereist meer dan alleen visuele aantrekkingskracht. Het gaat om het vertellen van een verhaal dat resoneert. ${input} vormt de basis voor een strategie die niet alleen aandacht trekt, maar ook engagement genereert en duurzame relaties opbouwt.`;
      } else if (lowerInput.includes("herschrijf") || lowerInput.includes("rewrite")) {
        return `Herschrijven is een kunst die verder gaat dan simpelweg woorden vervangen. Het is een proces van verfijning, waarbij elke zin wordt geëvalueerd op helderheid, impact en authenticiteit. ${input} transformeren betekent de kern behouden terwijl de presentatie wordt geoptimaliseerd voor maximale effectiviteit.`;
      } else {
        return `${input} vormt het uitgangspunt voor een doordacht geschreven stuk. Door de essentie van je boodschap te distilleren en deze te presenteren met precisie en stijl, creëer je content die niet alleen informeert, maar ook inspireert en overtuigt.`;
      }
    };

    const contentToWrite = generateContent(userInput);
    const words = contentToWrite.split(" ");
    let currentIndex = 0;

    let accumulatedContent = documentContent;
    
    const writeInterval = setInterval(() => {
      if (currentIndex < words.length) {
        const word = words[currentIndex];
        accumulatedContent = accumulatedContent + (accumulatedContent && !accumulatedContent.endsWith(" ") ? " " : "") + word;
        
        // Update state
        setDocumentContent(accumulatedContent);
        
        // Update the contentEditable div directly for immediate visual feedback
        if (editableRef.current) {
          editableRef.current.innerText = accumulatedContent;
          
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
        
        currentIndex++;

        // Scroll document to bottom as content grows
        if (documentRef.current) {
          setTimeout(() => {
            documentRef.current!.scrollTop = documentRef.current!.scrollHeight;
          }, 10);
        }
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

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "system",
        content: "Ik ga dit nu voor je schrijven...",
        timestamp: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);

      // Start writing to document after another delay
      setTimeout(() => {
        simulateAIWriting(
          `Dit is een voorbeeld van hoe de AI de tekst schrijft op basis van je input: "${inputValue}". De tekst verschijnt geleidelijk in het document aan de rechterkant.`
        );
      }, 500);
    }, 800);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-off-white">
      {/* Left Panel - Chat Interface (40%) */}
      <div className="w-[40%] flex flex-col border-r border-stone bg-white">
        {/* Header */}
        <header className="w-full bg-deep-black h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-white uppercase font-ui tracking-[0.2em] text-sm font-medium">
              INTELLIGENCE
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {/* Brand Kit Toggle */}
            <div className="flex items-center gap-3">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBrandKitActive}
                  onChange={(e) => setIsBrandKitActive(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone/30 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gold/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold"></div>
              </label>
              {isBrandKitActive && (
                <span className="text-xs font-ui text-gold uppercase tracking-wide">
                  Voice: Professional
                </span>
              )}
            </div>
          </div>
        </header>

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
      </div>

      {/* Right Panel - Canvas/Document (60%) */}
      <div className="w-[60%] bg-[#F0F0F0] flex items-center justify-center p-8 overflow-y-auto">
        {/* The Stationery (Briefpapier) - A4 Aspect Ratio */}
        <div
          ref={documentRef}
          className={`w-full max-w-[210mm] bg-white shadow-lg relative ${
            documentStatus === "in-review" ? "border-2 border-gold" : ""
          }`}
          style={{
            aspectRatio: "210 / 297", // A4 ratio
            minHeight: "297mm",
          }}
        >
          {/* Document Header */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-6 py-4 border-b border-stone/30 bg-white/80 backdrop-blur-sm z-10">
            <div className="flex items-center gap-3">
              {documentStatus === "in-review" && (
                <>
                  <Lock size={16} className="text-gold" />
                  <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-ui uppercase tracking-wide">
                    In Review
                  </span>
                </>
              )}
              {documentStatus === "draft" && (
                <span className="px-3 py-1 bg-stone/30 text-deep-black/60 rounded-full text-xs font-ui uppercase tracking-wide">
                  Draft
                </span>
              )}
            </div>
            {documentStatus === "draft" && (
              <button
                onClick={() => {
                  setDocumentStatus("in-review");
                  // Store document for review
                  localStorage.setItem("reviewDocument", JSON.stringify({
                    content: documentContent,
                    timestamp: new Date().toISOString(),
                  }));
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gold text-deep-black rounded-md font-ui text-sm font-medium uppercase tracking-wide hover:bg-gold/90 transition-colors"
              >
                <FileCheck size={16} />
                Request Editorial Review
              </button>
            )}
            {documentStatus === "in-review" && (
              <button
                onClick={() => router.push("/review")}
                className="flex items-center gap-2 px-4 py-2 bg-gold/20 text-gold rounded-md font-ui text-sm font-medium uppercase tracking-wide hover:bg-gold/30 transition-colors border border-gold/30"
              >
                View in Review Panel
              </button>
            )}
          </div>

          {/* La Plume Watermark - Top Right */}
          <div className="absolute top-20 right-8 opacity-10 pointer-events-none">
            <div className="flex flex-col items-end">
              <h1 className="font-playfair text-2xl text-deep-black">
                La Plume
              </h1>
              <p className="font-ui text-xs text-deep-black uppercase tracking-wider">
                Intelligence
              </p>
            </div>
          </div>

          {/* Editable Content Area */}
          <div
            ref={editableRef}
            contentEditable={documentStatus === "draft"}
            suppressContentEditableWarning
            onInput={(e) => {
              const target = e.currentTarget;
              const text = target.innerText || target.textContent || "";
              if (!isAIWriting && documentStatus === "draft") {
                setDocumentContent(text);
              }
            }}
            className={`w-full h-full p-16 focus:outline-none font-playfair text-deep-black ${
              documentStatus === "in-review" ? "cursor-not-allowed opacity-90" : ""
            }`}
            style={{ 
              lineHeight: "1.6",
              minHeight: "100%",
              paddingTop: "80px", // Account for header
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
    </div>
  );
}
