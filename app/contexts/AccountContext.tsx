"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AccountTier = "basic" | "premium";

interface SubmittedDocument {
  id: string;
  content: string;
  timestamp: string;
  status: "submitted-for-editing" | "completed";
  editor: string;
}

interface AccountContextType {
  accountTier: AccountTier;
  upgradeToPremium: () => void;
  downgradeToBasic: () => void;
  isPremium: boolean;
  submittedDocuments: SubmittedDocument[];
  submitDocumentForEditing: (content: string) => void;
  updateDocumentStatus: (documentId: string, status: "submitted-for-editing" | "completed") => void;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [accountTier, setAccountTier] = useState<AccountTier>("basic");
  const [submittedDocuments, setSubmittedDocuments] = useState<SubmittedDocument[]>([]);

  // Dummy documents voor demo - verschillende stadia
  const getDummyDocuments = (): SubmittedDocument[] => {
    const now = Date.now();
    return [
      {
        id: "doc-dummy-1",
        content: "Dit is een artikel over digitale transformatie in de moderne zakelijke wereld. Bedrijven moeten zich continu aanpassen aan nieuwe technologieën en veranderende klantverwachtingen. De sleutel tot succes ligt in het vinden van de juiste balans tussen innovatie en stabiliteit.",
        timestamp: new Date(now - 30 * 60 * 60 * 1000).toISOString(), // 30 uur geleden - completed
        status: "submitted-for-editing",
        editor: "Saskia",
      },
      {
        id: "doc-dummy-2",
        content: "Social media strategieën voor 2025: een uitgebreide gids voor marketeers die willen excelleren in digitale communicatie. We bespreken de nieuwste trends, best practices en concrete tips voor het opbouwen van een sterke online aanwezigheid.",
        timestamp: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 uur geleden - in-progress
        status: "submitted-for-editing",
        editor: "Saskia",
      },
      {
        id: "doc-dummy-3",
        content: "Product launch campagne voor het nieuwe kwartaal. We focussen op het creëren van buzz en anticipatie door middel van strategische content marketing en influencer partnerships.",
        timestamp: new Date(now - 1 * 60 * 60 * 1000).toISOString(), // 1 uur geleden - waiting
        status: "submitted-for-editing",
        editor: "Saskia",
      },
      {
        id: "doc-dummy-4",
        content: "Brand guidelines documentatie voor het herpositioneren van ons merk. Dit omvat tone of voice richtlijnen, visuele identiteit en communicatiestrategieën die consistentie waarborgen across alle kanalen.",
        timestamp: new Date(now - 48 * 60 * 60 * 1000).toISOString(), // 48 uur geleden - completed
        status: "submitted-for-editing",
        editor: "Saskia",
      },
      {
        id: "doc-dummy-5",
        content: "Website copy voor de nieuwe landingspagina. Focus op conversie-optimalisatie en het duidelijk communiceren van onze unique value proposition aan potentiële klanten.",
        timestamp: new Date(now - 3 * 60 * 60 * 1000).toISOString(), // 3 uur geleden - in-progress
        status: "submitted-for-editing",
        editor: "Saskia",
      },
    ];
  };

  // Load account tier and submitted documents from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTier = localStorage.getItem("accountTier");
      if (savedTier === "premium" || savedTier === "basic") {
        setAccountTier(savedTier);
      }

      const savedDocuments = localStorage.getItem("submittedDocuments");
      if (savedDocuments) {
        try {
          const parsed = JSON.parse(savedDocuments);
          // Alleen laden als er daadwerkelijk documenten zijn
          if (parsed && parsed.length > 0) {
            setSubmittedDocuments(parsed);
          } else {
            // Geen documenten, laad dummy data
            const dummyDocs = getDummyDocuments();
            setSubmittedDocuments(dummyDocs);
            localStorage.setItem("submittedDocuments", JSON.stringify(dummyDocs));
          }
        } catch (e) {
          console.error("Failed to parse submitted documents", e);
          // Bij error, laad dummy data
          const dummyDocs = getDummyDocuments();
          setSubmittedDocuments(dummyDocs);
          localStorage.setItem("submittedDocuments", JSON.stringify(dummyDocs));
        }
      } else {
        // Geen localStorage data, laad dummy data
        const dummyDocs = getDummyDocuments();
        setSubmittedDocuments(dummyDocs);
        localStorage.setItem("submittedDocuments", JSON.stringify(dummyDocs));
      }
    }
  }, []);

  // Save account tier to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("accountTier", accountTier);
    }
  }, [accountTier]);

  // Save submitted documents to localStorage when they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("submittedDocuments", JSON.stringify(submittedDocuments));
    }
  }, [submittedDocuments]);

  const upgradeToPremium = () => {
    setAccountTier("premium");
  };

  const downgradeToBasic = () => {
    setAccountTier("basic");
  };

  const submitDocumentForEditing = (content: string) => {
    const newDocument: SubmittedDocument = {
      id: `doc-${Date.now()}`,
      content,
      timestamp: new Date().toISOString(),
      status: "submitted-for-editing",
      editor: "Saskia",
    };
    setSubmittedDocuments((prev) => [...prev, newDocument]);
  };

  const updateDocumentStatus = (documentId: string, status: "submitted-for-editing" | "completed") => {
    setSubmittedDocuments((prev) =>
      prev.map((doc) =>
        doc.id === documentId ? { ...doc, status } : doc
      )
    );
  };

  const isPremium = accountTier === "premium";

  return (
    <AccountContext.Provider value={{ 
      accountTier, 
      upgradeToPremium,
      downgradeToBasic,
      isPremium,
      submittedDocuments,
      submitDocumentForEditing,
      updateDocumentStatus,
    }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
}
