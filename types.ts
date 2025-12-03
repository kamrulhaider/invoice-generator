export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  // Company (Sender)
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  logoUrl: string | null;

  // Client (Receiver)
  clientName: string;
  clientEmail: string;
  clientAddress: string;

  // Items & Financials
  items: LineItem[];
  currency: string;
  taxRate: number;
  discountRate: number;
  notes: string;
}

export enum Currencies {
  BDT = '৳',
  USD = '$',
  EUR = '€',
  GBP = '£',
  INR = '₹',
}