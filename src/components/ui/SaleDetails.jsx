import { Stack, TextField } from '@mui/material';
import PriceField from './PriceField.jsx';

export default function SaleDetails({ price, setPrice, soldDate, setSoldDate, saving }) {
    const handlePriceChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            setPrice(value);
        }
    };
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
                onChange={(event) => setSoldDate(event.target.value)}
                disabled={saving}
                slotProps={{ inputLabel: { shrink: true } }}
            />
        </Stack>
    );
}