export function validateSaleDraft(saleDraft) {
    const total = Number(saleDraft.details.price);
    const itemIds = saleDraft?.items?.map((selectedItem) => selectedItem.id) || [];
    const invalidAllocation = saleDraft?.items?.some(
        (selectedItem) =>
            selectedItem.price !== '' && !Number.isFinite(Number(selectedItem.price)),
    );
    if (
        !Number.isFinite(total) ||
        total < 0 ||
        itemIds.length === 0 ||
        new Set(itemIds).size !== itemIds.length ||
        invalidAllocation
    ) {
        return 'Enter a valid total price, item allocations, and expense amounts.';
    }
    return '';
}

export function salePayload(saleDraft, kind) {
    const request = {
        items: saleDraft?.items?.map((selectedItem) => ({
            itemId: selectedItem.id,
            allocatedPrice: selectedItem.price === '' ? null : Number(selectedItem.price),
        })),
        kind,
        price: Number(saleDraft.details.price),
        expenses: saleDraft.expenses.map((expense) => ({
            type: expense.type,
            amount: Number(expense.amount),
            description: expense.description?.trim() || null,
            itemId: expense.itemId === '' ? null : Number(expense.itemId),
        })),
    };
    const soldDate = saleDraft.details.soldDate;
    if (soldDate) request.soldDate = soldDate;
    return request;
}

