import { normalizeImageUrls } from "../../utils/imageUrls.js";

export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export { normalizeImageUrls as normalizeImages } from "../../utils/imageUrls.js";

export function validateImageFiles(files = []) {
    const errors = [];

    Array.from(files).forEach((file, index) => {
        if (!(file instanceof File)) {
            errors.push(`Selected file ${index + 1} is not valid.`);
            return;
        }

        if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
            errors.push(`Image ${index + 1} must be JPG, PNG, or WebP.`);
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
            errors.push(`Image ${index + 1} must be 10 MB or smaller.`);
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function removeImageAt(images = [], index) {
    return images.filter((_, currentIndex) => currentIndex !== index);
}

export function getPrimaryImage(purchase = {}) {
    return normalizeImageUrls(purchase.images, purchase.imageUrl)[0] ?? null;
}

export function getImageBadgeCount(purchase = {}) {
    return Math.max(0, normalizeImageUrls(purchase.images, purchase.imageUrl).length - 1);
}

export function getImageSummaryLabel(count = 0) {
    if (count === 0) {
        return "No images added";
    }

    if (count === 1) {
        return "1 image added";
    }

    return `${count} images added`;
}

export function getItemSummaryLabel(count = 0) {
    if (count === 0) {
        return "No items added";
    }

    if (count === 1) {
        return "1 item added";
    }

    return `${count} items added`;
}

export function getItemImageSrc(image) {
    if (!image) return "";
    if (image instanceof File) {
        return URL.createObjectURL(image);
    }
    if (typeof image === "string") {
        if (image.startsWith("http://") || image.startsWith("https://") || image.startsWith("data:") || image.startsWith("blob:")) {
            return image;
        }
        return `http://127.0.0.1:5000/${image.replace(/^\//, "")}`;
    }
    if (typeof image === "object" && image !== null) {
        const path = image.path || image.url || image.filename || image.src || "";
        if (!path) return "";
        if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:") || path.startsWith("blob:")) {
            return path;
        }
        return `http://127.0.0.1:5000/${path.replace(/^\//, "")}`;
    }
    return "";
}
