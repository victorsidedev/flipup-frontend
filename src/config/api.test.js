import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveApiBaseUrl } from './api.js';

test('API bases support the development proxy and environment-specific backend prefixes', () => {
  assert.equal(resolveApiBaseUrl(), '/api');
  assert.equal(resolveApiBaseUrl('/api/v1/'), '/api/v1');
  assert.equal(
    resolveApiBaseUrl(' https://backend.example.com/api/ '),
    'https://backend.example.com/api',
  );
  assert.equal(resolveApiBaseUrl('http://localhost:8000/'), 'http://localhost:8000');
});

test('invalid API configuration fails before requests can target the wrong endpoint', () => {
  for (const value of [
    '',
    ' ',
    '/',
    'backend.example.com',
    '//backend.example.com',
    'ftp://backend.example.com',
    'https://user:password@backend.example.com',
    'https://backend.example.com?key=value',
    '/api#fragment',
    '/api?key=value',
  ]) {
    assert.throws(() => resolveApiBaseUrl(value), /VITE_API_BASE_URL/);
  }
});
