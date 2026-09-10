import test from 'node:test';
import assert from 'node:assert/strict';
import { describeItems, filterPurchaseItems, applyPurchase } from './inventoryData.js';
import { fetchInventory, createSale, refundSale } from '../../api/inventory.js';

test('resolves an unordered multi-level family without dropping standalone items', () => {
    const items = describeItems([
        { id: 5, name: 'Cooler', parentId: 4 },
        { id: 2, name: 'TV', parentId: null },
        { id: 4, name: 'GPU', parentId: 1 },
        { id: 1, name: 'PC', parentId: null },
    ]);
    assert.equal(items.length, 4);
    assert.deepEqual(items[0].ancestors.map(item => item.name), ['PC', 'GPU']);
    assert.deepEqual(items[1].ancestors, []);
});

test('handles missing ancestors and cycles without hanging or dropping items', () => {
    const items = describeItems([
        { id: 1, parentId: 2 }, { id: 2, parentId: 1 }, { id: 3, parentId: 99 },
    ]);
    assert.equal(items.length, 3);
    assert.equal(items[0].ancestors.length, 1);
    assert.equal(items[2].ancestors[0].name, 'Item #99');
});

test('fetches the specified endpoint and rejects server errors and malformed payloads', async context => {
    const payload = [{ purchase: { id: 1 }, items: [] }];
    const signal = new AbortController().signal;
    const mock = context.mock.method(globalThis, 'fetch', async (url, options) => {
        assert.equal(url, '/api/purchases');
        assert.equal(options.signal, signal);
        return { ok: true, json: async () => payload };
    });
    assert.deepEqual(await fetchInventory(signal), payload);
    mock.mock.mockImplementation(async () => ({ ok: false, json: async () => ({}) }));
    await assert.rejects(fetchInventory(), /could not be saved or loaded/);
    mock.mock.mockImplementation(async () => ({ ok: true, json: async () => ({ items: [] }) }));
    await assert.rejects(fetchInventory(), /unexpected response/);
});

test('filters direct and included sales using backend status', () => {
    const purchase = { id: 1, source: 'Shop' };
    const items = [
        { id: 1, name: 'PC', parentId: null, sale: null, status: 'available' },
        { id: 2, name: 'GPU', parentId: 1, sale: { itemId: 2, price: '0.00' }, status: 'sold' },
        { id: 3, name: 'Cooler', parentId: 2, sale: null, status: 'included', soldWithItemId: 2 },
    ];
    assert.deepEqual(filterPurchaseItems(purchase, items, 'PC', 'sold').map(item => item.id), [2, 3]);
    assert.deepEqual(filterPurchaseItems(purchase, items, '', 'available').map(item => item.id), [1]);
});

test('posts an exact decimal sale price and surfaces backend conflict messages', async context => {
    const sale = { itemId: 5, price: '125.25' };
    const updatedPurchase = { purchase: { id: 1 }, items: [{ id: 5, sale, status: 'sold' }] };
    const mock = context.mock.method(globalThis, 'fetch', async (url, options) => {
        assert.equal(url, '/api/sales');
        assert.equal(options.method, 'POST');
        assert.equal(options.headers['Content-Type'], 'application/json');
        assert.deepEqual(JSON.parse(options.body), sale);
        return { ok: true, json: async () => updatedPurchase };
    });
    assert.deepEqual(await createSale(5, '125.25'), updatedPurchase);
    mock.mock.mockImplementation(async () => ({ ok: false, json: async () => ({ detail: 'This item is already sold' }) }));
    await assert.rejects(createSale(5, '125.25'), /already sold/);
});

test('replaces a purchase with server-computed statuses without removing children', () => {
    const purchases = [
        { purchase: { id: 1 }, items: [{ id: 1 }, { id: 2 }] },
        { purchase: { id: 2 }, items: [{ id: 5 }] },
    ];
    const updatedPurchase = {
        purchase: { id: 1 },
        items: [
            { id: 1, status: 'sold', sale: { itemId: 1, price: '100.00' } },
            { id: 2, status: 'included', soldWithItemId: 1, sale: null },
        ],
    };
    const result = applyPurchase(purchases, updatedPurchase);
    assert.deepEqual(result[0], updatedPurchase);
    assert.equal(result[1], purchases[1]);
    assert.equal(purchases[0].items[0].status, undefined);
});


test('refund targets the sale ID and returns the updated purchase', async context => {
    const purchase = { purchase: { id: 1 }, items: [{ id: 5, sale: null, status: 'available' }] };
    context.mock.method(globalThis, 'fetch', async (url, options) => {
        assert.equal(url, '/api/sales/42/refund');
        assert.equal(options.method, 'POST');
        assert.equal(options.body, undefined);
        return { ok: true, json: async () => purchase };
    });
    assert.deepEqual(await refundSale(42), purchase);
});


test('sends the selected calendar sale date unchanged', async context => {
    const purchase = { purchase: { id: 1 }, items: [] };
    context.mock.method(globalThis, 'fetch', async (_url, options) => {
        assert.deepEqual(JSON.parse(options.body), { itemId: 5, price: '125.25', soldDate: '2025-12-31' });
        return { ok: true, json: async () => purchase };
    });
    assert.deepEqual(await createSale(5, '125.25', '2025-12-31'), purchase);
});
