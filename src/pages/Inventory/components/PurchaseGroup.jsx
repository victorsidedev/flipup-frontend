import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InventoryItem from '../InventoryItem.jsx';
import { formatDate } from '../../../utils/formatters.js';

export default function PurchaseGroup({ purchase, saleDraft, items, total, onSell, onOpen, onItemSelectToggle }) {
  return (
    <Accordion
      defaultExpanded
      disableGutters
      elevation={0}
      sx={{ mb: 1.5, '&::before': { display: 'none' } }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        id={`purchase-${purchase.id}-heading`}
        aria-controls={`purchase-${purchase.id}-items`}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            component="h2"
            sx={{ fontSize: 15, fontWeight: 600, overflowWrap: 'anywhere' }}
          >
            {purchase.source || 'Unknown source'} · Purchase #{purchase.id}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {formatDate(purchase.purchaseDate)} ·{' '}
            {items.length === total ? `${total} items` : `${items.length} of ${total} items`}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 1, sm: 2 }, pt: 0 }}>
        {total === 0 && (
          <Button onClick={() => onOpen(purchase.id, null)}>Edit empty purchase</Button>
        )}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              sm: 'repeat(auto-fill, minmax(170px, 1fr))',
            },
            gap: 1,
            '& > article': { width: '100%', boxSizing: 'border-box' },
          }}
        >
          {items.map((item) => (
            <InventoryItem
              saleDraft={saleDraft}
              key={item.id}
              item={item}
              onSell={onSell}
              onOpen={(item) => onOpen(purchase.id, item.id)}
              onItemSelectToggle={onItemSelectToggle}
            />
          ))}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
