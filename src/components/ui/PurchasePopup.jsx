import { useState } from 'react';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import PurchaseForm from './PurchaseForm.jsx';
import ItemForm from './ItemForm.jsx';
import SaleDialog from './SaleDialog.jsx';
import DeleteConfirmation from '../purchases/DeleteConfirmation.jsx';
import usePurchaseEditor from '../purchases/usePurchaseEditor.js';

export default function PurchasePopup({ open, toggleOpen, purchaseDetails, selectedItemId, onSaved, onDeleted }) {
    const editor = usePurchaseEditor({ purchaseDetails, onSaved, onDeleted, onClose: toggleOpen });
    const [saleItem, setSaleItem] = useState(null);
    const isEditing = editor.purchase.id != null;

    function focusSelectedItem() {
        if (selectedItemId == null) return;
        const field = document.getElementById(`name-${selectedItemId}`);
        field?.focus({ preventScroll: true });
        document.getElementById(`editor-item-${selectedItemId}`)?.scrollIntoView({ block: 'center' });
    }

    return (
        <>
            <Dialog open={open} onClose={editor.busy ? undefined : toggleOpen} fullWidth maxWidth="md"
                aria-labelledby="purchase-title" slotProps={{ transition: { onEntered: focusSelectedItem } }}>
                <DialogTitle id="purchase-title">{isEditing ? `Edit purchase #${editor.purchase.id}` : 'Add Purchase'}</DialogTitle>
                <DialogContent dividers>
                    {editor.error && <Alert severity="error" sx={{ mb: 2 }}>{editor.error}</Alert>}
                    <Box component="form" id="purchase-editor" onSubmit={editor.save}>
                        <Box component="fieldset" disabled={editor.busy} sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
                            <PurchaseForm purchase={editor.purchase} onUpdatePurchase={editor.updatePurchase} autoFocus={selectedItemId == null} />
                            <Typography variant="body2" color="text.secondary" sx={{ my: 2 }}>
                                {editor.dirty ? 'Save your changes to enable recording sales.' : 'Record sales or manage items below.'}
                            </Typography>
                            {editor.items.filter(item => item.parentId == null).map(item => (
                                <ItemForm key={item.id} item={item} items={editor.items} selectedItemId={selectedItemId}
                                    onAddItem={editor.addItem} onUpdateItem={editor.updateItem} onDeleteItem={editor.requestItemDeletion}
                                    onSell={setSaleItem} canSell={!editor.dirty} />
                            ))}
                            <Button onClick={() => editor.addItem(null)}>+ Add Item</Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ flexWrap: 'wrap', px: 3, py: 2, gap: 1 }}>
                    {isEditing && <Button color="error" onClick={editor.requestPurchaseDeletion} disabled={editor.busy} sx={{ mr: 'auto' }}>Delete purchase</Button>}
                    <Button onClick={toggleOpen} disabled={editor.busy}>Close</Button>
                    <Button type="submit" form="purchase-editor" variant="contained" disabled={editor.busy || !editor.dirty}>
                        {editor.busy ? 'Saving…' : isEditing ? 'Save changes' : 'Add purchase'}
                    </Button>
                </DialogActions>
            </Dialog>
            {saleItem && <SaleDialog item={saleItem} onClose={() => setSaleItem(null)} onSaved={result => {
                editor.acceptPurchase(result);
                setSaleItem(null);
            }} />}
            {editor.confirmation && <DeleteConfirmation confirmation={editor.confirmation} busy={editor.busy}
                onCancel={editor.cancelDeletion} onConfirm={editor.confirmDeletion} />}
        </>
    );
}
