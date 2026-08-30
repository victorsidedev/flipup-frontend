import Dialog from "@mui/material/Dialog";

// Shared dialog shell so future Item/Sale popups get the same look for free.
function Modal({ open, onClose, maxWidth = "sm", children, ...rest }) {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth={maxWidth} {...rest}>
            {children}
        </Dialog>
    );
}

export default Modal;
