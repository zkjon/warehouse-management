export interface Product {
  id: string;
  name: string;
  description: string;
  purchasePrice: number;
  salePrice: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName?: string; // For display convenience in tables
  type: 'entry' | 'exit'; // entry = debe, exit = haber
  quantity: number;
  date: Date;
  notes?: string;
}
