"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  const [accessCode, setAccessCode] = useState("");
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
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-lg mb-6 border border-stone/50">
            <Sparkles size={32} className="text-gold" />
          </div>
          <h1 className="font-playfair text-4xl text-deep-black mb-2">
            La Plume
          </h1>
          <p className="font-ui text-sm text-deep-black/60 uppercase tracking-wider">
            Intelligence
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg border border-stone shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="access-code"
                className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
              >
                Access Code
              </label>
              <input
                id="access-code"
                type="password"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black placeholder-deep-black/30"
                placeholder="Enter your access code"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-deep-black text-white px-6 py-3 rounded-md font-ui text-sm font-medium uppercase tracking-wider hover:bg-deep-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Connecting..." : "Connect to Intelligence"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
