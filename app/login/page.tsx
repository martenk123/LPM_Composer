"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate a brief delay for smooth transition
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    // Redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-stone flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-md">
        {/* Logo - Top */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-8">
            <div className="h-24 w-auto">
              <Image
                src="/LPM_Logo_Lang.svg"
                alt="La Plume"
                width={400}
                height={96}
                className="h-full w-auto object-contain"
                style={{ filter: 'brightness(0)' }}
                priority
              />
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg border border-stone shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="user-id"
                className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
              >
                ID
              </label>
              <input
                id="user-id"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black placeholder-deep-black/30"
                placeholder="Voer je ID in"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black placeholder-deep-black/30"
                placeholder="Voer je wachtwoord in"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-deep-black text-white px-6 py-3 rounded-md font-ui text-sm font-medium uppercase tracking-wider hover:bg-deep-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verbinden..." : "Inloggen"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
