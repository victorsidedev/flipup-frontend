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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { getImageSummaryLabel } from "./purchaseImageUtils";
import PurchaseItems from "./PurchaseItems";

function PurchaseForm({
    purchase,
    onFieldChange,
    onItemsChange,
    onSubmit,
    onCancel,
    onImageUpload,
    onRemoveImage,
    imageError,
    imageInputId = "purchase-image-upload-input",
    submitLabel = "Save purchase",
}) {
    const [showMoreDetails, setShowMoreDetails] = React.useState(false);

    const handleItemsChange = React.useCallback(
        (newItems) => {
            if (typeof onItemsChange === "function") {
                onItemsChange(newItems);
            } else if (typeof onFieldChange === "function") {
                onFieldChange({
                    target: {
                        name: "items",
                        value: newItems,
                    },
                });
            }
        },
        [onItemsChange, onFieldChange],
    );
    const imagePreviews = React.useMemo(
        () => (Array.isArray(purchase.images) ? purchase.images : []).map((image) => ({
            image,
            src: image instanceof File ? URL.createObjectURL(image) : image,
        })),
        [purchase.images],
    );
    const imageCount = imagePreviews.length;

    React.useEffect(() => () => {
        imagePreviews.forEach(({ image, src }) => {
            if (image instanceof File) {
                URL.revokeObjectURL(src);
            }
        });
    }, [imagePreviews]);

    return (
        <Box
            component="form"
            onSubmit={onSubmit}
            sx={{
                display: "grid",
                gap: { xs: 1.5, sm: 2 },
            }}
        >

            <Box sx={{ display: "grid", gap: { xs: 1.25, sm: 1.5 } }}>
                <TextField label="Title" name="name" value={purchase.name} onChange={onFieldChange} required />

                <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                    <TextField
                        label="Price" name="cost" type="number" value={purchase.cost} onChange={onFieldChange} slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                        />
                    <TextField label="Date" name="date" type="date" value={purchase.date} onChange={onFieldChange} slotProps={{ inputLabel: { shrink: true } }} />
                </Box>
            </Box>

            <Box sx={{ display: "grid", gap: 1 }}>
                <Button
                    type="button"
                    color="primary"
                    onClick={() => document.getElementById(imageInputId)?.click()}
                    startIcon={<CollectionsOutlinedIcon />}
                    sx={{
                        alignItems: "center",
                        borderBottom: imageCount>0 ? undefined : "1px solid",
                        borderRadius: 0,
                        borderTop: "1px solid",
                        borderColor: "divider",
                        justifyContent: "flex-start",
                        minHeight: 64,
                        px: 0,
                        py: 1,
                        textAlign: "left",
                        "& .MuiButton-startIcon": { alignSelf: "center", m: 0, mr: 1.25 },
                        "&:hover": { backgroundColor: "action.hover" },
                    }}
                    variant="text"
                >
                    <Box sx={{ alignItems: "center", display: "flex", justifyContent: "space-between", width: "100%" }}>
                        <Box>
                            <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.25 }}>Photos</Typography>
                            <Typography color="text.secondary" variant="caption">{getImageSummaryLabel(imageCount)}</Typography>
                        </Box>
                        <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
                            <CollectionsOutlinedIcon fontSize="small" />
                            <AddIcon fontSize="small" />
                        </Box>
                    </Box>
                    <input
                        accept="image/jpeg,image/png,image/webp"
                        id={imageInputId}
                        multiple
                        onChange={onImageUpload}
                        style={{ display: "none" }}
                        type="file"
                        aria-label="Upload purchase images"
                    />
                </Button>

                {imageCount > 0 && (
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    pt: 0.25 }}>
                        {imagePreviews.map(({ src }, index) => (
                            <Box key={`${src}-${index}`} sx={{ position: "relative" }}>
                                <Box
                                    component="img"
                                    src={src}
                                    alt={`Purchase preview ${index + 1}`}
                                    sx={{ border: "1px solid", borderColor: "divider", borderRadius: 1.5, height: 56, objectFit: "cover", width: 56 }}
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

            <PurchaseItems items={purchase.items} onChange={handleItemsChange} />

            <Box>
                <Button
                    type="button"
                    startIcon={showMoreDetails ? <ExpandLessOutlinedIcon /> : <ExpandMoreOutlinedIcon />}
                    onClick={() => setShowMoreDetails((prev) => !prev)}
                    sx={{
                        alignItems: "center",
                        border: "none",
                        color: "text.primary",
                        display: "flex",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        justifyContent: "flex-start",
                        px: 0,
                        py: 1.25,
                        textAlign: "left",
                        width: "100%",
                    }}
                    variant="text"
                >
                    Seller, source, payment, or notes
                </Button>
                <Collapse in={showMoreDetails} timeout={200} unmountOnExit>
                    <Stack spacing={1.5} sx={{ pb: 1.5 }}>
                        <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
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

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", pt: 0.25 }}>
                <Button type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" variant="contained">{submitLabel}</Button>
            </Box>
        </Box>
    );
}

export default PurchaseForm;
