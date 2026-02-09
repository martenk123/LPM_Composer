"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import GlobalHeader from "./GlobalHeader";

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Global Header - Full width, above sidebar */}
      <GlobalHeader />

      <div className="flex min-h-screen pt-28">
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
