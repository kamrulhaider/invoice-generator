import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto w-full p-4 md:p-6 lg:p-8">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Terms of Service
      </h1>
      <p className="text-sm text-slate-600 mb-3">
        InvoiceGenius AI provides a free service to generate professional
        invoices. By using this service, you acknowledge and agree that the
        generated invoices are provided "as-is" without warranties of any kind
        regarding accuracy, fitness for a particular purpose, or legal
        compliance.
      </p>
      <p className="text-sm text-slate-600 mb-3">
        You are solely responsible for the content of your invoices and their
        use. We are not responsible for any misuse, misrepresentation, financial
        loss, or legal consequences resulting from the use of the generated
        invoices.
      </p>
      <p className="text-sm text-slate-600 mb-3">
        The service may change or be discontinued at any time without notice.
        Continued use of the service constitutes acceptance of these terms.
      </p>
      <p className="text-sm text-slate-600">
        For inquiries, visit{" "}
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

export default Terms;
