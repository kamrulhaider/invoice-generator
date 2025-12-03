import React, { forwardRef } from 'react';
import { InvoiceData } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  currencySymbol: string;
}

const InvoicePreview = forwardRef<HTMLDivElement, InvoicePreviewProps>(({ data, currencySymbol }, ref) => {
  const subtotal = data.items.reduce((sum, item) => sum + item.amount, 0);
  const discountAmount = subtotal * ((data.discountRate || 0) / 100);
  const taxableAmount = subtotal - discountAmount;
  const taxAmount = taxableAmount * (data.taxRate / 100);
  const total = taxableAmount + taxAmount;

  return (
    <div ref={ref} className="bg-white p-8 md:p-12 shadow-lg min-h-[1100px] w-full max-w-[850px] mx-auto text-slate-800" id="invoice-preview">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div className="flex flex-col">
          {data.logoUrl ? (
            <img 
              src={data.logoUrl} 
              alt="Company Logo" 
              className="max-w-[250px] max-h-32 w-auto h-auto object-contain mb-4 self-start" 
            />
          ) : (
            <div className="h-20 w-20 bg-slate-100 rounded-lg flex items-center justify-center mb-4 text-slate-400 text-xs text-center p-2">
              No Logo
            </div>
          )}
          <h1 className="text-xl font-bold text-slate-900">{data.companyName || 'Your Company'}</h1>
          <p className="text-sm text-slate-500 whitespace-pre-line mt-1">{data.companyAddress || '123 Business Rd\nCity, State, Zip'}</p>
          <p className="text-sm text-slate-500 mt-1">{data.companyEmail}</p>
        </div>
        
        <div className="text-right">
          <h2 className="text-4xl font-light text-slate-300 uppercase tracking-widest mb-4">Invoice</h2>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-600"># {data.invoiceNumber}</p>
            <p className="text-sm text-slate-500">Issued: {data.date}</p>
            <p className="text-sm text-slate-500">Due: {data.dueDate}</p>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-12">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Bill To</h3>
        <h2 className="text-lg font-semibold text-slate-900">{data.clientName || 'Client Name'}</h2>
        <p className="text-sm text-slate-500 whitespace-pre-line mt-1">{data.clientAddress || 'Client Address'}</p>
        <p className="text-sm text-slate-500 mt-1">{data.clientEmail}</p>
      </div>

      {/* Items Table */}
      <div className="mb-8">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-slate-100">
              <th className="text-left py-3 text-sm font-bold text-slate-600 w-[50%]">Description</th>
              <th className="text-right py-3 text-sm font-bold text-slate-600 w-[15%]">Qty</th>
              <th className="text-right py-3 text-sm font-bold text-slate-600 w-[15%]">Rate</th>
              <th className="text-right py-3 text-sm font-bold text-slate-600 w-[20%]">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {data.items.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400 italic text-sm">No items added yet.</td>
              </tr>
            ) : (
              data.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 text-sm text-slate-700">{item.description}</td>
                  <td className="py-4 text-sm text-slate-700 text-right">{item.quantity}</td>
                  <td className="py-4 text-sm text-slate-700 text-right">{currencySymbol}{item.rate.toFixed(2)}</td>
                  <td className="py-4 text-sm font-medium text-slate-900 text-right">{currencySymbol}{item.amount.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64 space-y-3">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotal.toFixed(2)}</span>
          </div>
          {(data.discountRate || 0) > 0 && (
            <div className="flex justify-between text-sm text-slate-600">
              <span>Discount ({data.discountRate}%)</span>
              <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-slate-600">
            <span>Tax ({data.taxRate}%)</span>
            <span>{currencySymbol}{taxAmount.toFixed(2)}</span>
          </div>
          <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
            <span className="text-base font-bold text-slate-900">Total</span>
            <span className="text-xl font-bold text-indigo-600">{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Notes */}
      {data.notes && (
        <div className="border-t border-slate-100 pt-8">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Notes</h3>
          <p className="text-sm text-slate-500 whitespace-pre-wrap">{data.notes}</p>
        </div>
      )}
    </div>
  );
});

InvoicePreview.displayName = 'InvoicePreview';
export default InvoicePreview;