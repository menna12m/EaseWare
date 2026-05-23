export function formatPrice(amount: number, currency: string = 'EGP'): string {
  // Medusa amounts come in minor units (piastres). Divide by 100 for EGP display.
  const major = amount / 100;
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(major);
}
