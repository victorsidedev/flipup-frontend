import { Box, Stack, TextField, MenuItem, IconButton, Button, Collapse } from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PriceField from './PriceField';
import { useState } from 'react';

const BRANCH_WIDTH = 20;

export default function Expenses({
    expenses,
    updateExpense,
    deleteExpense,
    saving,
    open,
}) {
    const [detailsOpen, setDetailsOpen] = useState([]);

    function toggleDetailsOpen(expenseId) {
        setDetailsOpen((current) =>
            current.includes(expenseId)
                ? current.filter((openId) => openId !== expenseId)
                : [...current, expenseId],
        );
    }

    return (
        <Collapse in={open} unmountOnExit>
        <Stack sx={{ gap: 0, ml: `-${BRANCH_WIDTH}px` }}>
            {expenses.map((expense, index) => {
                const isLast = index === expenses.length - 1;
                const detailsShown = detailsOpen.includes(expense.id);
                return (
                    <Stack key={expense.id} direction="row">
                        {/* tree connector: vertical line down to next sibling, branch into this row */}
                        <Box sx={{ position: 'relative', width: BRANCH_WIDTH, flexShrink: 0 }}>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: BRANCH_WIDTH / 2,
                                    top: 0,
                                    bottom: isLast ? '50%' : 0,
                                    width: '1px',
                                    bgcolor: 'divider',
                                }}
                            />
                            <Box
                                sx={{
                                    position: 'absolute',
                                    left: BRANCH_WIDTH / 2,
                                    top: '50%',
                                    width: BRANCH_WIDTH / 2 + 2,
                                    height: '1px',
                                    bgcolor: 'divider',
                                }}
                            />
                        </Box>
                        <Stack sx={{ flex: 1, minWidth: 0 }}>
                            <Stack
                                direction="row"
                                sx={{ justifyContent: 'space-between', alignItems: 'center', pb: 1 }}
                            >
                                <Stack direction="row" sx={{ gap: '.5rem', alignItems: 'center' }}>
                                    <TextField
                                        select
                                        size="small"
                                        label="Type"
                                        value={expense.type}
                                        onChange={(event) => updateExpense(expense.id, { type: event.target.value })}
                                        disabled={saving}
                                        sx={{ width: 140 }}
                                    >
                                        <MenuItem value="payment_fee">Payment fee</MenuItem>
                                        <MenuItem value="shipping_fee">Shipping fee</MenuItem>
                                    </TextField>
                                    <PriceField
                                        size="small"
                                        value={expense.amount}
                                        onChange={(event) => updateExpense(expense.id, { amount: event.target.value })}
                                        disabled={saving}
                                        required={true}
                                        sx={{ maxWidth: 100 }}
                                    />
                                </Stack>
                                <Stack direction="row">
                                    <Button
                                        size="small"
                                        onClick={() => toggleDetailsOpen(expense.id)}
                                        disabled={saving}
                                        endIcon={detailsShown ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        sx={{ fontWeight: 'light', width: '9ch' }}
                                    />
                                    <IconButton
                                        size="small"
                                        aria-label={`Remove expense ${index + 1}`}
                                        onClick={() => deleteExpense(expense.id)}
                                        disabled={saving}
                                    >
                                        <DeleteOutlinedIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </Stack>
                            <Collapse in={detailsShown} unmountOnExit>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Description"
                                    value={expense.description}
                                    onChange={(event) => updateExpense(expense.id, { description: event.target.value })}
                                    disabled={saving}
                                    sx={{ mb: '.5rem' }}
                                />
                            </Collapse>
                        </Stack>
                    </Stack>
                );
            })}
        </Stack>
        </Collapse>
    );
}

