import { Stack, TextField } from '@mui/material';
import PriceField from './PriceField.jsx';

export default function SaleDetails({ price, soldDate, handlePriceChange, handleSoldDateChange, saving }) {
    return (
        <Stack direction="row" spacing={2}>
            <PriceField
                label="Total price ($)"
                value={price}
                required={true}
                onChange={handlePriceChange}
                disabled={saving}
            />
            <TextField
                fullWidth
                label="Sold on"
                type="date"
                value={soldDate}
                onChange={handleSoldDateChange}
                disabled={saving}
                slotProps={{ inputLabel: { shrink: true } }}
            />
        </Stack>
    );
}