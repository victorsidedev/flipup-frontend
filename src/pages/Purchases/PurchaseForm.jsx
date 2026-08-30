import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { getImageSummaryLabel } from "./purchaseImageUtils";

function PurchaseForm({
    purchase,
    onFieldChange,
    onSubmit,
    onCancel,
    onImageUpload,
    onRemoveImage,
    imageError,
}) {
    const [showMoreDetails, setShowMoreDetails] = React.useState(false);
    const imageCount = Array.isArray(purchase.images) ? purchase.images.length : 0;

    return (
        <Box component="form" onSubmit={onSubmit} sx={{ display: "grid", gap: 2 }}>
            <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", gap: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>New purchase</Typography>
            </Box>

            <Box sx={{ display: "grid", gap: 2 }}>
                <TextField label="Title" name="name" value={purchase.name} onChange={onFieldChange} required />

                <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                    <TextField label="Price" name="cost" type="number" value={purchase.cost} onChange={onFieldChange} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
                    <TextField label="Date" name="date" type="date" value={purchase.date} onChange={onFieldChange} slotProps={{ inputLabel: { shrink: true } }} />
                </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 1.5 }}>
                <Button
                    type="button"
                    color="primary"
                    onClick={() => document.getElementById("purchase-image-upload-input")?.click()}
                    startIcon={<CloudUploadOutlinedIcon />}
                    sx={{ justifyContent: "flex-start", py: 1.25, px: 1.5, borderRadius: 1.5, border: "1px solid", borderColor: "divider", bgcolor: "#f8fafc" }}
                    variant="outlined"
                >
                    <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>Photos</Typography>
                            <Typography color="text.secondary" variant="caption">{getImageSummaryLabel(imageCount)}</Typography>
                        </Box>
                        <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
                            <CollectionsOutlinedIcon fontSize="small" />
                            <AddIcon fontSize="small" />
                        </Box>
                    </Box>
                    <input
                        accept="image/jpeg,image/png,image/webp"
                        id="purchase-image-upload-input"
                        multiple
                        onChange={onImageUpload}
                        style={{ display: "none" }}
                        type="file"
                        aria-label="Upload purchase images"
                    />
                </Button>

                {imageCount > 0 && (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                        {purchase.images.map((image, index) => (
                            <Box key={`${image}-${index}`} sx={{ position: "relative" }}>
                                <Box
                                    component="img"
                                    src={image}
                                    alt={`Purchase preview ${index + 1}`}
                                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, height: 64, objectFit: "cover", width: 64 }}
                                />
                                <IconButton
                                    aria-label={`Remove image ${index + 1}`}
                                    color="error"
                                    onClick={() => onRemoveImage(index)}
                                    size="small"
                                    sx={{ bgcolor: "rgba(255,255,255,0.82)", position: "absolute", right: -6, top: -6 }}
                                >
                                    <DeleteOutlineIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Stack>
                )}
            </Box>

            <Box
                component="div"
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Button
                    type="button"
                    endIcon={showMoreDetails ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
                    onClick={() => setShowMoreDetails((prev) => !prev)}
                    sx={{
                        alignItems: "center",
                        bgcolor: "#f8fafc",
                        border: "none",
                        color: "text.primary",
                        display: "flex",
                        fontWeight: 600,
                        justifyContent: "space-between",
                        p: 1.5,
                        textAlign: "left",
                        width: "100%",
                    }}
                    variant="text"
                >
                    Add more details
                </Button>
                <Collapse in={showMoreDetails} timeout={200} unmountOnExit>
                    <Stack spacing={2} sx={{ p: 1.5, pt: 0 }}>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                            <TextField label="Seller" name="seller" value={purchase.seller} onChange={onFieldChange} />
                            <TextField label="Source" name="source" value={purchase.source} onChange={onFieldChange} />
                        </Box>
                        <TextField label="Payment mode" name="paymentMode" value={purchase.paymentMode} onChange={onFieldChange} />
                        <TextField label="Description" name="description" value={purchase.description} onChange={onFieldChange} multiline minRows={3} />
                    </Stack>
                </Collapse>
            </Box>

            {imageError && (
                <Typography color="error.main" variant="caption">
                    {imageError}
                </Typography>
            )}

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                <Button type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained">Save purchase</Button>
            </Box>
        </Box>
    );
}

export default PurchaseForm;
