import { Box, Button, ButtonBase, FormControlLabel, Typography } from '@mui/material';
import { useState } from 'react';
import { formatMoney } from '../../utils/formatters.js';
import { Checkbox } from '@mui/material';
import { green, grey } from '@mui/material/colors';

export default function InventoryItem({ item, saleDraft, onSell, onOpen, onItemToggle }) {
  const parentPath = item.ancestors.map((parent) => `${parent.name} (#${parent.id})`).join(' → ');
  const sold = item.status === 'sold';
  const loss = item.sale?.kind === 'loss';
  const primarySaleItem = item.sale?.items?.[0];
  const includedIn = primarySaleItem?.itemId !== item.id ? primarySaleItem : null;

  return (
    <Box
      component="article"
      aria-label={`${item.name}, item ${item.id}`}
      sx={{
        position: 'relative',
        isolation: 'isolate',
        minWidth: 0,
        maxWidth: 220,
        p: 1.25,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1.5,
        bgcolor: 'background.paper',
      }}
    >
        {!sold && <Checkbox
            checked={saleDraft?.items?.some((draftItem) => draftItem.id === item.id)}
            onChange={(e) => onItemToggle(item)}
            slotProps={{
                input: { 'aria-label': 'controlled' }
            }}
            sx={{
                position: 'absolute',
                top: 4,
                right: 4,
                zIndex: 2,
                color: grey[600],
                '&.Mui-checked': {
                    color: green[800],
                },
            }}
        />}
      <ButtonBase
        onClick={() => onOpen(item)}
        aria-label={`Edit ${item.name}, item ${item.id}`}
        sx={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          zIndex: 1,
          '&.Mui-focusVisible': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: 2,
          },
        }}
      />
      <Typography
        variant="caption"
        color="text.secondary"
      >
        #{item.id}
        {sold ? (loss ? ' · Loss' : ' · Sold') : ''}
      </Typography>
      <Typography
        component="h3"
        sx={{ fontSize: 14, fontWeight: 700, overflowWrap: 'anywhere' }}
      >
        {item.name}
      </Typography>
      <Typography variant="body2">Cost {formatMoney(item.price)}</Typography>
      {parentPath && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ overflowWrap: 'anywhere' }}
        >
          Part of {parentPath}
        </Typography>
      )}
      <Box sx={{ mt: 'auto', pt: 0.5 }}>
        {sold ? (
          <Typography
            variant="body2"
            sx={{
              color: loss ? 'error.main' : 'success.dark',
              fontWeight: 600,
              py: 1,
              overflowWrap: 'anywhere',
            }}
          >
            {includedIn
              ? `Included in sale with item #${includedIn.itemId}`
              : loss
                ? 'Loss'
                : `Sold for ${formatMoney(item.sale.price)}`}
          </Typography>
        ) : (
          <Button
            size="small"
            variant="outlined"
            fullWidth
            onClick={() => onSell(item)}
            aria-label={`Mark sold: ${item.name}, item ${item.id}`}
            sx={{ minHeight: 40, position: 'relative', zIndex: 2 }}
          >
            Mark sold
          </Button>
        )}
      </Box>
    </Box>
  );
}
