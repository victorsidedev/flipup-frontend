const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export function formatMoney(value) {
    return value != null && value !== '' && Number.isFinite(Number(value))
        ? currency.format(Number(value))
        : '—';
}

export function formatDate(value) {
    if (!value) return 'Date unavailable';
    return new Date(`${value.slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
    });
}
