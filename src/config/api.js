export function resolveApiBaseUrl(value = '/api') {
  const baseUrl = value.trim().replace(/\/+$/, '');
  const isRelativePath = /^\/(?!\/)[^?#\s\\]+$/.test(baseUrl);
  let isHttpUrl = false;
  try {
    const url = new URL(baseUrl);
    isHttpUrl =
      ['http:', 'https:'].includes(url.protocol) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash &&
      !/[\s\\]/.test(baseUrl);
  } catch {
    // Relative paths are supported for a same-origin API proxy.
  }
  if (!isRelativePath && !isHttpUrl) {
    throw new Error(
      'VITE_API_BASE_URL must be an HTTP(S) URL or a path such as /api, without credentials, query parameters, or a fragment.',
    );
  }
  return baseUrl;
}

// Vite supplies import.meta.env; Node-based tests use the development default.
export const API_BASE_URL = resolveApiBaseUrl(import.meta.env?.VITE_API_BASE_URL);

export const API_PATHS = {
  purchases: '/purchases',
  sales: '/sales',
  purchase: (id) => `/purchases/${id}`,
  item: (id) => `/items/${id}`,
};
