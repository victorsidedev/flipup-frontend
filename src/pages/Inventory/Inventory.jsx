import { useState } from 'react';
import { Alert, Box, Button, CircularProgress, Stack } from '@mui/material';
import AddPurchaseButton from './components/AddPurchaseButton.jsx';
import InventoryEmpty from './components/InventoryEmpty.jsx';
import InventoryToolbar from './components/InventoryToolbar.jsx';
import PurchaseGroup from './components/PurchaseGroup.jsx';
import SaleDialog from '../../components/ui/SaleDialog.jsx';
import PurchasePopup from '../../components/ui/PurchasePopup.jsx';
import useInventory from './hooks/useInventory.js';
import { filterPurchaseItems } from './inventoryData.js';

export default function Inventory() {
    const { purchases, loading, error, refresh, updatePurchase, removePurchase } = useInventory();
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    const [saleItem, setSaleItem] = useState(null);
    const [notice, setNotice] = useState('');
    const [editor, setEditor] = useState(null);
    const [saleDraft, setSaleDraft] = useState(null);

    const allItems = purchases.flatMap((group) => group.items);
    const soldCount = allItems.filter((item) => item.status === 'sold').length;
    const groups = purchases
        .map(({ purchase, items }) => ({
            purchase,
            total: items.length,
            items: filterPurchaseItems(purchase, items, query, status),
        }))
        .filter(
            (group) => group.items.length > 0 || (group.total === 0 && !query.trim() && status === 'all'),
        );

    function handleSaleSaved(purchase) {
        updatePurchase(purchase);
        setNotice(`Sale recorded for ${saleItem.name}.`);
        setSaleItem(null);
    }

    function toggleItemInDraft(item) {
        const existingItems = saleDraft ? saleDraft.items : [];
        const exists = existingItems.some((draftItem) => draftItem.id === item.id);
        setSaleDraft({
            ...saleDraft,
            items: exists
                ? existingItems.filter((draftItem) => draftItem.id !== item.id)
                : [...existingItems, item],
        });
    }

    function updateItemInDraft(itemId, updatedFields) {
        if (!saleDraft) return;
        setSaleDraft({
            ...saleDraft,
            items: saleDraft.items.map((selectedItem) =>
                selectedItem.id === itemId ? { ...selectedItem, ...updatedFields } : selectedItem,
            ),
        });
    }

    function removeItemFromDraft(itemId) {
        console.log(itemId);
        if (!saleDraft) return;
        setSaleDraft({
            ...saleDraft,
            items: saleDraft.items.filter((draftItem) => draftItem.id !== itemId),
        });
    }

    function clearFilters() {
        setQuery('');
        setStatus('all');
    }

    return (
        <Box sx={{ maxWidth: 1440, mx: 'auto', minWidth: 0, pb: 10 }}>
            <InventoryToolbar
                total={allItems.length}
                sold={soldCount}
                query={query}
                status={status}
                onQueryChange={setQuery}
                onStatusChange={setStatus}
                onRefresh={refresh}
                loading={loading}
            />
            <Box
                role="status"
                aria-live="polite"
            >
                {notice && (
                    <Alert
                        severity="success"
                        onClose={() => setNotice('')}
                        sx={{ mb: 2 }}
                    >
                        {notice}
                    </Alert>
                )}
            </Box>
            {loading && (
                <Stack
                    role="status"
                    direction="row"
                    sx={{ gap: 2, alignItems: 'center', py: 4 }}
                >
                    <CircularProgress size={24} />
                    Loading inventory…
                </Stack>
            )}
            {!loading && error && (
                <Alert
                    severity="error"
                    action={<Button onClick={refresh}>Retry</Button>}
                >
                    {error}
                </Alert>
            )}
            {!loading &&
                !error &&
                (groups.length > 0 ? (
                    groups.map((group) => (
                        <PurchaseGroup
                            key={group.purchase.id}
                            saleDraft={saleDraft}
                            {...group}
                            onSell={setSaleItem}
                            onOpen={(purchaseId, itemId) => setEditor({ purchaseId, itemId })}
                            onItemToggle={toggleItemInDraft}
                        />
                    ))
                ) : (
                    <InventoryEmpty
                        hasItems={allItems.length > 0}
                        onClear={clearFilters}
                    />
                ))}
            <AddPurchaseButton onClick={() => setEditor({ purchaseId: null, itemId: null })} />
            {saleDraft?.items?.length > 0 && <Button onClick={() => setSaleItem(saleItem)}> Record Sales </Button>}
            {editor && (
                <PurchasePopup
                    key={editor.purchaseId ?? 'new'}
                    open
                    toggleOpen={() => setEditor(null)}
                    purchaseDetails={purchases.find((group) => group.purchase.id === editor.purchaseId)}
                    selectedItemId={editor.itemId}
                    onSaved={updatePurchase}
                    onDeleted={removePurchase}
                />
            )}
            {saleItem && (
                <SaleDialog
                    item={saleItem}
                    items={allItems}
                    saleDraft={saleDraft}
                    onDeleteSelectedItem={removeItemFromDraft}
                    onUpdateSelectedItem={updateItemInDraft}
                    onClose={() => setSaleItem(null)}
                    onSaved={handleSaleSaved}
                />
            )}
        </Box>
    );
}
