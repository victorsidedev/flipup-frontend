import test from 'node:test';
import assert from 'node:assert/strict';
import { purchasePayload, subtreeIds } from './purchaseDraft.js';
import { requestJson } from '../../api/client.js';

test('deleting a draft parent includes all descendants, preserves siblings, and handles cycles', () => {
  const items = [
    { id: 1, parentId: null },
    { id: 'draft', parentId: 1 },
    { id: 'nested', parentId: 'draft' },
    { id: 2, parentId: null },
  ];
  assert.deepEqual([...subtreeIds(items, 1)], [1, 'draft', 'nested']);
  assert.deepEqual(
    [
      ...subtreeIds(
        [
          { id: 1, parentId: 2 },
          { id: 2, parentId: 1 },
        ],
        1,
      ),
    ],
    [1, 2],
  );
});

test('save payload preserves persistent IDs and exact prices while identifying new items', () => {
  const payload = purchasePayload({ source: 'Shop', purchaseDate: '' }, [
    { id: 1, name: 'PC', price: '100.25', parentId: null, status: 'sold' },
    { id: 'draft', name: 'GPU', price: '', parentId: 1 },
  ]);
  assert.deepEqual(payload, {
    purchase: { source: 'Shop', purchaseDate: null },
    items: [
      { id: '1', itemId: 1, name: 'PC', price: '100.25', parentId: null },
      { id: 'draft', itemId: null, name: 'GPU', price: null, parentId: '1' },
    ],
  });
});

test('successful deletion accepts an empty 204 response', async (context) => {
  context.mock.method(globalThis, 'fetch', async () => ({ ok: true, status: 204 }));
  assert.equal(await requestJson('/purchases/1', { method: 'DELETE' }), null);
});
