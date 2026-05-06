const PRODUCT_CATALOG = Object.freeze({
  'early-bird': { name: 'Early Bird Lifetime Access', price: 499 },
  'aria-supreme': { name: 'ARIA SUPREME Indicator', price: 2999 },
  'oi-pulse': { name: 'OI Pulse Indicator', price: 999 },
  'fear-greed': { name: 'Fear & Greed Meter', price: 499 },
  'smart-sr': { name: 'Smart S/R Levels', price: 999 },
  'complete-bundle': { name: 'Complete Indicator Bundle', price: 3999 },
});

const PRODUCT_ALIASES = Object.freeze({
  bundle: 'complete-bundle',
});

export function canonicalizeProductId(productId) {
  if (typeof productId !== 'string') {
    return '';
  }

  return PRODUCT_ALIASES[productId] || productId;
}

export function getProductCatalogEntry(productId) {
  const canonicalId = canonicalizeProductId(productId);
  const product = PRODUCT_CATALOG[canonicalId];

  if (!product) {
    return null;
  }

  return {
    canonicalId,
    name: product.name,
    price: product.price,
  };
}
