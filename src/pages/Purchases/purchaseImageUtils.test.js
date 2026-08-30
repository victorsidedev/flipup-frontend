import test from "node:test";
import assert from "node:assert/strict";

import {
  MAX_IMAGE_SIZE_BYTES,
  ACCEPTED_IMAGE_TYPES,
  normalizeImages,
  validateImageFiles,
  removeImageAt,
  getPrimaryImage,
  getImageBadgeCount,
  getImageSummaryLabel,
} from "./purchaseImageUtils.js";
import { buildPurchaseFormData } from "../../api/purchases.js";

test("no images returns an empty list", () => {
  assert.deepEqual(normalizeImages([]), []);
  assert.deepEqual(normalizeImages(null), []);
});

test("one image is preserved and the first image remains primary", () => {
  const images = normalizeImages(["/images/purchase-1.jpg"]);

  assert.deepEqual(images, ["/images/purchase-1.jpg"]);
  assert.equal(getPrimaryImage({ images }), "/images/purchase-1.jpg");
  assert.equal(getImageSummaryLabel(1), "1 image added");
});

test("multiple images are kept in order and badge count is derived from extras", () => {
  const images = normalizeImages(["/images/purchase-1.jpg", "/images/purchase-2.jpg", "/images/purchase-3.jpg"]);

  assert.deepEqual(images, ["/images/purchase-1.jpg", "/images/purchase-2.jpg", "/images/purchase-3.jpg"]);
  assert.equal(getImageBadgeCount({ images }), 2);
  assert.equal(getImageSummaryLabel(3), "3 images added");
});

test("removing an image before save updates the remaining list", () => {
  const images = removeImageAt(["/images/purchase-1.jpg", "/images/purchase-2.jpg"], 0);

  assert.deepEqual(images, ["/images/purchase-2.jpg"]);
  assert.equal(getPrimaryImage({ images }), "/images/purchase-2.jpg");
});

test("validation rejects unsupported file types and oversized files", () => {
  const valid = validateImageFiles([
    new File(["ok"], "ok.png", { type: "image/png" }),
  ]);
  const invalid = validateImageFiles([
    new File(["bad"], "bad.txt", { type: "text/plain" }),
    new File([new Uint8Array(MAX_IMAGE_SIZE_BYTES + 1)], "large.webp", { type: "image/webp" }),
  ]);

  assert.equal(valid.valid, true);
  assert.equal(ACCEPTED_IMAGE_TYPES.has("image/png"), true);
  assert.equal(invalid.valid, false);
  assert.match(invalid.errors.join(" "), /JPG, PNG, or WebP|10 MB or smaller/);
});

test("saved-card indicator uses the image count from the remaining images", () => {
  assert.equal(getImageBadgeCount({ images: ["/images/purchase-1.jpg"] }), 0);
  assert.equal(getImageBadgeCount({ images: ["/images/purchase-1.jpg", "/images/purchase-2.jpg", "/images/purchase-3.jpg"] }), 2);
  assert.equal(getImageBadgeCount({ imageUrl: "/images/legacy.jpg" }), 0);
});

test("purchase create form-data uses the multipart contract and item image keys follow array position", () => {
  const purchaseImage = new File(["purchase"], "purchase.png", { type: "image/png" });
  const itemZeroImage = new File(["zero"], "zero.png", { type: "image/png" });
  const itemOneImageA = new File(["one-a"], "one-a.png", { type: "image/png" });
  const itemOneImageB = new File(["one-b"], "one-b.png", { type: "image/png" });

  const formData = buildPurchaseFormData({
    name: "Desk",
    images: [purchaseImage],
    items: [
      { name: "Mouse", images: [itemZeroImage] },
      { name: "Keyboard", images: [itemOneImageA, itemOneImageB] },
    ],
  });

  const purchaseJson = JSON.parse(formData.get("purchase"));

  assert.equal(formData.getAll("purchase_images").length, 1);
  assert.equal(formData.getAll("item_0_images").length, 1);
  assert.equal(formData.getAll("item_1_images").length, 2);
  assert.deepEqual(purchaseJson.items.map((item) => item.name), ["Mouse", "Keyboard"]);
  assert.equal(formData.getAll("item_0_images")[0].name, "zero.png");
  assert.equal(formData.getAll("item_1_images")[0].name, "one-a.png");
  assert.equal(formData.getAll("item_1_images")[1].name, "one-b.png");
});

test("item image keys follow the current item ordering after reordering and removal", () => {
  const imageA = new File(["a"], "a.png", { type: "image/png" });
  const imageC = new File(["c"], "c.png", { type: "image/png" });

  const formData = buildPurchaseFormData({
    items: [
      { name: "Item 3", images: [imageC] },
      { name: "Item 1", images: [imageA] },
    ],
  });

  const purchaseJson = JSON.parse(formData.get("purchase"));

  assert.deepEqual(purchaseJson.items.map((item) => item.name), ["Item 3", "Item 1"]);
  assert.equal(formData.getAll("item_0_images")[0].name, "c.png");
  assert.equal(formData.getAll("item_1_images")[0].name, "a.png");
  assert.equal(formData.getAll("item_0_images").length, 1);
  assert.equal(formData.getAll("item_1_images").length, 1);
});
