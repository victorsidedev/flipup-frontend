import { API_PATHS } from '../config/api.js';
import { requestJson } from './client.js';

export function savePurchase(purchaseId, data) {
    return requestJson(purchaseId == null ? API_PATHS.purchases : API_PATHS.purchase(purchaseId), {
        method: purchaseId == null ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

export function deleteItem(itemId) {
    return requestJson(API_PATHS.item(itemId), { method: 'DELETE' });
}

export function deletePurchase(purchaseId) {
    return requestJson(API_PATHS.purchase(purchaseId), { method: 'DELETE' });
}
