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
import useSaleSubmit from './useSaleSubmit.js';
import SaleExpenses from './SaleExpenses.jsx';
import SaleItems from './SaleItems.jsx';
import SaleDetails from './SaleDetails.jsx';


export default function SaleDialog({
    saleDraft,
    onDeleteSelectedItem,
    onUpdateSelectedItem,
    onClose,
    insertExpense,
    updateExpense,
    deleteExpense,
    handlePriceChange,
    handleSoldDateChange,
    onSaved
}) {
    const [kind, setKind] = useState('sale');
    const { saving, error, submitSale } = useSaleSubmit({ onSaved });

    function handleSubmit(event) {
        event.preventDefault();
        submitSale(saleDraft, kind);
    }


    return (
        <Dialog
            open
            onClose={saving ? undefined : onClose}
            maxWidth="lg"
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
                        price={saleDraft.details.price}
                        soldDate={saleDraft.details.soldDate}
                        saving={saving}
                        handlePriceChange={handlePriceChange}
                        handleSoldDateChange={handleSoldDateChange}
                    />
                    <Divider sx={{ mt: 2, borderBottomWidth: 2 }} />
                    <SaleExpenses
                        expenses={saleDraft.expenses}
                        saving={saving}
                        insertExpense={insertExpense}
                        updateExpense={updateExpense}
                        deleteExpense={deleteExpense}
                    />
                    <Divider sx={{ borderBottomWidth: 2, mb: 1 }} />
                    <SaleItems
                        selectedItems={saleDraft?.items || []}
                        itemExpenses={saleDraft?.expenses.filter(expense => expense.itemId?true:false ) || []}
                        updateSaleItem={(itemId, allocatedPrice)=> onUpdateSelectedItem(itemId, { price: allocatedPrice }) }
                        removeSaleItem={(itemId)=>onDeleteSelectedItem(itemId)}
                        insertExpense={insertExpense}
                        updateExpense={updateExpense}
                        deleteExpense={deleteExpense}
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
