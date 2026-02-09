"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const isRedactiePage = pathname === "/redactie";

  if (isLoginPage) {
    return <>{children}</>;
  }

  // Redactie page gets fullscreen (no sidebar)
  if (isRedactiePage) {
    return <>{children}</>;
  }

  return (
    <>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col ml-20">
          {/* Page Content */}
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </>
  );
}
