"use client";

import { useState, useEffect } from "react";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ReviewPage() {
  const router = useRouter();
  const [documentContent, setDocumentContent] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Get document from localStorage
    if (typeof window !== "undefined") {
      const reviewDoc = localStorage.getItem("reviewDocument");
      if (reviewDoc) {
        const doc = JSON.parse(reviewDoc);
        setDocumentContent(doc.content || "");
      }
    }
  }, []);

  const handleApprove = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Mark as reviewed and notify
    localStorage.setItem("reviewNotification", JSON.stringify({
      count: 1,
      message: "1 Document Reviewed",
      timestamp: new Date().toISOString(),
    }));
    
    // Clear review document
    localStorage.removeItem("reviewDocument");
    
    setIsProcessing(false);
    router.push("/dashboard");
  };

  const handleRequestChanges = async () => {
    setIsProcessing(true);
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    // Mark as changes requested
    localStorage.setItem("reviewDocument", JSON.stringify({
      content: documentContent,
      status: "changes-requested",
      timestamp: new Date().toISOString(),
    }));
    
    setIsProcessing(false);
    router.push("/composer");
  };

  return (
    <div className="min-h-screen bg-off-white animate-fade-in">
      <div className="max-w-7xl mx-auto p-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-deep-black/60 hover:text-deep-black mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-ui text-sm">Back</span>
            </button>
            <h1 className="font-playfair text-5xl text-deep-black mb-2">
              Editorial Review
            </h1>
            <p className="font-ui text-deep-black/60 text-sm uppercase tracking-wider">
              Expert View • Comment Mode
            </p>
          </div>
        </div>

        {/* Review Panel */}
        <div className="bg-white rounded-lg border-2 border-gold shadow-lg p-8">
          {/* Document Display */}
          <div className="bg-[#F0F0F0] rounded-lg p-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-12 max-w-4xl mx-auto relative border-2 border-gold">
              {/* Expert View Badge */}
              <div className="absolute -top-4 left-8 bg-gold px-4 py-1 rounded-full">
                <span className="font-ui text-xs text-deep-black uppercase tracking-wider font-medium">
                  Expert View
                </span>
              </div>

              {/* La Plume Watermark */}
              <div className="absolute top-8 right-8 opacity-10 pointer-events-none">
                <h1 className="font-playfair text-2xl text-deep-black">
                  La Plume
                </h1>
              </div>

              {/* Document Content */}
              <div
                className="font-playfair text-deep-black leading-relaxed"
                style={{ lineHeight: "1.6", minHeight: "400px" }}
              >
                {documentContent || (
                  <span className="text-deep-black/30">
                    No document content available for review.
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Comment Section */}
          <div className="mb-8">
            <label
              htmlFor="comments"
              className="block text-sm font-ui font-medium text-deep-black/70 mb-2 uppercase tracking-wide"
            >
              Review Comments (Optional)
            </label>
            <textarea
              id="comments"
              rows={4}
              className="w-full px-4 py-3 bg-off-white border border-stone rounded-md focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold font-ui text-deep-black"
              placeholder="Add any comments or feedback for the author..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-stone">
            <button
              onClick={handleRequestChanges}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-md font-ui text-sm font-medium uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <XCircle size={18} />
              Request Changes
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-md font-ui text-sm font-medium uppercase tracking-wider hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle size={18} />
              {isProcessing ? "Processing..." : "Approve & Finalize"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
