import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import { getItemImageSrc, getItemSummaryLabel, validateImageFiles } from "./purchaseImageUtils";

function ItemImageThumbnail({ image, onRemove, alt = "Item image" }) {
    const src = useMemo(() => getItemImageSrc(image), [image]);

    useEffect(() => {
        return () => {
            if (image instanceof File && src) {
                URL.revokeObjectURL(src);
            }
        };
    }, [image, src]);

    if (!src) return null;

    return (
        <Box sx={{ position: "relative", display: "inline-block" }}>
            <Box
                component="img"
                src={src}
                alt={alt}
                sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1.5,
                    height: 48,
                    width: 48,
                    objectFit: "cover",
                    display: "block",
                }}
            />
            {onRemove && (
                <IconButton
                    type="button"
                    aria-label="Remove image"
                    color="error"
                    onClick={onRemove}
                    size="small"
                    sx={{
                        bgcolor: "rgba(255,255,255,0.85)",
                        position: "absolute",
                        right: -6,
                        top: -6,
                        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        p: "2px",
                        "&:hover": { bgcolor: "#ffffff" },
                    }}
                >
                    <DeleteOutlineIcon sx={{ fontSize: 14 }} />
                </IconButton>
            )}
        </Box>
    );
}

function ItemCard({
    item,
    index,
    isExpanded,
    onToggleExpand,
    onFieldChange,
    onDelete,
    onImageUpload,
    onImageRemove,
    imageError,
}) {
    const images = Array.isArray(item.images) ? item.images : [];
    const imageInputId = `item-image-input-${index}`;
    const priceVal = item.price ?? item.cost;
    const hasPrice = priceVal !== "" && priceVal != null && !isNaN(Number(priceVal));

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 1.25,
                borderRadius: 1.5,
                bgcolor: "background.paper",
                borderColor: "divider",
                transition: "border-color 160ms ease, box-shadow 160ms ease",
                "&:hover": {
                    borderColor: "primary.main",
                },
            }}
        >
            <Box
                onClick={() => onToggleExpand(index)}
                sx={{
                    alignItems: "center",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    userSelect: "none",
                    gap: 1,
                }}
            >
                <Box sx={{ alignItems: "center", display: "flex", gap: 0.75, minWidth: 0, flex: 1 }}>
                    <IconButton size="small" sx={{ p: 0.25, color: "text.secondary" }}>
                        {isExpanded ? <ExpandLessOutlinedIcon fontSize="small" /> : <ExpandMoreOutlinedIcon fontSize="small" />}
                    </IconButton>
                    <Typography noWrap sx={{ fontSize: "0.875rem", fontWeight: 700, color: "text.primary" }}>
                        {item.name || `Item #${index + 1}`}
                    </Typography>
                    {hasPrice && (
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main", ml: 0.5, flexShrink: 0 }}>
                            ${Number(priceVal).toFixed(2)}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }} onClick={(e) => e.stopPropagation()}>
                    {images.length > 0 && !isExpanded && (
                        <Typography variant="caption" color="text.secondary" sx={{ mr: 0.5, fontWeight: 600 }}>
                            {images.length} {images.length === 1 ? "photo" : "photos"}
                        </Typography>
                    )}
                    <IconButton
                        type="button"
                        size="small"
                        color="error"
                        onClick={() => onDelete(index)}
                        aria-label={`Remove Item ${index + 1}`}
                    >
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={isExpanded} timeout={200} unmountOnExit={false}>
                <Box sx={{ display: "grid", gap: 1.25, pt: 1.25, borderTop: "1px solid", borderColor: "divider", mt: 1 }}>
                    <Box sx={{ display: "grid", gap: 1.25, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                        <TextField
                            label="Item name"
                            value={item.name || ""}
                            onChange={(e) => onFieldChange(index, "name", e.target.value)}
                            size="small"
                        />
                        <TextField
                            label="Price"
                            type="number"
                            value={item.price ?? item.cost ?? ""}
                            onChange={(e) => onFieldChange(index, "price", e.target.value)}
                            slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
                            size="small"
                        />
                    </Box>

                    <TextField
                        label="Description"
                        value={item.description || ""}
                        onChange={(e) => onFieldChange(index, "description", e.target.value)}
                        multiline
                        minRows={2}
                        size="small"
                    />

                    <Box sx={{ display: "grid", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Typography variant="caption" sx={{ fontWeight: 700, color: "text.secondary" }}>
                                Item Photos
                            </Typography>
                            <Button
                                type="button"
                                size="small"
                                startIcon={<CollectionsOutlinedIcon fontSize="small" />}
                                onClick={() => document.getElementById(imageInputId)?.click()}
                                sx={{ fontSize: "0.75rem", py: 0.5 }}
                            >
                                Add photos
                            </Button>
                            <input
                                id={imageInputId}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/webp"
                                style={{ display: "none" }}
                                onChange={(e) => onImageUpload(index, e)}
                            />
                        </Box>

                        {imageError && (
                            <Typography color="error.main" variant="caption">
                                {imageError}
                            </Typography>
                        )}

                        {images.length > 0 && (
                            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1, pt: 0.25 }}>
                                {images.map((img, imgIdx) => (
                                    <ItemImageThumbnail
                                        key={imgIdx}
                                        image={img}
                                        alt={`Item ${index + 1} photo ${imgIdx + 1}`}
                                        onRemove={() => onImageRemove(index, imgIdx)}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>
                </Box>
            </Collapse>
        </Paper>
    );
}

function PurchaseItems({ items = [], onChange }) {
    const safeItems = Array.isArray(items) ? items : [];
    const itemCount = safeItems.length;
    const [expandedMap, setExpandedMap] = useState({});
    const [itemImageErrors, setItemImageErrors] = useState({});

    const handleToggleExpand = (index) => {
        setExpandedMap((prev) => ({ ...prev, [index]: !prev[index] }));
    };

    const handleAddItem = () => {
        const newItem = { name: "", price: "", description: "", images: [] };
        const newIndex = safeItems.length;
        setExpandedMap((prev) => ({ ...prev, [newIndex]: true }));
        if (typeof onChange === "function") {
            onChange([...safeItems, newItem]);
        }
    };

    const handleFieldChange = (index, field, value) => {
        const updated = safeItems.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        if (typeof onChange === "function") {
            onChange(updated);
        }
    };

    const handleDeleteItem = (indexToDelete) => {
        const updated = safeItems.filter((_, idx) => idx !== indexToDelete);
        setItemImageErrors((prev) => {
            const next = { ...prev };
            delete next[indexToDelete];
            return next;
        });
        setExpandedMap((prev) => {
            const next = {};
            Object.keys(prev).forEach((key) => {
                const i = Number(key);
                if (i < indexToDelete) {
                    next[i] = prev[i];
                } else if (i > indexToDelete) {
                    next[i - 1] = prev[i];
                }
            });
            return next;
        });
        if (typeof onChange === "function") {
            onChange(updated);
        }
    };

    const handleItemImageUpload = (index, event) => {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) return;

        const validation = validateImageFiles(files);
        if (!validation.valid) {
            setItemImageErrors((prev) => ({ ...prev, [index]: validation.errors.join(" ") }));
            event.target.value = "";
            return;
        }

        setItemImageErrors((prev) => ({ ...prev, [index]: "" }));
        const updated = safeItems.map((item, i) => {
            if (i !== index) return item;
            const currentImages = Array.isArray(item.images) ? item.images : [];
            return { ...item, images: [...currentImages, ...files] };
        });

        if (typeof onChange === "function") {
            onChange(updated);
        }
        event.target.value = "";
    };

    const handleRemoveItemImage = (itemIndex, imageIndex) => {
        const updated = safeItems.map((item, i) => {
            if (i !== itemIndex) return item;
            const currentImages = Array.isArray(item.images) ? item.images : [];
            return { ...item, images: currentImages.filter((_, idx) => idx !== imageIndex) };
        });

        if (typeof onChange === "function") {
            onChange(updated);
        }
    };

    return (
        <Box sx={{ display: "grid", gap: 1.25 }}>
            <Box
                sx={{
                    alignItems: "center",
                    borderTop: "1px solid",
                    borderBottom: itemCount > 0 ? undefined : "1px solid",
                    borderColor: "divider",
                    display: "flex",
                    justifyContent: "space-between",
                    py: 1,
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: "0.875rem", fontWeight: 700, lineHeight: 1.25 }}>
                        Items
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                        {getItemSummaryLabel(itemCount)}
                    </Typography>
                </Box>
                <Button
                    type="button"
                    size="small"
                    color="primary"
                    onClick={handleAddItem}
                    startIcon={<AddIcon fontSize="small" />}
                    variant="outlined"
                    sx={{ borderRadius: 2 }}
                >
                    Add item
                </Button>
            </Box>

            {itemCount > 0 && (
                <Stack
                    spacing={1}
                    sx={{
                        pb: 1,
                        borderBottom: "1px solid",
                        borderColor: "divider",
                    }}
                >
                    {safeItems.map((item, index) => (
                        <ItemCard
                            key={item.id ? `item-${item.id}` : `item-${index}`}
                            item={item}
                            index={index}
                            isExpanded={Boolean(expandedMap[index])}
                            onToggleExpand={handleToggleExpand}
                            onFieldChange={handleFieldChange}
                            onDelete={handleDeleteItem}
                            onImageUpload={handleItemImageUpload}
                            onImageRemove={handleRemoveItemImage}
                            imageError={itemImageErrors[index]}
                        />
                    ))}
                </Stack>
            )}
        </Box>
    );
}

export default PurchaseItems;