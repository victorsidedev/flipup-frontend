export function normalizeImageUrls(value, fallbackValue) {
    const images = Array.isArray(value)
        ? value.filter((image) => typeof image === "string" && image.trim().length > 0)
        : [];

    if (images.length > 0) {
        return images;
    }

    if (typeof fallbackValue === "string" && fallbackValue.trim().length > 0) {
        return [fallbackValue];
    }

    return [];
}
