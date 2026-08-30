import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import ChevronRightOutlinedIcon from "@mui/icons-material/ChevronRightOutlined";
import PurchaseForm from "./PurchaseForm";
import PurchaseItem from "./PurchaseItem";

function PurchaseList({
    purchases,
    purchase,
    showForm,
    onFieldChange,
    onOpenForm,
    onSubmit,
    onCancel,
    activePurchaseId,
    editingPurchase,
    onEditChange,
    onOpenPurchase,
    onUpdate,
    onCancelEdit,
    onImageUpload,
    onRemoveImage,
    imageError,
}) {
    return (
        <Stack spacing={1.25}>
            <Paper
                onClick={showForm ? undefined : onOpenForm}
                onKeyDown={showForm ? undefined : (event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        onOpenForm();
                    }
                }}
                role={showForm ? undefined : "button"}
                tabIndex={showForm ? undefined : 0}
                aria-expanded={showForm}
                aria-label={showForm ? "Create new purchase form expanded" : "Create new purchase"}
                variant="outlined"
                sx={{
                    bgcolor: showForm ? "background.paper" : "#f8fafc",
                    border: showForm ? "1px solid" : "1.5px dashed",
                    borderColor: showForm ? "primary.main" : "rgba(59, 130, 246, 0.38)",
                    borderRadius: 2,
                    cursor: showForm ? "default" : "pointer",
                    p: { xs: 2, md: 2.25 },
                    textAlign: "left",
                    transition: "border-color 160ms ease, box-shadow 160ms ease",
                    width: "100%",
                    "&:hover, &:focus-visible": showForm ? {} : {
                        borderColor: "primary.main",
                        boxShadow: "0 6px 16px rgba(15, 23, 42, 0.06)",
                        outline: "none",
                    },
                }}
            >
                {!showForm && (
                    <Box
                        sx={{
                            alignItems: "center",
                            display: "grid",
                            gap: { xs: 1.5, md: 3 },
                            gridTemplateColumns: { xs: "80px minmax(0, 1fr) auto", md: "140px minmax(0, 1fr) auto" },
                        }}
                    >
                        <Box
                            sx={{
                                alignItems: "center",
                                backgroundColor: "rgba(59, 130, 246, 0.08)",
                                border: "1px solid",
                                borderColor: "rgba(59, 130, 246, 0.2)",
                                borderRadius: 1.5,
                                color: "primary.main",
                                display: "flex",
                                height: { xs: 80, md: 100 },
                                justifyContent: "center",
                            }}
                        >
                            <AddIcon sx={{ fontSize: { xs: 28, md: 34 } }} />
                        </Box>

                        <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                            <Typography sx={{ fontSize: { xs: "1rem", md: "1.125rem" }, fontWeight: 700 }}>Create new purchase</Typography>
                            <Typography color="text.secondary" variant="body2">Add cost, photos, and items.</Typography>
                        </Stack>

                        <Box
                            sx={{
                                alignItems: "center",
                                color: "primary.main",
                                display: "flex",
                                justifyContent: "center",
                            }}
                        >
                            <ChevronRightOutlinedIcon fontSize="small" />
                        </Box>
                    </Box>
                )}

                {showForm && (
                    <PurchaseForm
                        purchase={purchase}
                        onFieldChange={onFieldChange}
                        onSubmit={onSubmit}
                        onCancel={onCancel}
                        onImageUpload={onImageUpload}
                        onRemoveImage={onRemoveImage}
                        imageError={imageError}
                    />
                )}
            </Paper>

            {purchases.map((purchaseItem, index) => (
                <PurchaseItem
                    key={purchaseItem.id ?? index}
                    purchase={purchaseItem}
                    isActive={purchaseItem.id === activePurchaseId}
                    editingPurchase={editingPurchase}
                    onChange={onEditChange}
                    onOpen={() => onOpenPurchase(purchaseItem)}
                    onSubmit={onUpdate}
                    onCancel={onCancelEdit}
                />
            ))}
        </Stack>
    );
}

export default PurchaseList;
