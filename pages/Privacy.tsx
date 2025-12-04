import React from "react";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
      <p className="text-sm text-slate-600 mb-3">
        InvoiceGenius AI is a free-of-cost invoice generation service. We do not
        store, sell, or share the invoice data you enter in the app. All
        information stays in your browser unless you choose to download or print
        your invoice.
      </p>
      <p className="text-sm text-slate-600 mb-3">
        We are not responsible for any misuse, misrepresentation, or unlawful
        use of the generated invoices. Please ensure the information you provide
        is accurate and complies with laws applicable to your jurisdiction.
      </p>
      <p className="text-sm text-slate-600 mb-3">
        This website may use anonymous analytics to improve functionality and
        reliability. No personally identifiable information is intentionally
        collected.
      </p>
      <p className="text-sm text-slate-600">
        For questions, please contact us via{" "}
        <a
          href="https://makeupcoders.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-600 hover:text-indigo-700 underline"
        >
          makeupcoders.com
        </a>
        .
      </p>
    </div>
  );
};

export default Privacy;
