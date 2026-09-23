import { Box, Button, Typography } from '@mui/material';

export default function InventoryEmpty({ hasItems, onClear }) {
  return (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography
        component="h2"
        variant="h6"
      >
        {hasItems ? 'No matching items' : 'Your inventory is empty'}
      </Typography>
      <Typography color="text.secondary">
        {hasItems ? 'Try another search or status.' : 'Items from your purchases will appear here.'}
      </Typography>
      {hasItems && <Button onClick={onClear}>Clear filters</Button>}
    </Box>
  );
}
