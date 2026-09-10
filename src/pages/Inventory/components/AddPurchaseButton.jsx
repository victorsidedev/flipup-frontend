import { Box, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddPurchaseButton({ onClick }) {

    return (
        <>
            <Fab
                color="primary"
                variant="extended"
                aria-label="Add purchase"
                onClick={onClick}
                sx={{
                    position: 'fixed',
                    // Match the centered 1440px content beside the 240px sidebar,
                    // including the desktop layout's 32px padding.
                    right: { xs: 16, md: 'max(32px, calc((100% - 240px - 1440px) / 2))' },
                    // Clear the mobile bottom navigation (56px) plus a 16px gap.
                    bottom: { xs: 'calc(72px + env(safe-area-inset-bottom))', md: 24 },
                    width: { xs: 56, md: 'auto' },
                    minWidth: 56,
                    height: 56,
                    px: { xs: 0, md: 3 },
                    gap: { xs: 0, md: 1 },
                    borderRadius: 28,
                }}
            >
                <AddIcon />
                <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>Add purchase</Box>
            </Fab>
        </>
    );
}
