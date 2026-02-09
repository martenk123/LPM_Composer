"use client";

import { useState, useEffect } from "react";
import { FileText, TrendingUp, Target, Plus, Edit2, Sparkles, Bell, X } from "lucide-react";
import Link from "next/link";

interface Notification {
  count: number;
  message: string;
  timestamp: string;
}

export default function DashboardPage() {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Check for notifications in localStorage
    const reviewNotification = localStorage.getItem("reviewNotification");
    if (reviewNotification) {
      const notif = JSON.parse(reviewNotification);
      setNotification(notif);
      setShowNotification(true);
    }

    // Close notification when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-container')) {
        setShowNotification(false);
      }
    };

    if (showNotification) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotification]);

  const dismissNotification = () => {
    setShowNotification(false);
    localStorage.removeItem("reviewNotification");
  };

  const recentDocuments = [
    { id: 1, name: "Q3 Strategy", type: "Article", updated: "2 hours ago", status: "Draft" },
    { id: 2, name: "LinkedIn Post", type: "Social", updated: "5 hours ago", status: "Published" },
    { id: 3, name: "Product Launch", type: "Campaign", updated: "1 day ago", status: "Review" },
    { id: 4, name: "Brand Guidelines", type: "Document", updated: "2 days ago", status: "Published" },
  ];

  const quickActions = [
    { name: "New Article", icon: FileText, href: "/composer?type=article" },
    { name: "Social Campaign", icon: Sparkles, href: "/composer?type=social" },
    { name: "Rewrite", icon: Edit2, href: "/composer?type=rewrite" },
  ];

  return (
    <div className="min-h-screen bg-off-white p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="mb-12 flex items-start justify-between">
          <div>
            <h1 className="font-playfair text-5xl text-deep-black mb-2">
              Good morning, Vincent.
            </h1>
            <p className="font-ui text-deep-black/60 text-sm uppercase tracking-wider">
              Welcome back to your workspace
            </p>
          </div>
          
          {/* Notification Bell */}
          <div className="relative notification-container">
            <button
              onClick={() => setShowNotification(!showNotification)}
              className="relative p-3 bg-white rounded-lg border border-stone hover:border-gold transition-colors"
            >
              <Bell size={20} className="text-deep-black/60" />
              {notification && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                  <span className="text-xs font-ui text-deep-black font-bold">
                    {notification.count}
                  </span>
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotification && notification && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg border border-stone shadow-lg z-50 animate-fade-in">
                <div className="p-4 border-b border-stone flex items-center justify-between">
                  <h3 className="font-ui text-sm font-medium text-deep-black uppercase tracking-wide">
                    Notifications
                  </h3>
                  <button
                    onClick={dismissNotification}
                    className="p-1 hover:bg-stone/30 rounded transition-colors"
                  >
                    <X size={16} className="text-deep-black/60" />
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bell size={18} className="text-gold" />
                    </div>
                    <div className="flex-1">
                      <p className="font-ui text-sm text-deep-black font-medium mb-1">
                        {notification.message}
                      </p>
                      <p className="font-ui text-xs text-deep-black/50">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg border border-stone p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-ui text-sm uppercase tracking-wider text-deep-black/60">
                Active Projects
              </h3>
              <FileText size={20} className="text-gold" />
            </div>
            <p className="font-playfair text-4xl text-deep-black">12</p>
          </div>

          <div className="bg-white rounded-lg border border-stone p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-ui text-sm uppercase tracking-wider text-deep-black/60">
                Words Generated
              </h3>
              <TrendingUp size={20} className="text-gold" />
            </div>
            <p className="font-playfair text-4xl text-deep-black">24,583</p>
          </div>

          <div className="bg-white rounded-lg border border-stone p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-ui text-sm uppercase tracking-wider text-deep-black/60">
                Tone Consistency
              </h3>
              <Target size={20} className="text-gold" />
            </div>
            <p className="font-playfair text-4xl text-deep-black">98%</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border border-stone mb-12">
          <div className="p-6 border-b border-stone">
            <h2 className="font-playfair text-2xl text-deep-black">
              Recent Activity
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone">
                  <th className="text-left py-4 px-6 font-ui text-xs uppercase tracking-wider text-deep-black/60 font-medium">
                    Document
                  </th>
                  <th className="text-left py-4 px-6 font-ui text-xs uppercase tracking-wider text-deep-black/60 font-medium">
                    Type
                  </th>
                  <th className="text-left py-4 px-6 font-ui text-xs uppercase tracking-wider text-deep-black/60 font-medium">
                    Updated
                  </th>
                  <th className="text-left py-4 px-6 font-ui text-xs uppercase tracking-wider text-deep-black/60 font-medium">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className={`border-b border-stone/50 hover:bg-off-white/50 transition-colors ${
                      index === recentDocuments.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="py-6 px-6">
                      <p className="font-playfair text-base text-deep-black">
                        {doc.name}
                      </p>
                    </td>
                    <td className="py-6 px-6">
                      <span className="font-ui text-sm text-deep-black/60 uppercase tracking-wide">
                        {doc.type}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <span className="font-ui text-sm text-deep-black/60">
                        {doc.updated}
                      </span>
                    </td>
                    <td className="py-6 px-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-ui uppercase tracking-wide ${
                          doc.status === "Published"
                            ? "bg-gold/20 text-gold"
                            : doc.status === "Draft"
                            ? "bg-stone/30 text-deep-black/60"
                            : "bg-stone/20 text-deep-black/50"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-playfair text-2xl text-deep-black mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.name}
                  href={action.href}
                  className="group bg-white rounded-lg border border-stone p-8 hover:border-gold transition-all hover:shadow-sm"
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-gold/10 rounded-lg flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <Icon size={32} className="text-gold" />
                    </div>
                    <h3 className="font-playfair text-xl text-deep-black">
                      {action.name}
                    </h3>
                    <p className="font-ui text-sm text-deep-black/60 uppercase tracking-wide">
                      Start New Project
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
