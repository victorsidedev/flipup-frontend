import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { isSavedItem } from '../purchases/purchaseDraft.js';
import { formatMoney } from '../../utils/formatters.js';

export default function ItemForm({
  item,
  items,
  selectedItemId,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onSell,
  canSell,
  visited = [],
}) {
  const path = [...visited, item.id];
  const children = items.filter((child) => child.parentId === item.id && !path.includes(child.id));
  const loss = item.sale?.kind === 'loss';
  const sold = item.status === 'sold';
  const primarySaleItem = item.sale?.items?.[0];
  const includedIn = primarySaleItem?.itemId !== item.id ? primarySaleItem : null;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box
        id={`editor-item-${item.id}`}
        sx={{
          p: 1.5,
          mb: 1,
          border: '1px solid',
          borderRadius: 1,
          borderColor: selectedItemId === item.id ? 'primary.main' : 'divider',
          bgcolor: selectedItemId === item.id ? '#f0f5ff' : 'background.paper',
          scrollMargin: 12,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
        >
          {isSavedItem(item) ? `Item #${item.id}` : 'New item'}
        </Typography>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          sx={{ gap: 1.5, mt: 1 }}
        >
          <TextField
            required
            id={`name-${item.id}`}
            label="Name"
            value={item.name || ''}
            onChange={(event) => onUpdateItem(item.id, { name: event.target.value })}
          />
          <TextField
            label="Purchase price ($)"
            type="number"
            value={item.price ?? ''}
            slotProps={{ htmlInput: { min: 0, max: 99999999.99, step: '0.01' } }}
            onChange={(event) => onUpdateItem(item.id, { price: event.target.value })}
          />
        </Stack>
        {sold && (
          <Typography
            variant="body2"
            sx={{ color: loss ? 'error.main' : 'success.dark', mt: 1 }}
          >
            {includedIn
              ? `Included in sale with item #${includedIn.itemId}`
              : loss
                ? 'Loss'
                : `Sold for ${formatMoney(item.sale.price)}`}
          </Typography>
        )}
        <Stack
          direction="row"
          sx={{ flexWrap: 'wrap', gap: 0.5, mt: 1 }}
        >
          <Button
            size="small"
            onClick={() => onAddItem(item.id)}
            disabled={sold}
          >
            + Sub-item
          </Button>
          {!sold && (
            <Button
              size="small"
              onClick={() => onSell(item)}
              disabled={!canSell || !isSavedItem(item)}
            >
              Mark sold
            </Button>
          )}
          <Button
            size="small"
            color="error"
            onClick={() => onDeleteItem(item)}
          >
            Delete
          </Button>
        </Stack>
      </Box>
      {children.length > 0 && (
        <Box sx={{ pl: { xs: 1, sm: 2 }, borderLeft: '2px solid', borderColor: 'divider' }}>
          {children.map((child) => (
            <ItemForm
              key={child.id}
              item={child}
              items={items}
              selectedItemId={selectedItemId}
              onAddItem={onAddItem}
              onUpdateItem={onUpdateItem}
              onDeleteItem={onDeleteItem}
              onSell={onSell}
              canSell={canSell}
              visited={path}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
