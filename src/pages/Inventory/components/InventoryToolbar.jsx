import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';

export default function InventoryToolbar({
  total,
  sold,
  query,
  status,
  onQueryChange,
  onStatusChange,
  onRefresh,
  loading,
}) {
  return (
    <>
      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2, mb: 2 }}
      >
        <Box>
          <Typography
            component="h1"
            variant="h5"
            sx={{ fontWeight: 700 }}
          >
            Inventory
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
          >
            {total} items · {total - sold} available · {sold} sold
          </Typography>
        </Box>
        <Button
          onClick={onRefresh}
          disabled={loading}
          startIcon={<RefreshIcon />}
          size="small"
        >
          Refresh
        </Button>
      </Stack>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        sx={{ gap: 1.5, mb: 2 }}
      >
        <TextField
          label="Search items or purchases"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
        />
        <TextField
          select
          label="Status"
          value={status}
          onChange={(event) => onStatusChange(event.target.value)}
          sx={{ width: { xs: '100%', sm: 170 }, flexShrink: 0 }}
        >
          <MenuItem value="all">All items</MenuItem>
          <MenuItem value="available">Available</MenuItem>
          <MenuItem value="sold">Sold</MenuItem>
        </TextField>
      </Stack>
    </>
  );
}
