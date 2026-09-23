export const newItem = (parentId = null) => ({
  id: crypto.randomUUID(),
  name: '',
  price: '',
  parentId,
});
export const isSavedItem = (item) => typeof item.id === 'number';

export function purchasePayload(purchase, items) {
  return {
    purchase: { source: purchase.source, purchaseDate: purchase.purchaseDate || null },
    items: items.map((item) => ({
      id: String(item.id),
      itemId: isSavedItem(item) ? item.id : null,
      name: item.name,
      price: item.price === '' ? null : item.price,
      parentId: item.parentId == null ? null : String(item.parentId),
    })),
  };
}

export function subtreeIds(items, rootId) {
  const result = new Set([rootId]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const item of items) {
      if (result.has(item.parentId) && !result.has(item.id)) {
        result.add(item.id);
        changed = true;
      }
    }
  }
  return result;
}
