import { API_PATHS } from '../config/api.js';
import { requestJson } from './client.js';

export async function fetchInventory(signal) {
    const data = await requestJson(API_PATHS.purchases, { signal });
    if (!Array.isArray(data) || data.some(group => !group?.purchase || !Array.isArray(group.items))) {
        throw new Error('The purchases service returned an unexpected response.');
    }
    return data;
}

export function createSale(itemId, price, soldDate) {
    return requestJson(API_PATHS.sales, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, price, soldDate }),
    });
}

/**
 * Refund an existing financial document, identified by SaleResponse.id.
 * @param {number} saleId
 * @returns {Promise<import('./inventory').PurchaseWithItemsResponse>}
 */
export function refundSale(saleId) {
    return requestJson(`${API_PATHS.sales}/${saleId}/refund`, { method: 'POST' });
}
