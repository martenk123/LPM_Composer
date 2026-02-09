"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, FileText, TrendingUp, Target, Edit2, X, MessageCircle, Clock, CheckCircle, Loader } from "lucide-react";
import Link from "next/link";
import { useAccount } from "./contexts/AccountContext";
import EditorAvatar from "./components/EditorAvatar";

interface Message {
  id: number;
  type: "system" | "user";
  content: string;
  timestamp: string;
}

type EditingStatus = "waiting" | "in-progress" | "completed";
type FilterStatus = "all" | EditingStatus;

interface EditingDocument {
  id: string;
  content: string;
  timestamp: string;
  status: EditingStatus;
}

export default function Home() {
  const { isPremium, submittedDocuments } = useAccount();
  const [statusFilter, setStatusFilter] = useState<FilterStatus>("all");
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (isChatOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isChatOpen]);

  // Focus input when chat opens
  useEffect(() => {
    if (isChatOpen && chatInputRef.current) {
      setTimeout(() => {
        chatInputRef.current?.focus();
      }, 100);
    }
  }, [isChatOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setChatInput("");

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: messages.length + 2,
        type: "system",
        content: "Ik begrijp het. Laat me je helpen met dat.",
        timestamp: new Date().toLocaleTimeString("nl-NL", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  };

  const recentProjects = [
    { id: 1, name: "Q3 Strategy", type: "Article", updated: "2 hours ago", status: "Draft" },
    { id: 2, name: "LinkedIn Post", type: "Social", updated: "5 hours ago", status: "Published" },
    { id: 3, name: "Product Launch", type: "Campaign", updated: "1 day ago", status: "Review" },
  ];

  const quickActions = [
    { name: "New Article", icon: FileText, href: "/composer?type=article", description: "Start een nieuw artikel" },
    { name: "Social Campaign", icon: Sparkles, href: "/composer?type=social", description: "Creëer social content" },
    { name: "Rewrite", icon: Edit2, href: "/composer?type=rewrite", description: "Herschrijf bestaande tekst" },
  ];

  const stats = [
    { label: "Actieve Projecten", value: "12", icon: FileText, color: "text-gold" },
    { label: "Woorden Gegenereerd", value: "24,583", icon: TrendingUp, color: "text-gold" },
    { label: "Toon Consistentie", value: "98%", icon: Target, color: "text-gold" },
  ];

  // Transform submitted documents to editing documents with status
  const editingDocuments: EditingDocument[] = submittedDocuments.map((doc) => {
    // Simulate status based on age (in real app, this would come from backend)
    let status: EditingStatus = "waiting";
    const docAge = Date.now() - new Date(doc.timestamp).getTime();
    const hoursOld = docAge / (1000 * 60 * 60);
    
    if (hoursOld > 24) {
      status = "completed";
    } else if (hoursOld > 2) {
      status = "in-progress";
    } else {
      status = "waiting";
    }
    
    return {
      id: doc.id,
      content: doc.content,
      timestamp: doc.timestamp,
      status,
    };
  });

  return (
    <>
    <div className="min-h-screen bg-off-white pb-32">
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-5xl text-deep-black mb-2">
            Dashboard
          </h1>
          <p className="font-ui text-deep-black/60 text-sm uppercase tracking-wider">
            Overzicht van je werkruimte
          </p>
        </div>

        {/* Grid met 3 kolommen */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Kolom 1: Recente Projecten */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone p-6 h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl text-deep-black">
                  Recente Projecten
                </h2>
                <Link
                  href="/projects"
                  className="text-xs font-ui text-deep-black/60 uppercase tracking-wide hover:text-gold transition-colors"
                >
                  Bekijk alle
                </Link>
              </div>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href="/composer"
                    className="block p-4 rounded-lg border border-stone/50 hover:border-gold hover:bg-off-white/50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-playfair text-base text-deep-black group-hover:text-gold transition-colors">
                        {project.name}
                      </h3>
                      <span
                        className={`text-xs font-ui px-2 py-1 rounded-full ${
                          project.status === "Published"
                            ? "bg-gold/20 text-gold"
                            : project.status === "Draft"
                            ? "bg-stone/30 text-deep-black/60"
                            : "bg-stone/20 text-deep-black/50"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-ui text-deep-black/50">
                      <span className="uppercase tracking-wide">{project.type}</span>
                      <span>•</span>
                      <span>{project.updated}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Kolom 2: Snel Acties */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone p-6 h-full">
              <h2 className="font-playfair text-2xl text-deep-black mb-6">
                Snel Acties
              </h2>
              <div className="space-y-4">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.name}
                      href={action.href}
                      className="flex items-center gap-4 p-4 rounded-lg border border-stone/50 hover:border-gold hover:bg-off-white/50 transition-all group"
                    >
                      <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <Icon size={24} className="text-gold" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-playfair text-base text-deep-black group-hover:text-gold transition-colors mb-1">
                          {action.name}
                        </h3>
                        <p className="font-ui text-xs text-deep-black/50 uppercase tracking-wide">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Kolom 3: Statistieken */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-stone p-6 h-full">
              <h2 className="font-playfair text-2xl text-deep-black mb-6">
                Statistieken
              </h2>
              <div className="space-y-6">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="pb-6 border-b border-stone/50 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-ui text-sm uppercase tracking-wider text-deep-black/60">
                          {stat.label}
                        </h3>
                        <Icon size={20} className={stat.color} />
                      </div>
                      <p className="font-playfair text-4xl text-deep-black">
                        {stat.value}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Redactie Queue - Alleen voor Premium */}
        {isPremium && (
          <div className="bg-white rounded-lg border border-stone mb-8">
            <div className="p-6 border-b border-stone">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <EditorAvatar size="md" showStatus={true} />
                  <div>
                    <h2 className="font-playfair text-2xl text-deep-black">
                      Redactie Queue
                    </h2>
                    <p className="font-ui text-sm text-deep-black/60">
                      Overzicht van ingezonden documenten bij Saskia
                    </p>
                  </div>
                </div>
                {editingDocuments.length > 0 && (
                  <div className="text-right">
                    <div className="font-playfair text-3xl text-deep-black">
                      {editingDocuments.length}
                    </div>
                    <div className="font-ui text-xs text-deep-black/60 uppercase tracking-wide">
                      {editingDocuments.length === 1 ? "Document" : "Documenten"}
                    </div>
                  </div>
                )}
              </div>

              {/* Status Filter Tabs */}
              {editingDocuments.length > 0 && (
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded-lg text-xs font-ui uppercase tracking-wide transition-all duration-200 ${
                      statusFilter === "all"
                        ? "bg-deep-black text-white"
                        : "bg-stone/20 text-deep-black/60 hover:bg-stone/30"
                    }`}
                  >
                    Alle ({editingDocuments.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("waiting")}
                    className={`px-4 py-2 rounded-lg text-xs font-ui uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
                      statusFilter === "waiting"
                        ? "bg-stone/40 text-deep-black"
                        : "bg-stone/20 text-deep-black/60 hover:bg-stone/30"
                    }`}
                  >
                    <Clock size={14} />
                    Wachtend ({editingDocuments.filter((d) => d.status === "waiting").length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("in-progress")}
                    className={`px-4 py-2 rounded-lg text-xs font-ui uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
                      statusFilter === "in-progress"
                        ? "bg-gold/30 text-gold"
                        : "bg-stone/20 text-deep-black/60 hover:bg-stone/30"
                    }`}
                  >
                    <Loader size={14} className="animate-spin" />
                    In behandeling ({editingDocuments.filter((d) => d.status === "in-progress").length})
                  </button>
                  <button
                    onClick={() => setStatusFilter("completed")}
                    className={`px-4 py-2 rounded-lg text-xs font-ui uppercase tracking-wide transition-all duration-200 flex items-center gap-2 ${
                      statusFilter === "completed"
                        ? "bg-green-500/20 text-green-700"
                        : "bg-stone/20 text-deep-black/60 hover:bg-stone/30"
                    }`}
                  >
                    <CheckCircle size={14} />
                    Klaar ({editingDocuments.filter((d) => d.status === "completed").length})
                  </button>
                </div>
              )}
            </div>
            
            {editingDocuments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-stone/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText size={32} className="text-deep-black/40" />
                </div>
                <p className="font-ui text-deep-black/60 mb-2">
                  Nog geen documenten ingezonden voor redactie
                </p>
                <p className="font-ui text-sm text-deep-black/40">
                  Stuur je eerste document vanuit de Composer
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone/50">
                {editingDocuments
                  .filter((doc) => statusFilter === "all" || doc.status === statusFilter)
                  .map((doc) => {
                    const statusConfig = {
                      waiting: {
                        label: "Wachtend",
                        icon: Clock,
                        color: "bg-stone/30 text-deep-black/60",
                        iconColor: "text-deep-black/50",
                        bgColor: "bg-stone/10",
                      },
                      "in-progress": {
                        label: "In behandeling",
                        icon: Loader,
                        color: "bg-gold/20 text-gold",
                        iconColor: "text-gold",
                        bgColor: "bg-gold/5",
                      },
                      completed: {
                        label: "Klaar",
                        icon: CheckCircle,
                        color: "bg-green-500/20 text-green-700",
                        iconColor: "text-green-700",
                        bgColor: "bg-green-500/5",
                      },
                    };

                    const config = statusConfig[doc.status];
                    const StatusIcon = config.icon;
                    const preview = doc.content.substring(0, 120) + (doc.content.length > 120 ? "..." : "");
                    const date = new Date(doc.timestamp);
                    const timeAgo = Math.floor((Date.now() - date.getTime()) / (1000 * 60 * 60));

                    return (
                      <div
                        key={doc.id}
                        className={`p-6 hover:bg-off-white/50 transition-colors ${config.bgColor}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* Saskia Avatar */}
                          <div className="flex-shrink-0">
                            <EditorAvatar size="md" showStatus={true} />
                          </div>

                          {/* Document Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-playfair text-lg text-deep-black">
                                    Document {doc.id.split("-")[1]}
                                  </h3>
                                  {/* Status Badge - Inline */}
                                  <div
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-ui uppercase tracking-wide font-medium ${config.color}`}
                                  >
                                    <StatusIcon size={12} className={config.iconColor} />
                                    {config.label}
                                  </div>
                                </div>
                                <p className="font-ui text-sm text-deep-black/70 line-clamp-2 mb-3 leading-relaxed">
                                  {preview}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-ui text-deep-black/50">
                                  <span>
                                    Ingezonden: {date.toLocaleDateString("nl-NL", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })} om {date.toLocaleTimeString("nl-NL", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                  <span className="text-deep-black/40">•</span>
                                  <span>
                                    {timeAgo < 1
                                      ? "Net ingezonden"
                                      : timeAgo < 24
                                      ? `${timeAgo} uur geleden`
                                      : `${Math.floor(timeAgo / 24)} dag${Math.floor(timeAgo / 24) > 1 ? "en" : ""} geleden`}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {editingDocuments.filter((doc) => statusFilter === "all" || doc.status === statusFilter).length === 0 && (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-stone/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText size={32} className="text-deep-black/40" />
                    </div>
                    <p className="font-ui text-deep-black/60 mb-2">
                      Geen documenten met deze status
                    </p>
                    <button
                      onClick={() => setStatusFilter("all")}
                      className="font-ui text-sm text-gold hover:text-gold/80 transition-colors underline"
                    >
                      Bekijk alle documenten
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>

      {/* Floating Chat Widget - Rechtsonder */}
      {isChatOpen && (
        <div className="fixed bottom-8 right-8 w-80 h-[420px] bg-white rounded-lg shadow-2xl border border-stone flex flex-col z-[100] animate-fade-in">
          {/* Chat Header */}
          <div className="px-4 py-3 bg-deep-black rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gold/20 rounded flex items-center justify-center">
                <Sparkles size={14} className="text-gold" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-playfair text-sm">
                  De Pen
                </span>
                <span className="text-white/60 font-ui text-[10px] uppercase tracking-wide">
                  Je schrijfmaatje
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-deep-black/50 rounded transition-colors"
            >
              <X size={16} className="text-white" />
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-off-white/30">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-2 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "system" && (
                    <div className="w-6 h-6 bg-white rounded flex items-center justify-center border border-stone flex-shrink-0">
                      <Sparkles size={12} className="text-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg p-2.5 ${
                      message.type === "user"
                        ? "bg-deep-black text-white"
                        : "bg-white border border-stone text-deep-black"
                    }`}
                  >
                    <p className={`text-xs leading-relaxed ${
                      message.type === "system" ? "font-playfair" : "font-ui"
                    }`}>
                      {message.content}
                    </p>
                    <p className="text-[10px] mt-1 opacity-60">
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="px-4 py-3 border-t border-stone bg-white">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    ref={chatInputRef}
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Typ je bericht..."
                    className="w-full bg-off-white rounded-lg px-3 py-2 pr-16 text-deep-black placeholder-deep-black/40 focus:outline-none focus:ring-2 focus:ring-gold/50 font-ui text-xs border border-stone"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2">
                    <span className="text-[10px] text-deep-black/40 font-mono">
                      CMD + ENTER
                    </span>
                  </div>
                </div>
                <button
                  type="submit"
                  className="p-2 bg-deep-black text-white rounded-lg hover:bg-gold hover:text-deep-black transition-colors flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Button om chat te openen - Wanneer gesloten */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gold rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 z-[100] group"
          aria-label="Open chat"
        >
          <MessageCircle size={24} className="text-deep-black group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}
    </>
  );
}
