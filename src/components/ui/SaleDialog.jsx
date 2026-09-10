import { useState } from 'react';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
import { createSale } from '../../api/inventory.js';

export default function SaleDialog({ item, onClose, onSaved }) {
    const [price, setPrice] = useState('');
    const [soldDate, setSoldDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    async function handleSubmit(event) {
        event.preventDefault();
        if (saving) return;
        setSaving(true);
        setError('');
        try {
            // A new sale has no ID yet. Future document actions use item.sale.id.
            const purchase = await createSale(item.id, price, soldDate);
            onSaved(purchase);
        } catch (error) {
            setError(error.message);
            setSaving(false);
        }
    }

    return (
        <Dialog open onClose={saving ? undefined : onClose} fullWidth maxWidth="xs" aria-labelledby="sale-title">
            <form onSubmit={handleSubmit}>
                <DialogTitle id="sale-title">Record sale</DialogTitle>
                <DialogContent>
                    <Typography sx={{ mb: 2, overflowWrap: 'anywhere' }}>{item.name} · Item #{item.id}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Unsold nested parts will be included in this sale and stay visible in inventory.
                    </Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <TextField
                        autoFocus required label="Sale price ($)" type="number" value={price}
                        onChange={event => setPrice(event.target.value)} disabled={saving}
                        slotProps={{ htmlInput: { min: 0, max: 99999999.99, step: '0.01' } }}
                    />
                    <TextField
                        required fullWidth label="Date sold" type="date" value={soldDate}
                        onChange={event => setSoldDate(event.target.value)} disabled={saving}
                        slotProps={{ inputLabel: { shrink: true } }} sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={onClose} disabled={saving}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={saving}>{saving ? 'Saving…' : 'Save sale'}</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
