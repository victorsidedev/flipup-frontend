import { useState } from 'react';

export default function useSaleDraft() {
    const saleDraftShape = {
        items: [],
        expenses: [],
        details: {
            soldDate: (() => {
                const today = new Date();
                return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            })(),
        },
    }
    const [saleDraft, setSaleDraft] = useState(saleDraftShape);
    const [saleDialogOpen, setSaleDialogOpen] = useState(false);

    const handlePriceChange = (event) => {
        setSaleDraft((current) => ({
            ...current,
            details: {
                ...current.details,
                price: event.target.value,
            },
        }));
    };

    const handleSoldDateChange = (event) => {
        setSaleDraft((current) => ({
            ...current,
            details: {
                ...current.details,
                soldDate: event.target.value,
            },
        }));
    };

    function insertExpense(fields) {
        setSaleDraft((current) => ({
            ...current,
            expenses: [
                {
                    ...fields,
                    id: crypto.randomUUID(),
                },
                ...current.expenses,
            ],
        }));
    }

    function updateExpense(expenseId, updatedFields) {
        setSaleDraft((current) => ({
            ...current,
            expenses: current.expenses.map((expense) =>
                expense.id === expenseId ? { ...expense, ...updatedFields } : expense,
            ),
        }));
    }

    function deleteExpense(expenseId) {
        setSaleDraft((current) => ({
            ...current,
            expenses: current.expenses.filter((expense) => expense.id !== expenseId),
        }));
    }

    function openSaleDialog() {
        setSaleDialogOpen(true);
    }

    function closeSaleDialog() {
        setSaleDialogOpen(false);
    }

    function createDraftWithItem(item) {
        console.log(item);
        setSaleDraft({...saleDraftShape, items: [item]});
        setSaleDialogOpen(true);
    }

    function toggleItemInDraft(item) {
        setSaleDraft((current) => {
            const existingItems = current ? current.items : [];
            const exists = existingItems.some((draftItem) => draftItem.id === item.id);
            //remove expenses from draft if item is removed
            //remove all child items if parent item is added/removed
            return {
                ...current,
                items: exists
                    ? existingItems.filter((draftItem) => draftItem.id !== item.id)
                    : [...existingItems, item],
            };
        });
    }

    function updateItemInDraft(itemId, updatedFields) {
        setSaleDraft((current) => ({
            ...current,
            items: current.items.map((selectedItem) =>
                selectedItem.id === itemId ? { ...selectedItem, ...updatedFields } : selectedItem,
            ),
        }));
    }

    function removeItemFromDraft(itemId) {
        setSaleDraft((current) => ({
            ...current,
            items: current.items.filter((draftItem) => draftItem.id !== itemId),
        }));
    }

    function clearSaleDraft() {
        setSaleDraft(saleDraftShape);
        setSaleDialogOpen(false);
    }

    return {
        saleDraft,
        saleDialogOpen,
        createDraftWithItem,
        openSaleDialog,
        closeSaleDialog,
        toggleItemInDraft,
        updateItemInDraft,
        removeItemFromDraft,
        clearSaleDraft,
        handlePriceChange,
        handleSoldDateChange,
        insertExpense,
        updateExpense,
        deleteExpense,
    };
}