"use client";

import { useState } from "react";
import { X, Lightbulb } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DemoGuide() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Demo Info CTA Button - Rechtsboven */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed top-4 right-4 z-40 px-4 py-2 bg-deep-black text-white rounded-lg shadow-lg hover:bg-deep-black/90 hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
            aria-label="Open demo guide"
          >
            <Lightbulb size={18} className="group-hover:rotate-12 transition-transform" />
            <span className="font-ui text-sm font-medium uppercase tracking-wide">
              Demo Info
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Pullout Panel */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[110] pointer-events-none">
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/20 pointer-events-auto"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Pullout Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute top-0 right-0 h-full w-full max-w-md bg-off-white border-l-4 border-gold shadow-2xl pointer-events-auto"
            >
            <div className="h-full flex flex-col p-8 overflow-y-auto">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Lightbulb size={24} className="text-gold" />
                  </div>
                  <h2 className="font-playfair text-2xl text-deep-black">
                    La Plume
                  </h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-stone/20 rounded-lg transition-colors"
                  aria-label="Sluit demo guide"
                >
                  <X size={20} className="text-deep-black/60" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-playfair text-xl text-deep-black mb-3">
                    Waar AI vakmanschap ontmoet
                  </h3>
                  <p className="font-ui text-deep-black/70 leading-relaxed">
                    La Plume combineert de efficiëntie van AI met de verfijning van menselijke redactie. 
                    Dit platform biedt je de beste van beide werelden: snelle, intelligente content generatie 
                    gevolgd door professionele review en verfijning.
                  </p>
                </div>

                {/* Workflow Steps */}
                <div className="space-y-4 pt-4 border-t border-stone/30">
                  <h4 className="font-playfair text-lg text-deep-black mb-4">
                    De Workflow
                  </h4>
                  
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="font-ui text-sm font-medium text-gold">1</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-ui text-sm font-medium text-deep-black mb-1">
                        Brand Voice instellen
                      </h5>
                      <p className="font-ui text-xs text-deep-black/60 leading-relaxed">
                        Configureer je merkidentiteit in Settings. Stel core values, tone of voice en target audience in voor consistente content.
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="font-ui text-sm font-medium text-gold">2</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-ui text-sm font-medium text-deep-black mb-1">
                        AI-ondersteund schrijven
                      </h5>
                      <p className="font-ui text-xs text-deep-black/60 leading-relaxed">
                        Gebruik de Composer om content te creëren. De AI schrijft volgens jouw Brand Voice instellingen en past de tekst aan met Quick Actions.
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                      <span className="font-ui text-sm font-medium text-gold">3</span>
                    </div>
                    <div className="flex-1">
                      <h5 className="font-ui text-sm font-medium text-deep-black mb-1">
                        Professionele review door Saskia
                      </h5>
                      <p className="font-ui text-xs text-deep-black/60 leading-relaxed">
                        Stuur je documenten naar Saskia voor professionele redactie. Volg de status in de Redactie Queue op het Dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Note */}
                <div className="pt-4 border-t border-stone/30">
                  <div className="bg-gold/10 rounded-lg p-4 border border-gold/20">
                    <p className="font-ui text-xs text-deep-black/70 leading-relaxed">
                      <span className="font-medium">Premium tip:</span> Upgrade naar Premium voor toegang tot professionele redactie door Saskia en geavanceerde functies.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
