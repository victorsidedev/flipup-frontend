import { useState } from 'react';
import { deleteItem, deletePurchase, savePurchase } from '../../api/purchaseEditor.js';
import { isSavedItem, newItem, purchasePayload, subtreeIds } from './purchaseDraft.js';

export default function usePurchaseEditor({ purchaseDetails, onSaved, onDeleted, onClose }) {
    const [purchase, setPurchase] = useState(() => purchaseDetails?.purchase ?? {
        source: '', purchaseDate: new Date().toISOString().slice(0, 10),
    });
    const [items, setItems] = useState(() => purchaseDetails?.items ?? [newItem()]);
    const [baseline, setBaseline] = useState(() => purchaseDetails ? JSON.stringify(purchasePayload(purchaseDetails.purchase, purchaseDetails.items)) : '');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState('');
    const [confirmation, setConfirmation] = useState(null);
    const dirty = JSON.stringify(purchasePayload(purchase, items)) !== baseline;

    function acceptPurchase(result) {
        setPurchase(result.purchase);
        setItems(result.items);
        setBaseline(JSON.stringify(purchasePayload(result.purchase, result.items)));
        onSaved(result);
    }

    async function save(event) {
        event.preventDefault();
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            acceptPurchase(await savePurchase(purchase.id, purchasePayload(purchase, items)));
        } catch (error) {
            setError(error.message);
        } finally {
            setBusy(false);
        }
    }

    function requestItemDeletion(item) {
        if (!isSavedItem(item)) {
            const removed = subtreeIds(items, item.id);
            setItems(previous => previous.filter(item => !removed.has(item.id)));
            return;
        }
        setConfirmation({ kind: 'item', item, count: subtreeIds(items, item.id).size });
    }

    async function confirmDeletion() {
        if (busy) return;
        setBusy(true);
        setError('');
        try {
            if (confirmation.kind === 'purchase') {
                await deletePurchase(purchase.id);
                onDeleted(purchase.id);
                onClose();
            } else {
                const removed = subtreeIds(items, confirmation.item.id);
                const result = await deleteItem(confirmation.item.id);
                // Keep unrelated edits and new draft items when deleting a saved subtree.
                const byId = new Map(result.items.map(item => [item.id, item]));
                setItems(previous => previous.filter(item => !removed.has(item.id) && (!isSavedItem(item) || byId.has(item.id)))
                    .map(item => byId.has(item.id) ? { ...byId.get(item.id), name: item.name, price: item.price } : item));
                setBaseline(JSON.stringify(purchasePayload(result.purchase, result.items)));
                onSaved(result);
            }
            setConfirmation(null);
        } catch (error) {
            setError(error.message);
            setConfirmation(null);
        } finally {
            setBusy(false);
        }
    }

    return {
        purchase, items, dirty, busy, error, confirmation, save, acceptPurchase,
        updatePurchase: updates => setPurchase(previous => ({ ...previous, ...updates })),
        updateItem: (id, updates) => setItems(previous => previous.map(item => item.id === id ? { ...item, ...updates } : item)),
        addItem: parentId => setItems(previous => [newItem(parentId), ...previous]),
        requestItemDeletion,
        requestPurchaseDeletion: () => setConfirmation({ kind: 'purchase', count: items.length }),
        cancelDeletion: () => setConfirmation(null),
        confirmDeletion,
    };
}
