import { Box, Button, ButtonBase, Typography } from '@mui/material';
import { formatMoney } from '../../utils/formatters.js';

export default function InventoryItem({ item, onSell, onOpen }) {
    const parentPath = item.ancestors.map(parent => `${parent.name} (#${parent.id})`).join(' → ');
    const sold = item.status === 'sold' || item.status === 'included';
    const loss = item.sale?.kind === 'loss';
    const saleParent = item.ancestors.find(parent => parent.id === item.soldWithItemId);
    const includedLabel = saleParent ? `${saleParent.name} (#${saleParent.id})` : `item #${item.soldWithItemId}`;

    return (
        <Box component="article" aria-label={`${item.name}, item ${item.id}`}
            sx={{ position: 'relative', isolation: 'isolate', minWidth: 0, maxWidth: 220, p: 1.25, display: 'flex', flexDirection: 'column', gap: 0.5,
                border: '1px solid', borderColor: 'divider', borderRadius: 1.5, bgcolor: 'background.paper' }}>
            <ButtonBase onClick={() => onOpen(item)} aria-label={`Edit ${item.name}, item ${item.id}`}
                sx={{ position: 'absolute', inset: 0, borderRadius: 'inherit', zIndex: 1,
                    '&.Mui-focusVisible': { outline: '2px solid', outlineColor: 'primary.main', outlineOffset: 2 } }} />
            <Typography variant="caption" color="text.secondary">#{item.id}{sold ? (loss ? ' · Loss' : ' · Sold') : ''}</Typography>
            <Typography component="h3" sx={{ fontSize: 14, fontWeight: 700, overflowWrap: 'anywhere' }}>{item.name}</Typography>
            <Typography variant="body2">Cost {formatMoney(item.price)}</Typography>
            {parentPath && (
                <Typography variant="caption" color="text.secondary" sx={{ overflowWrap: 'anywhere' }}>
                    Part of {parentPath}
                </Typography>
            )}
            <Box sx={{ mt: 'auto', pt: 0.5 }}>
                {sold ? (
                    <Typography variant="body2" sx={{ color: loss ? 'error.main' : 'success.dark', fontWeight: 600, py: 1, overflowWrap: 'anywhere' }}>
                        {item.status === 'included'
                            ? `Included in sale of ${includedLabel}`
                            : loss ? 'Loss' : `Sold for ${formatMoney(item.sale.price)}`}
                    </Typography>
                ) : (
                    <Button size="small" variant="outlined" fullWidth onClick={() => onSell(item)}
                        aria-label={`Mark sold: ${item.name}, item ${item.id}`} sx={{ minHeight: 40, position: 'relative', zIndex: 2 }}>
                        Mark sold
                    </Button>
                )}
            </Box>
        </Box>
    );
}
