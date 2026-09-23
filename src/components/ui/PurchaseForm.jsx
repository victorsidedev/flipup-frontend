import Box from '@mui/material/Box';
import { TextField } from '@mui/material';

export default function PurchaseForm({ purchase, onUpdatePurchase, autoFocus = true }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
      <TextField
        autoFocus={autoFocus}
        required
        margin="dense"
        id="source"
        label="Source"
        type="text"
        fullWidth
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        value={purchase.source || ''}
        onChange={(e) => onUpdatePurchase({ source: e.target.value })}
      />
      <TextField
        margin="dense"
        label="Date"
        id="purchaseDate"
        type="date"
        fullWidth
        variant="standard"
        value={purchase.purchaseDate || ''}
        onChange={(e) => onUpdatePurchase({ purchaseDate: e.target.value })}
        slotProps={{ inputLabel: { shrink: true } }}
      />
    </Box>
  );
}
