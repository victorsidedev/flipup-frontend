import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';

export default function DeleteConfirmation({ confirmation, busy, onCancel, onConfirm }) {
  const isPurchase = confirmation.kind === 'purchase';
  return (
    <Dialog
      open
      onClose={busy ? undefined : onCancel}
      aria-labelledby="delete-title"
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle id="delete-title">
        {isPurchase ? 'Delete purchase?' : `Delete ${confirmation.item.name}?`}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {isPurchase
            ? 'This purchase, all its items, and their sale records will be permanently deleted.'
            : `This item, its nested parts (${confirmation.count} items total), and their sale records will be permanently deleted.`}{' '}
          This cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onCancel}
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={busy}
          color="error"
          variant="contained"
        >
          {busy ? 'Deleting…' : 'Delete permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
