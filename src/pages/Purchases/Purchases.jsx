import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { fetchPurchases, createPurchase, updatePurchase } from "../../api/purchases";
import PurchaseList from "./PurchaseList";
import { removeImageAt, validateImageFiles } from "./purchaseImageUtils";

function createEmptyPurchase() {
    return {
    date: new Date().toISOString().slice(0, 10),
    seller: "",
    source: "",
    paymentMode: "",
    imageUrl: "",
    images: [],
    name: "",
    status: "unsold",
    cost: "",
    description: "",
    items: [],
    };
};

function Purchases() {
    const [purchases, setPurchases] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [purchase, setPurchase] = useState(createEmptyPurchase);
    const [activePurchaseId, setActivePurchaseId] = useState(null);
    const [editingPurchase, setEditingPurchase] = useState(null);
    const [imageError, setImageError] = useState("");

    useEffect(() => {
        fetchPurchases()
            .then((data) => setPurchases(data))
            .catch(() => setPurchases([]));
    }, []);

    function handleChange(event) {
        const { name, value } = event.target;

        setPurchase((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    function handleEditChange(event) {
        const { name, value } = event.target;

        setEditingPurchase((prev) => ({ ...prev, [name]: value }));
    }

    function togglePurchase(purchaseToEdit) {
        if (activePurchaseId === purchaseToEdit.id) {
            cancelEdit();
            return;
        }

        setShowForm(false);
        setImageError("");
        setActivePurchaseId(purchaseToEdit.id);
        setEditingPurchase({ ...purchaseToEdit });
    }

    function openNewPurchase() {
        setActivePurchaseId(null);
        setEditingPurchase(null);
        setImageError("");
        setShowForm(true);
    }

    function addImagesToPurchase(event, setPurchaseState) {
        const files = Array.from(event.target.files ?? []);
        if (files.length === 0) {
            return;
        }

        const validation = validateImageFiles(files);
        if (!validation.valid) {
            setImageError(validation.errors.join(" "));
            event.target.value = "";
            return;
        }

        setPurchaseState((prev) => ({
            ...prev,
            images: [...(prev.images ?? []), ...files],
        }));
        setImageError("");

        event.target.value = "";
    }

    function handleImageUpload(event) {
        addImagesToPurchase(event, setPurchase);
    }

    function handleEditImageUpload(event) {
        addImagesToPurchase(event, setEditingPurchase);
    }

    function removeImageFromPurchase(index, setPurchaseState) {
        setPurchaseState((prev) => {
            const nextImages = removeImageAt(prev.images, index);

            return {
                ...prev,
                images: nextImages,
                imageUrl: nextImages.find((image) => typeof image === "string") ?? "",
            };
        });
    }

    function handleRemoveImage(index) {
        removeImageFromPurchase(index, setPurchase);
    }

    function handleEditRemoveImage(index) {
        removeImageFromPurchase(index, setEditingPurchase);
    }

    async function handleUpdate(event) {
        event.preventDefault();

        try {
            const updatedPurchase = await updatePurchase(editingPurchase);
            setPurchases((prev) => prev.map((item) => (
                item.id === updatedPurchase.id ? updatedPurchase : item
            )));
            setActivePurchaseId(null);
            setEditingPurchase(null);
            setImageError("");
        } catch (error) {
            console.error("Failed to update purchase:", error);
        }
    }

    function cancelEdit() {
        setActivePurchaseId(null);
        setEditingPurchase(null);
        setImageError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        try {
            const createdPurchase = await createPurchase(purchase);
            setPurchases((prev) => [...prev, createdPurchase]);
        } catch (error) {
            console.error("Failed to create purchase:", error);
        }

        setShowForm(false);
        setPurchase(createEmptyPurchase());
        setImageError("");
    }

    function cancel() {
        setShowForm(false);
        setPurchase(createEmptyPurchase());
        setImageError("");
    }

    return (
        <Stack spacing={3}>
            <Box sx={{ mx: { xs: -2, md: 0 } }}>
                <Box sx={{ mb: 1.5, px: { xs: 2, md: 0 } }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Purchases
                    </Typography>
                </Box>
                <Divider sx={{ mb: 2, display: { xs: "none", md: "block" } }} />
                <PurchaseList
                    purchases={purchases}
                    purchase={purchase}
                    showForm={showForm}
                    onFieldChange={handleChange}
                    onOpenForm={openNewPurchase}
                    onSubmit={handleSubmit}
                    onCancel={cancel}
                    activePurchaseId={activePurchaseId}
                    editingPurchase={editingPurchase}
                    onEditChange={handleEditChange}
                    onOpenPurchase={togglePurchase}
                    onUpdate={handleUpdate}
                    onCancelEdit={cancelEdit}
                    onImageUpload={handleImageUpload}
                    onRemoveImage={handleRemoveImage}
                    onEditImageUpload={handleEditImageUpload}
                    onEditRemoveImage={handleEditRemoveImage}
                    imageError={imageError}
                />
            </Box>
        </Stack>
    );
}

export default Purchases;
