import { Typography, Stack, TextField, IconButton, MenuItem, Button, Divider } from '@mui/material';
import PriceField from './PriceField.jsx';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';

export default function SaleItems({
    selectedItems,
    updateSaleItem,
    removeSaleItem,
    saving,
}) {
    return (
        <>
            <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} > Items in this sale</Typography>
            <Stack sx={{ gap: 1 }}>
                {selectedItems.map((selectedItem) => {
                    return (
                        <Stack
                            key={selectedItem.id}
                            direction="row"
                            sx={{ alignItems: 'center', gap: 1 }}
                        >
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
                            <IconButton
                                aria-label={`Remove item ${selectedItem.id}`}
                                onClick={() => removeSaleItem(selectedItem.id)}
                                disabled={saving}
                            >
                                <DeleteOutlinedIcon />
                            </IconButton>
                        </Stack>
                    );
                })}
            </Stack>
        </>
    );
}