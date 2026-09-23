// Resolve ancestors within each purchase, regardless of the order returned by the API.
export function describeItems(items) {
  const byId = new Map(items.map((item) => [String(item.id), item]));
  return items.map((item) => {
    const ancestors = [];
    const seen = new Set([String(item.id)]);
    let parentId = item.parentId;
    while (parentId != null && !seen.has(String(parentId))) {
      seen.add(String(parentId));
      const parent = byId.get(String(parentId));
      if (!parent) {
        ancestors.unshift({ id: parentId, name: `Item #${parentId}` });
        break;
      }
      ancestors.unshift(parent);
      parentId = parent.parentId;
    }
    return { ...item, ancestors };
  });
}

export function filterPurchaseItems(purchase, items, query, status) {
  const searchTerm = query.trim().toLowerCase();
  return describeItems(items).filter((item) => {
    const sold = item.status === 'sold';
    const matchesStatus = status === 'all' || (status === 'sold' ? sold : !sold);
    const searchableText = [
      item.name,
      item.id,
      purchase.id,
      purchase.source,
      ...item.ancestors.map((parent) => parent.name),
    ]
      .join(' ')
      .toLowerCase();
    return matchesStatus && searchableText.includes(searchTerm);
  });
}

// The backend returns the complete purchase with authoritative item statuses.
export function applyPurchase(purchases, updatedPurchase) {
  const exists = purchases.some((group) => group.purchase.id === updatedPurchase.purchase.id);
  return exists
    ? purchases.map((group) =>
        group.purchase.id === updatedPurchase.purchase.id ? updatedPurchase : group,
      )
    : [...purchases, updatedPurchase];
}
