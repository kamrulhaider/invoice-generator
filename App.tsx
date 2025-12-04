import React, { useState, useRef } from "react";
import InvoiceEditor from "./components/InvoiceEditor";
import InvoicePreview from "./components/InvoicePreview";
import { InvoiceData, Currencies } from "./types";
import { Download, FileText, Printer, Moon, Sun } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

// Default initial state
const initialState: InvoiceData = {
  invoiceNumber: "INV-001",
  date: new Date().toISOString().split("T")[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  companyName: "",
  companyEmail: "",
  companyAddress: "",
  logoUrl: null,
  clientName: "",
  clientEmail: "",
  clientAddress: "",
  items: [
    {
      id: "1",
      description: "Web Design Service",
      quantity: 10,
      rate: 8500,
      amount: 85000,
    },
  ],
  currency: Currencies.BDT,
  taxRate: 0,
  discountRate: 0,
  notes: "Thank you for your business. Please pay within 30 days.",
};

const App: React.FC = () => {
  const [data, setData] = useState<InvoiceData>(initialState);
  const [isGenerating, setIsGenerating] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Mobile toggle state
  const [activeTab, setActiveTab] = useState<"editor" | "preview">("editor");

  const handleDownloadPdf = async () => {
    if (!previewRef.current) return;

    setIsGenerating(true);
    try {
      // Force desktop layout for consistent PDF regardless of device
      previewRef.current.classList.add("pdf-mode");
      // Increase scale for better resolution
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        logging: false,
        useCORS: true, // For images
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15; // mm
      const contentWidth = pageWidth - margin * 2;
      const contentHeight = pageHeight - margin * 2;

      const imgAspect = canvas.width / canvas.height;
      const targetWidth = contentWidth;
      const targetHeight = contentHeight;
      let drawWidth = targetWidth;
      let drawHeight = drawWidth / imgAspect;
      if (drawHeight > targetHeight) {
        drawHeight = targetHeight;
        drawWidth = drawHeight * imgAspect;
      }
      const x = margin + (contentWidth - drawWidth) / 2;
      const y = margin + (contentHeight - drawHeight) / 2;

      pdf.addImage(imgData, "PNG", x, y, drawWidth, drawHeight);
      pdf.save(`invoice-${data.invoiceNumber || "draft"}.pdf`);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      // Revert forced layout
      if (previewRef.current) {
        previewRef.current.classList.remove("pdf-mode");
      }
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col overflow-x-hidden">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h1 className="hidden md:block text-base md:text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              InvoiceGenius AI
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Brand/Marketing */}
            <a
              href="https://makeupcoders.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-2 text-slate-600 hover:text-slate-800"
            >
              <img
                src="/makeup-coders-logo.png"
                alt="Makeup Coders"
                className="h-5 w-auto object-contain"
              />
              <span className="text-sm">by makeupcoders.com</span>
            </a>
            {/* Mobile Tab Toggles */}
            <div className="flex lg:hidden bg-slate-100 p-1 rounded-lg mr-2">
              <button
                onClick={() => setActiveTab("editor")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === "editor"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500"
                }`}
              >
                Edit
              </button>
              <button
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === "preview"
                    ? "bg-white shadow-sm text-slate-900"
                    : "text-slate-500"
                }`}
              >
                Preview
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg text-sm font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95 disabled:opacity-70 disabled:cursor-wait"
            >
              {isGenerating ? (
                <span className="animate-pulse">Generating...</span>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full p-4 md:p-6 lg:p-8 flex gap-8 items-start">
        {/* Editor Column */}
        <div
          className={`flex-1 w-full lg:max-w-xl bg-white rounded-xl shadow-sm border border-slate-200 lg:block ${
            activeTab === "editor" ? "block" : "hidden"
          }`}
        >
          <InvoiceEditor data={data} onChange={setData} />
        </div>

        {/* Preview Column */}
        <div
          className={`flex-1 w-full flex justify-center lg:block ${
            activeTab === "preview" ? "block" : "hidden lg:block"
          }`}
        >
          <div className="lg:sticky lg:top-28 print:static">
            {/* The actual component we convert to PDF */}
            <div className="shadow-2xl rounded-sm overflow-hidden bg-white">
              <InvoicePreview
                ref={previewRef}
                data={data}
                currencySymbol={data.currency}
              />
            </div>

            <p className="text-center text-slate-400 text-xs mt-4 lg:hidden">
              Switch to Edit tab to make changes
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden-print bg-white border-t border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 py-4 flex items-center justify-center gap-3 text-sm text-slate-600">
          <img
            src="/makeup-coders-logo.png"
            alt="Makeup Coders logo"
            className="h-5 w-auto object-contain"
            loading="lazy"
          />
          <span>
            This application is made by{" "}
            <a
              href="https://makeupcoders.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
            >
              makeupcoders.com
            </a>
          </span>
        </div>
      </footer>

      {/* PDF/Print Styles */}
      <style>{`
        /* Force desktop layout when generating PDF */
        /* Approx A4-friendly capture width at typical CSS pixel density */
        .pdf-mode { width: 794px !important; }
        .pdf-mode .mobile-only { display: none !important; }
        .pdf-mode .desktop-only { display: block !important; }
        /* Restore roomy table rows for PDF */
        .pdf-mode .tight-rows th { padding-top: 12px !important; padding-bottom: 12px !important; }
        .pdf-mode .tight-rows td { padding-top: 16px !important; padding-bottom: 16px !important; }
        /* Force header to desktop layout regardless of breakpoint */
        #invoice-preview.pdf-mode .force-desktop-row { display: flex !important; flex-direction: row !important; justify-content: space-between !important; align-items: flex-start !important; gap: 24px !important; }
        #invoice-preview.pdf-mode .force-desktop-text-right { text-align: right !important; }
        #invoice-preview.pdf-mode .totals-panel { width: 40% !important; margin-left: auto !important; }

        @media print {
          @page { margin: 15mm; }
          body { background: white; }
          nav, button, .hidden-print { display: none !important; }
          #root > div { min-height: auto; }
          main { padding: 0; margin: 0; max-width: none; display: block; }
          #invoice-preview { box-shadow: none; margin: 0; width: 100%; max-width: none; }
          /* Ensure desktop table prints */
          #invoice-preview .mobile-only { display: none !important; }
          #invoice-preview .desktop-only { display: block !important; }
          /* Hide editor */
          main > div:first-child { display: none; } 
          /* Show preview */
          main > div:last-child { display: block !important; width: 100%; }
        }
      `}</style>
    </div>
  );
};

export default App;
