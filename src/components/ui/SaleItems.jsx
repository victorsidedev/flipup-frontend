import { Typography, Stack, TextField, IconButton, MenuItem, Button, Divider } from '@mui/material';
import PriceField from './PriceField.jsx';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import Expenses from './Expenses.jsx';
import { useState } from 'react';

export default function SaleItems({
    selectedItems,
    itemExpenses,
    insertExpense,
    updateExpense,
    deleteExpense,
    updateSaleItem,
    removeSaleItem,
    saving,
}) {
    console.log(itemExpenses);
    const [expensesOpen, setExpensesOpen] = useState(true);
    return (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} > Items in this sale</Typography>
            <Stack sx={{ gap: 1 }}>
                {selectedItems.map((selectedItem) => {
                    return (
                        <Stack direction="column" key={`sale-item-${selectedItem.id}`}>
                        <Stack
                            key={selectedItem.id}
                            direction="row"
                            sx={{ alignItems: 'center', gap: 1 }}
                        >
                            <Stack direction="row">
                                <Typography sx={{ flex: 1, minWidth: 0, overflowWrap: 'anywhere' }}>
                                    {selectedItem?.name || `Item #${selectedItem.id}`} · #{selectedItem.id}
                                </Typography>
                                <PriceField
                                    value={selectedItem.allocatedPrice}
                                    onChange={(event) => updateSaleItem(selectedItem.id, event.target.value)}
                                    disabled={saving}
                                    required={false}
                                    sx={{ width: 115 }}
                                />
                            </Stack>
                            <Stack direction="row">
                                <Button
                                    onClick={() => insertExpense({'itemId':selectedItem.id})}
                                    disabled={saving}
                                    sx={{ fontWeight: 'light', whiteSpace: 'nowrap' }}
                                >
                                    + Expense
                                </Button>
                                <IconButton
                                    aria-label={`Remove item ${selectedItem.id}`}
                                    onClick={() => removeSaleItem(selectedItem.id)}
                                    disabled={saving}
                                >
                                    <DeleteOutlinedIcon />
                                </IconButton>
                            </Stack>
                        </Stack>
                            <Expenses
                                expenses={itemExpenses.filter((expense) => expense.itemId === selectedItem.id)}
                                updateExpense={updateExpense}
                                deleteExpense={deleteExpense}
                                saving={saving}
                                open={true}
                            />
                        </Stack>
                    );
                })}
            </Stack>
        </>
    );
}