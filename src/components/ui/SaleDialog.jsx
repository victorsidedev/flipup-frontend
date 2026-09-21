import { useState } from 'react';
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
} from '@mui/material';
import { createSale } from '../../api/inventory.js';
import SaleExpenses from './SaleExpenses.jsx';
import SaleItems from './SaleItems.jsx';
import SaleDetails from './SaleDetails.jsx';

function descendantItems(item, items) {
    const result = [];
    const pending = [item.id];
    while (pending.length > 0) {
        const parentId = pending.shift();
        const children = items.filter((candidate) => candidate.parentId === parentId);
        result.push(...children);
        pending.push(...children.map((child) => child.id));
    }
    return result;
}

function initialSaleItems(item, items) {
    return [item, ...descendantItems(item, items)].map((selectedItem) => ({
        itemId: selectedItem.id,
        allocatedPrice: '',
        automatic: selectedItem.id !== item.id,
    }));
}

const emptyExpense = () => ({ type: 'payment_fee', amount: '', description: '', itemId: '' });

export default function SaleDialog({ item, items, saleDraft, onDeleteSelectedItem, onUpdateSelectedItem, onClose, onSaved }) {
    const [kind, setKind] = useState('sale');
    const [price, setPrice] = useState('');
    const [soldDate, setSoldDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [expenses, setExpenses] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const selectedIds = new Set(saleDraft?.items?.map((selectedItem) => selectedItem.id));

    function updateSaleItem(itemId, allocatedPrice) {
        onUpdateSelectedItem(itemId, { price: allocatedPrice });
    }

    function removeSaleItem(itemId) {
        onDeleteSelectedItem(itemId);
        // setItemExpenses((current) =>
        //     current.map((expense) =>
        //         String(expense.itemId) === String(itemId) ? { ...expense, itemId: '' } : expense,
        //     ),
        // );
    }

    function updateExpense(index, field, value) {
        setExpenses((current) =>
            current.map((expense, expenseIndex) =>
                expenseIndex === index ? { ...expense, [field]: value } : expense,
            ),
        );
    }

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return;
        const total = Number(price);
        const itemIds = saleDraft?.items?.map((selectedItem) => selectedItem.id) || [];
        const invalidAllocation = saleDraft?.items?.some(
            (selectedItem) =>
                selectedItem.price !== '' && !Number.isFinite(Number(selectedItem.price)),
        );
        const invalidExpense = expenses.some(
            (expense) =>
                !Number.isFinite(Number(expense.amount)) ||
                Number(expense.amount) < 0 ||
                (expense.itemId !== '' && !selectedIds.has(Number(expense.itemId))),
        );
        if (
            !Number.isFinite(total) ||
            total < 0 ||
            itemIds.length === 0 ||
            new Set(itemIds).size !== itemIds.length ||
            invalidAllocation ||
            invalidExpense
        ) {
            setError('Enter a valid total price, item allocations, and expense amounts.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const request = {
                items: saleDraft?.items?.map((selectedItem) => ({
                    itemId: selectedItem.id,
                    allocatedPrice: selectedItem.price === '' ? null : Number(selectedItem.price),
                })),
                kind,
                price: total,
                expenses: expenses.map((expense) => ({
                    type: expense.type,
                    amount: Number(expense.amount),
                    description: expense.description.trim() || null,
                    itemId: expense.itemId === '' ? null : Number(expense.itemId),
                })),
            };
            if (soldDate) request.soldDate = soldDate;
            const purchase = await createSale(request);
            onSaved(purchase);
        } catch (requestError) {
            setError(requestError.message);
            setSaving(false);
        }
    }

    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            fullWidth
            maxWidth="sm"
            aria-labelledby="sale-title"
        >
            <form onSubmit={handleSubmit}>
                <DialogTitle id="sale-title" sx={{ pt: 1, pb: 1 }}>Record sale</DialogTitle>
                <Divider sx={{ borderBottomWidth: 2 }} />
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} >
                            {error}
                        </Alert>
                    )}
                    <SaleDetails
                        price={price}
                        setPrice={setPrice}
                        soldDate={soldDate}
                        setSoldDate={setSoldDate}
                        saving={saving}
                    />
                    <Divider sx={{ mt: 2, borderBottomWidth: 2 }} />
                    <SaleExpenses
                        expenses={expenses}
                        setExpenses={setExpenses}
                        saving={saving}
                        emptyExpense={emptyExpense}
                        updateExpense={updateExpense}
                    />
                    <Divider sx={{ borderBottomWidth: 2, mb: 1 }} />
                    <SaleItems
                        selectedItems={saleDraft?.items || []}
                        updateSaleItem={updateSaleItem}
                        removeSaleItem={removeSaleItem}
                        saving={saving}
                    />
                    <Divider sx={{ borderBottomWidth: 2, mt: 2 }} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Stack direction="column" sx={{ flex: 1, justifyContent: 'space-between' }}>
                        <Button
                            onClick={onClose}
                            disabled={saving}
                            sx={{ border: '1px solid', borderRadius: 0.5, borderWidth: 2, borderColor: 'primary.main' }}
                        >
                            + Select More Items
                        </Button>
                        <Stack direction="row" sx={{ pt: 2, flex: 1, justifyContent: 'space-between' }}>
                            <Button
                                onClick={onClose}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : 'Save sale'}
                            </Button>
                        </Stack>
                    </Stack>
                </DialogActions>
            </form>
        </Dialog>
    );
}
