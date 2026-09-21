export interface SaleResponse {
  id: number;
  kind: 'sale' | 'loss';
  soldAt: string;
  price: number;
  items: SaleItem[];
  expenses: SaleExpense[];
}

export interface SaleItem {
  itemId: number;
  allocatedPrice: number | null;
}

export interface SaleExpense {
  id?: number;
  type: 'payment_fee' | 'shipping_fee';
  amount: number;
  description: string | null;
  itemId: number | null;
}

export interface ItemResponse {
  id: number;
  name: string | null;
  price: string | null;
  parentId: number | null;
  purchaseId: number;
  sale: SaleResponse | null;
  status: 'available' | 'sold';
}

export interface PurchaseWithItemsResponse {
  purchase: { id: number; source: string | null; purchaseDate: string | null };
  items: ItemResponse[];
}

export function fetchInventory(signal?: AbortSignal): Promise<PurchaseWithItemsResponse[]>;
export interface CreateSaleRequest {
  items: SaleItem[];
  kind: 'sale' | 'loss';
  soldDate?: string;
  price: number;
  expenses: Omit<SaleExpense, 'id'>[];
}

export function createSale(request: CreateSaleRequest): Promise<PurchaseWithItemsResponse>;
export function refundSale(saleId: SaleResponse['id']): Promise<PurchaseWithItemsResponse>;
