"use client";

import { useState } from "react";
import { Home, PenTool, Folder, Settings, LucideIcon, Crown, Sparkles, FileCheck } from "lucide-react"; // Zorg dat je LucideIcon bovenin importeert
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useAccount } from "../contexts/AccountContext";
import EditorAvatar from "./EditorAvatar";

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon; // Dit lost de 'size' mismatch op
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Composer", href: "/composer", icon: PenTool },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Settings", href: "/settings", icon: Settings },
];

const editorNavItem: NavItem = {
  name: "Redactie (Backend)",
  href: "/redactie",
  icon: FileCheck,
};

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isPremium, upgradeToPremium } = useAccount();

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-white border-r border-stone transition-all duration-300 z-40 ${
        isExpanded ? "w-60" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full">
        {/* Logo - Top Left */}
        <div className="pl-0 pr-3 pt-4 pb-4 border-b border-stone/30">
          <div className={`transition-all duration-300 ${isExpanded ? "h-24" : "h-8"}`}>
            <Image
              src="/LPM_Logo_Lang.svg"
              alt="La Plume"
              width={isExpanded ? 500 : 60}
              height={isExpanded ? 96 : 32}
              className="h-full w-auto object-contain"
              style={{ filter: 'brightness(0)' }}
              priority
            />
          </div>
        </div>
        
        <nav className="flex-1 px-3 pt-4 overflow-y-auto">
          <ul className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                      isActive
                        ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                        : "text-deep-black/60 hover:bg-stone/30 hover:text-deep-black"
                    }`}
                  >
                    <Icon
                      size={20}
                      className={`flex-shrink-0 ${
                        isActive ? "text-gold" : "text-deep-black/60"
                      }`}
                    />
                    {isExpanded && (
                      <span className="text-sm font-ui font-medium whitespace-nowrap">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
            
            {/* Redactie (Backend) - Duidelijk gescheiden */}
            <li className="pt-4 mt-4 border-t border-stone/30">
              <Link
                href={editorNavItem.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-md transition-colors ${
                  pathname === editorNavItem.href
                    ? "bg-gold/20 text-deep-black border-l-2 border-gold"
                    : "text-deep-black/60 hover:bg-stone/30 hover:text-deep-black"
                }`}
              >
                <editorNavItem.icon
                  size={20}
                  className={`flex-shrink-0 ${
                    pathname === editorNavItem.href ? "text-gold" : "text-deep-black/60"
                  }`}
                />
                {isExpanded && (
                  <span className="text-sm font-ui font-medium whitespace-nowrap">
                    {editorNavItem.name}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Account Section - Bottom */}
        <div className="px-3 pb-4 pt-4 border-t border-stone/30">
          {isPremium ? (
            /* Premium: Saskia Avatar */
            <div className="relative">
              <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer hover:bg-stone/30 transition-colors"
              >
                <EditorAvatar size="sm" showStatus={true} />
                {isExpanded && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-ui font-medium text-deep-black truncate">
                      Premium Account
                    </span>
                    <span className="text-[10px] font-ui text-deep-black/60 truncate">
                      Redactie actief
                    </span>
                  </div>
                )}
              </div>
              
              {/* Tooltip */}
              {showTooltip && (
                <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-deep-black text-white rounded-lg text-xs font-ui whitespace-nowrap z-50 shadow-lg">
                  Premium Account - Redactie door Saskia actief
                  <div className="absolute top-full left-4 -mt-1 w-2 h-2 bg-deep-black rotate-45"></div>
                </div>
              )}
            </div>
          ) : (
            /* Basic: Upgrade Badge */
            <button
              onClick={() => {
                router.push("/settings");
                // Optioneel: direct upgraden
                // upgradeToPremium();
              }}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-md transition-colors bg-gold/10 hover:bg-gold/20 border border-gold/30 ${
                isExpanded ? "" : "justify-center"
              }`}
            >
              <Crown size={20} className="text-gold flex-shrink-0" />
              {isExpanded && (
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-xs font-ui font-medium text-deep-black text-left">
                    Upgrade naar Premium
                  </span>
                  <span className="text-[10px] font-ui text-deep-black/60 text-left">
                    €49/maand → €299/maand
                  </span>
                </div>
              )}
              {!isExpanded && (
                <Sparkles size={14} className="text-gold absolute -top-1 -right-1" />
              )}
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}
