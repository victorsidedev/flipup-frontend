import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import PurchaseForm from "./PurchaseForm";
import { getImageBadgeCount, getPrimaryImage } from "./purchaseImageUtils";

const sourceLabels = {
    facebook: "Facebook Marketplace",
    ebay: "eBay",
    craigslist: "Craigslist",
    other: "Other",
};

function PurchaseItem({
    purchase,
    isActive,
    editingPurchase,
    onChange,
    onOpen,
    onSubmit,
    onCancel,
    onImageUpload,
    onRemoveImage,
    imageError,
}) {
    const name = purchase.name || purchase.seller || purchase.description || "Untitled purchase";
    const isSold = purchase.status === "sold";
    const status = isSold ? "Sold" : "Unsold";
    const source = sourceLabels[purchase.source] || purchase.source || "Other";
    const primaryImage = getPrimaryImage(purchase);
    const extraImageCount = getImageBadgeCount(purchase);

    return (
        <Paper
            onClick={isActive ? undefined : onOpen}
            onKeyDown={isActive ? undefined : (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onOpen();
                }
            }}
            role={isActive ? undefined : "button"}
            variant="outlined"
            tabIndex={isActive ? undefined : 0}
            sx={{
                borderRadius: 1,
                borderColor: isActive ? "primary.main" : undefined,
                p: { xs: 2, md: 2.25 },
                transition: "border-color 160ms ease, box-shadow 160ms ease, transform 160ms ease",
                "&:hover, &:focus-visible": {
                    borderColor: "primary.main",
                    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
                    outline: "none",
                    transform: { md: "translateY(-2px)" },
                },
            }}
        >
            {!isActive && (
                <Box
                    sx={{
                        alignItems: "center",
                        display: "grid",
                        gap: { xs: 1.5, md: 3 },
                        gridTemplateColumns: { xs: "80px minmax(0, 1fr) auto", md: "140px minmax(0, 1fr) auto" },
                    }}
                >
                    {primaryImage ? (
                        <Box sx={{ position: "relative" }}>
                            <Box
                                component="img"
                                src={primaryImage}
                                alt={name}
                                sx={{ borderRadius: 1.5, height: { xs: 80, md: 100 }, objectFit: "cover", width: "100%" }}
                            />
                            {extraImageCount > 0 && (
                                <Box
                                    sx={{
                                        alignItems: "center",
                                        backgroundColor: "rgba(15, 23, 42, 0.72)",
                                        borderRadius: 999,
                                        bottom: 8,
                                        color: "#fff",
                                        display: "flex",
                                        gap: 0.5,
                                        justifyContent: "center",
                                        padding: "4px 8px",
                                        position: "absolute",
                                        right: 8,
                                    }}
                                >
                                    <CollectionsOutlinedIcon sx={{ fontSize: 14 }} />
                                    <Typography sx={{ fontSize: 11, fontWeight: 700 }}>+{extraImageCount}</Typography>
                                </Box>
                            )}
                        </Box>
                    ) : (
                        <Box
                            aria-label="No purchase image"
                            sx={{
                                alignItems: "center",
                                bgcolor: "#f1f5f9",
                                border: "1px solid",
                                borderColor: "divider",
                                borderRadius: 1.5,
                                color: "#94a3b8",
                                display: "flex",
                                height: { xs: 80, md: 100 },
                                justifyContent: "center",
                            }}
                        >
                            <ImageOutlinedIcon sx={{ fontSize: { xs: 28, md: 34 } }} />
                        </Box>
                    )}
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                        <Typography noWrap sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, fontWeight: 700 }}>{name}</Typography>
                        <Typography sx={{ fontWeight: 700 }}>
                            {purchase.cost !== "" && purchase.cost != null ? `$${Number(purchase.cost).toFixed(2)}` : "--"}
                        </Typography>
                        <Box sx={{ alignItems: "center", color: "text.secondary", display: "flex", gap: 0.75, minWidth: 0 }}>
                            <PublicOutlinedIcon fontSize="small" color="primary" />
                            <Typography variant="body2" noWrap>{source}</Typography>
                        </Box>
                    </Stack>

                    <Stack alignItems="flex-end" spacing={0.75}>
                        <Chip label={status} size="small" sx={{ bgcolor: isSold ? "#dcfce7" : "#fef3c7", color: isSold ? "#166534" : "#92400e", fontWeight: 700 }} />
                        <Typography color="text.secondary" variant="body2" noWrap>{purchase.date || "--"}</Typography>
                    </Stack>
                </Box>
            )}
            {isActive && (
                <PurchaseForm
                    purchase={editingPurchase ?? purchase}
                    onFieldChange={onChange}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onImageUpload={onImageUpload}
                    onRemoveImage={onRemoveImage}
                    imageError={imageError}
                    imageInputId={`purchase-edit-image-upload-input-${purchase.id}`}
                    submitLabel="Save changes"
                />
            )}
        </Paper>
    );
}

export default PurchaseItem;
