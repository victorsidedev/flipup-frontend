import { InputAdornment, TextField } from '@mui/material';

export default function PriceField({ value, onChange, disabled, label, required, sx }) {
    const handleChange = (event) => {
        const value = event.target.value;
        if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
            onChange(event);
        }
    };
    return (
<TextField
    autoFocus
    size="small"
    label={label}
    required={required}
    value={value}
    onChange={handleChange}
    disabled={disabled}
    sx={{
        '& .MuiInputBase-root': {
            height: 40,
        },
        '& .MuiInputBase-input': {
            py: 0.75,
            fontSize: '0.95rem',
        },
        '& .MuiInputAdornment-root': {
            mr: 0.5,
        },
        ...sx,
    }}
    slotProps={{
        input: {
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            inputMode: 'decimal',
        },
    }}
/>
    );
}
