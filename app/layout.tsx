import type { Metadata } from "next";
import { Inter, Playfair_Display, JetBrains_Mono, Kalam } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { BrandVoiceProvider } from "./contexts/BrandVoiceContext";
import { AccountProvider } from "./contexts/AccountContext";
import DemoGuide from "./components/DemoGuide";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-handwriting",
  display: "swap",
});

export const metadata: Metadata = {
  title: "La Plume",
  description: "La Plume - Professionele schrijfassistentie",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${inter.variable} ${playfair.variable} ${jetbrainsMono.variable} ${kalam.variable}`}>
      <body className="font-sans bg-off-white">
        <AccountProvider>
          <BrandVoiceProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <DemoGuide />
          </BrandVoiceProvider>
        </AccountProvider>
      </body>
    </html>
  );
}
