import { normalizeImageUrls } from "../utils/imageUrls.js";

function toFrontendPurchase(purchase) {
    const imageUrl = purchase.image_url ?? purchase.imageUrl ?? "";
    const images = normalizeImageUrls(purchase.images, imageUrl);

    return {
        ...purchase,
        date: purchase.purchased_on?.slice(0, 10) ?? purchase.date ?? "",
        imageUrl: imageUrl || images[0] || "",
        images,
        name: purchase.title ?? purchase.name ?? "",
        paymentMode: purchase.payment_mode ?? purchase.paymentMode ?? "",
        cost: purchase.purchase_price ?? purchase.cost ?? "",
        status: purchase.status ?? "unsold",
        items: purchase.items ?? [],
    };
}

function toApiPurchase(purchase) {
    const images = normalizeImageUrls(purchase.images, purchase.imageUrl);

    return {
        ...purchase,
        images,
        image_url: purchase.imageUrl ?? images[0] ?? "",
        payment_mode: purchase.paymentMode,
        purchased_on: purchase.date,
        purchase_price: purchase.cost,
        title: purchase.name,
    };
}

export function buildPurchaseFormData(purchase) {
    const purchasePayload = toApiPurchase(purchase);
    const formData = new FormData();
    const existingPurchaseImages = normalizeImageUrls(purchase.images, purchase.imageUrl);

    const rawPurchaseImages = Array.isArray(purchase.images)
        ? purchase.images.filter((image) => image instanceof File)
        : [];

    const items = Array.isArray(purchasePayload.items)
        ? purchasePayload.items.map((item) => {
            const existingItemImages = Array.isArray(item.images)
                ? item.images.filter((image) => !(image instanceof File))
                : [];
            const itemImages = Array.isArray(item.images)
                ? item.images.filter((image) => image instanceof File)
                : [];

            return {
                ...item,
                images: [...existingItemImages, ...itemImages.map((image) => image.name)],
            };
        })
        : [];

    formData.append("purchase", JSON.stringify({
        ...purchasePayload,
        image_url: existingPurchaseImages[0] ?? rawPurchaseImages[0]?.name ?? "",
        images: [...existingPurchaseImages, ...rawPurchaseImages.map((image) => image.name)],
        items,
    }));

    rawPurchaseImages.forEach((image) => {
        formData.append("purchase_images", image);
    });

    purchasePayload.items.forEach((item, index) => {
        const itemImages = Array.isArray(item.images)
            ? item.images.filter((image) => image instanceof File)
            : [];

        itemImages.forEach((image) => {
            formData.append(`item_${index}_images`, image);
        });
    });

    return formData;
}

export async function fetchPurchases() {
    const response = await fetch("http://127.0.0.1:5000/purchases");

    if (!response.ok) { 
        throw new Error("Failed to fetch purchases");
    }

    const purchases = await response.json();
    return purchases.map(toFrontendPurchase);
}

export async function createPurchase(purchase) {
    const response = await fetch("http://127.0.0.1:5000/purchase", {
        method: "POST",
        body: buildPurchaseFormData(purchase),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create purchase");
    }

    return toFrontendPurchase(await response.json());
}

export async function updatePurchase(purchase) {
    const response = await fetch(`http://127.0.0.1:5000/purchases/${purchase.id}`, {
        method: "PUT",
        body: buildPurchaseFormData(purchase),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update purchase");
    }

    return toFrontendPurchase(await response.json());
}
