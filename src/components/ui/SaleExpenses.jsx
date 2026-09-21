import { Stack, Typography, Button, TextField, MenuItem, IconButton } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PriceField from './PriceField';

export default function SaleExpenses({
    expenses,
    setExpenses,
    saving,
    emptyExpense,
    updateExpense,
}) {
    return (
        <>
            <Stack
                direction="row"
                sx={{ pb:0, alignItems: 'center', justifyContent: 'space-between'}}
            >
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Sale Expenses</Typography>
                <Button
                    onClick={() => setExpenses((current) => [...current, emptyExpense()])}
                    disabled={saving}
                    sx={{ fontWeight: 'light' }}
                >
                    + Add Expense
                </Button>
            </Stack>
            <Stack sx={{ gap: 1.5 }}>
                {expenses.map((expense, index) => (
                    <Stack direction='row'>
                        <Stack
                            key={index}
                            sx={{ gap: 1 }}
                        >
                            <Stack
                                direction='row'
                                sx={{ gap: 1, alignItems: { sm: 'center' } }}
                            >
                                <TextField
                                    select
                                    label="Type"
                                    value={expense.type}
                                    onChange={(event) => updateExpense(index, 'type', event.target.value)}
                                    disabled={saving}
                                    sx={{ minWidth: 150 }}
                                >
                                    <MenuItem value="payment_fee">Payment fee</MenuItem>
                                    <MenuItem value="shipping_fee">Shipping fee</MenuItem>
                                </TextField>
                                <PriceField
                                    value={expense.amount}
                                    onChange={(event) => updateExpense(index, 'amount', event.target.value)}
                                    disabled={saving}
                                    required={true}
                                    sx={{ width: 115 }}
                                />
                            </Stack>
                            <TextField
                                fullWidth
                                label="Description"
                                value={expense.description}
                                onChange={(event) => updateExpense(index, 'description', event.target.value)}
                                disabled={saving}
                            />
                        </Stack>
                        <IconButton
                            aria-label={`Remove expense ${index + 1}`}
                            onClick={() =>
                                setExpenses((current) =>
                                    current.filter((_, expenseIndex) => expenseIndex !== index),
                                )
                            }
                            disabled={saving}
                        >
                            <DeleteOutlinedIcon />
                        </IconButton>
                    </Stack>
                ))}
            </Stack>
        </>
    );
}