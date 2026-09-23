import { useState } from 'react';
import { createSale } from '../../api/inventory.js';
import { salePayload, validateSaleDraft } from '../../pages/Inventory/hooks/saleDraft.js';

export default function useSaleSubmit({ onSaved }) {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function submitSale(saleDraft, kind) {
        if (saving) return;
        const validationError = validateSaleDraft(saleDraft);
        if (validationError) {
            setError(validationError);
            return;
        }
        setSaving(true);
        setError('');
        try {
            const request = salePayload(saleDraft, kind);
            const sale = await createSale(request);
            onSaved(sale);
        } catch (requestError) {
            setError(requestError.message);
            setSaving(false);
        }
    }

    return { saving, error, submitSale };
}
