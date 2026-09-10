export interface SaleResponse {
    id: number;
    itemId: number;
    price: string;
    kind: 'sale' | 'loss';
    soldAt: string;
}

export interface ItemResponse {
    id: number;
    name: string | null;
    price: string | null;
    parentId: number | null;
    purchaseId: number;
    sale: SaleResponse | null;
    status: 'available' | 'sold' | 'included';
    soldWithItemId: number | null;
}

export interface PurchaseWithItemsResponse {
    purchase: { id: number; source: string | null; purchaseDate: string | null };
    items: ItemResponse[];
}

export function fetchInventory(signal?: AbortSignal): Promise<PurchaseWithItemsResponse[]>;
// Creation targets an item; subsequent sale actions must use SaleResponse.id.
export function createSale(itemId: number, price: string, soldDate?: string): Promise<PurchaseWithItemsResponse>;
export function refundSale(saleId: SaleResponse['id']): Promise<PurchaseWithItemsResponse>;
