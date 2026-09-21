import { useEffect, useState } from 'react';
import { fetchInventory } from '../../../api/inventory.js';
import { applyPurchase } from '../inventoryData.js';

export default function useInventory() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [request, setRequest] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchInventory(controller.signal)
      .then((data) => {
        if (controller.signal.aborted) return;
        setPurchases(data);
        setLoading(false);
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setError(error.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [request]);

  function refresh() {
    setLoading(true);
    setError('');
    setRequest((value) => value + 1);
  }

  function updatePurchase(purchase) {
    setPurchases((groups) => applyPurchase(groups, purchase));
  }

  function removePurchase(id) {
    setPurchases((groups) => groups.filter((group) => group.purchase.id !== id));
  }

  return { purchases, loading, error, refresh, updatePurchase, removePurchase };
}
