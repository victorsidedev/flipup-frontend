import { API_BASE_URL } from '../config/api.js';

export async function requestJson(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    if (!response.ok) {
        const body = await response.json().catch(() => null);
        const detail = body?.detail;
        const message = typeof detail === 'string'
            ? detail
            : Array.isArray(detail) ? detail.map(error => error.msg).join('. ')
                : 'The request could not be saved or loaded. Please try again.';
        throw new Error(message);
    }
    return response.status === 204 ? null : response.json();
}
