export const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export function normalizeImages(value, fallbackValue) {
    const rawImages = Array.isArray(value) ? value : [];
    const normalized = rawImages.filter(
        (image) => typeof image === "string" && image.trim().length > 0,
    );

    if (normalized.length > 0) {
        return normalized;
    }

    if (typeof fallbackValue === "string" && fallbackValue.trim().length > 0) {
        return [fallbackValue];
    }

    return [];
}

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
    return normalizeImages(purchase.images, purchase.imageUrl)[0] ?? null;
}

export function getImageBadgeCount(purchase = {}) {
    return Math.max(0, normalizeImages(purchase.images, purchase.imageUrl).length - 1);
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

export function readFilesAsDataUrls(files = []) {
    return Promise.all(
        Array.from(files).map(
            (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();

                reader.onload = () => resolve(String(reader.result));
                reader.onerror = () => reject(new Error(`Could not read file ${file.name}`));
                reader.readAsDataURL(file);
            }),
        ),
    );
}
