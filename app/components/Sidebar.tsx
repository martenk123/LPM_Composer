"use client";

import { useState } from "react";
import { Home, PenTool, Folder, Settings, LucideIcon } from "lucide-react"; // Zorg dat je LucideIcon bovenin importeert
import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-28 h-[calc(100vh-7rem)] bg-white border-r border-stone transition-all duration-300 z-40 ${
        isExpanded ? "w-60" : "w-20"
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="flex flex-col h-full pt-4">
        <nav className="flex-1 px-3">
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
          </ul>
        </nav>
      </div>
    </aside>
  );
}
