import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const sourceLabels = {
    facebook: "Facebook Marketplace",
    ebay: "eBay",
    craigslist: "Craigslist",
    other: "Other",
};

function PurchaseItem({ purchase, isActive, editingPurchase, onChange, onOpen, onSubmit, onCancel }) {
    const name = purchase.name || purchase.seller || purchase.description || "Untitled purchase";
    const isSold = purchase.status === "sold";
    const status = isSold ? "Sold" : "Unsold";
    const source = sourceLabels[purchase.source] || purchase.source || "Other";
    const imageUrls = Array.isArray(purchase.images) && purchase.images.length > 0 ? purchase.images : (purchase.imageUrl ? [purchase.imageUrl] : []);
    const primaryImage = imageUrls[0] ?? "";
    const extraImageCount = Math.max(0, imageUrls.length - 1);

    return (
        <Paper
            component="form"
            onClick={isActive ? undefined : onOpen}
            onSubmit={isActive ? onSubmit : undefined}
            role={isActive ? undefined : "button"}
            variant="outlined"
            tabIndex={isActive ? undefined : 0}
            sx={{
                borderRadius: 2,
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
            <Collapse in={isActive} timeout={250}>
                <Stack spacing={2} sx={{ pt: 2.5 }}>
                        <TextField label="Title" name="name" value={(editingPurchase ?? purchase).name} onChange={onChange} required />
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                            <TextField label="Seller" name="seller" value={(editingPurchase ?? purchase).seller} onChange={onChange} />
                            <TextField label="Source" name="source" value={(editingPurchase ?? purchase).source} onChange={onChange} />
                        </Box>
                        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" } }}>
                            <TextField label="Price" name="cost" type="number" value={(editingPurchase ?? purchase).cost} onChange={onChange} slotProps={{ htmlInput: { min: 0, step: 0.01 } }} />
                            <TextField label="Payment mode" name="paymentMode" value={(editingPurchase ?? purchase).paymentMode} onChange={onChange} />
                        </Box>
                        <TextField label="Date" name="date" type="date" value={(editingPurchase ?? purchase).date} onChange={onChange} slotProps={{ inputLabel: { shrink: true } }} />
                        <TextField label="Description" name="description" value={(editingPurchase ?? purchase).description} onChange={onChange} multiline minRows={4} />
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Button type="button" onClick={onCancel}>Cancel</Button>
                            <Button type="submit" variant="contained">Update purchase</Button>
                        </Box>
                </Stack>
            </Collapse>
        </Paper>
    );
}

export default PurchaseItem;
