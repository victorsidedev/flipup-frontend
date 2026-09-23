import { Stack, Typography, Button, IconButton } from '@mui/material';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import Expenses from './Expenses.jsx';

export default function SaleExpenses({
    saleId,
    itemId,
    expenses,
    insertExpense,
    updateExpense,
    deleteExpense,
    saving,
}) {
    const [expensesOpen, setExpensesOpen] = useState(true);
    const visibleExpenses = expenses.filter((expense) => expense.itemId ? false: true);
    const total = visibleExpenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);

    return (
        <>
            <Stack
                direction="row"
                sx={{ pb:0, alignItems: 'center', justifyContent: 'space-between'}}
            >
                <Stack
                    direction="row"
                    onClick={() => setExpensesOpen((current) => !current)}
                    sx={{ alignItems: 'center', gap: '.25rem', cursor: 'pointer' }}
                >
                    <IconButton
                        size="small"
                        sx={{ p: 0 }}
                        aria-label={expensesOpen ? 'Collapse expenses' : 'Expand expenses'}
                    >
                        {expensesOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </IconButton>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Sale Expenses</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {visibleExpenses.length} · ${total.toFixed(2)}
                    </Typography>
                </Stack>
                <Button
                    onClick={() => insertExpense({})}
                    disabled={saving}
                    sx={{ fontWeight: 'light' }}
                >
                    + Add
                </Button>
            </Stack>
            <Expenses
                expenses={visibleExpenses}
                updateExpense={updateExpense}
                deleteExpense={deleteExpense}
                saving={saving}
                open={expensesOpen}
            />
        </>
    );
}

