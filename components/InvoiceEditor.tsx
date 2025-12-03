import React from 'react';
import { InvoiceData, LineItem, Currencies } from '../types';
import { Plus, Trash2, Upload, Calendar } from 'lucide-react';
import MagicInput from './MagicInput';

interface InvoiceEditorProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceEditor: React.FC<InvoiceEditorProps> = ({ data, onChange }) => {
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      onChange({ ...data, logoUrl: url });
    }
  };

  const updateItem = (index: number, field: keyof LineItem, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    // Recalculate amount if qty or rate changes
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: LineItem = {
      id: Math.random().toString(36).substring(2, 9),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  const handleMagicItems = (items: LineItem[]) => {
    onChange({ ...data, items: [...data.items, ...items] });
  };

  return (
    <div className="space-y-8 p-6 pb-24">
      {/* Branding Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">From & Branding</h2>
        
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-4">
               <div className="relative group w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-300 hover:border-indigo-400 transition-colors cursor-pointer">
                 {data.logoUrl ? (
                   <img src={data.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                 ) : (
                   <span className="text-xs text-slate-400 text-center px-2">Upload Logo</span>
                 )}
                 <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
               <div className="flex-1 space-y-2">
                 <input 
                   type="text" 
                   name="companyName"
                   placeholder="Your Company Name" 
                   value={data.companyName}
                   onChange={handleInputChange}
                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
                 <input 
                   type="email" 
                   name="companyEmail"
                   placeholder="your@email.com" 
                   value={data.companyEmail}
                   onChange={handleInputChange}
                   className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                 />
               </div>
            </div>
            <textarea
              name="companyAddress"
              placeholder="Your Business Address"
              value={data.companyAddress}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>
        </div>
      </section>

      {/* Client Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">To (Client)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input 
            type="text" 
            name="clientName"
            placeholder="Client Name" 
            value={data.clientName}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input 
            type="email" 
            name="clientEmail"
            placeholder="client@email.com" 
            value={data.clientEmail}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <textarea
            name="clientAddress"
            placeholder="Client Address"
            value={data.clientAddress}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none sm:col-span-2"
          />
        </div>
      </section>

      {/* Invoice Meta */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Invoice Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Number</label>
            <input 
              type="text" 
              name="invoiceNumber"
              value={data.invoiceNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Issue Date</label>
            <div className="relative">
              <input 
                type="date" 
                name="date"
                value={data.date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Due Date</label>
             <input 
                type="date" 
                name="dueDate"
                value={data.dueDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
          <h2 className="text-lg font-semibold text-slate-800">Items</h2>
          <div className="flex gap-2">
            <select
              value={data.currency}
              onChange={(e) => onChange({...data, currency: e.target.value})}
              className="text-sm bg-white border border-slate-200 rounded-md px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {Object.entries(Currencies).map(([key, symbol]) => (
                <option key={key} value={symbol}>{key} ({symbol})</option>
              ))}
            </select>
          </div>
        </div>

        <MagicInput onItemsGenerated={handleMagicItems} />

        <div className="space-y-3">
          {data.items.map((item, index) => (
            <div key={item.id} className="group flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-slate-50 p-3 rounded-lg border border-transparent hover:border-slate-200 transition-colors">
              <div className="flex-1 w-full">
                <input 
                  type="text" 
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-1 text-sm focus:outline-none"
                />
              </div>
              <div className="flex gap-3 w-full sm:w-auto">
                <input 
                  type="number" 
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                  className="w-16 bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-1 text-sm text-right focus:outline-none"
                />
                <input 
                  type="number" 
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-20 bg-transparent border-b border-slate-200 focus:border-indigo-500 px-1 py-1 text-sm text-right focus:outline-none"
                />
                <div className="w-24 text-right text-sm font-medium text-slate-700 py-1">
                  {data.currency}{(item.quantity * item.rate).toFixed(2)}
                </div>
                <button 
                  onClick={() => removeItem(index)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={addItem}
          className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 mt-2"
        >
          <Plus className="w-4 h-4" /> Add Item
        </button>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-4 gap-6">
           <div className="flex items-center gap-2">
             <label className="text-sm text-slate-600">Discount (%):</label>
             <input 
               type="number" 
               value={data.discountRate || 0}
               onChange={(e) => onChange({...data, discountRate: parseFloat(e.target.value) || 0})}
               className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>
           <div className="flex items-center gap-2">
             <label className="text-sm text-slate-600">Tax (%):</label>
             <input 
               type="number" 
               value={data.taxRate}
               onChange={(e) => onChange({...data, taxRate: parseFloat(e.target.value) || 0})}
               className="w-16 px-2 py-1 border border-slate-200 rounded text-sm text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
             />
           </div>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">Notes & Terms</h2>
        <textarea
          name="notes"
          placeholder="Payment terms, thank you note, etc."
          value={data.notes}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </section>
    </div>
  );
};

export default InvoiceEditor;