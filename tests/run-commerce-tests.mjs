import assert from 'node:assert/strict';

import {
  canonicalizeProductId,
  getProductCatalogEntry,
} from '../lib/commerce/catalog.js';
import {
  buildPaymentVerifyPayload,
  buildVerifiedOrderInsert,
} from '../lib/commerce/checkout.js';
import { isStoragePath } from '../lib/commerce/storage.js';

function run(name, fn) {
  try {
    fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    console.error(`FAIL ${name}`);
    throw error;
  }
}

run('bundle alias resolves to the canonical complete-bundle product', () => {
  const product = getProductCatalogEntry('bundle');

  assert.equal(canonicalizeProductId('bundle'), 'complete-bundle');
  assert.deepEqual(product, {
    canonicalId: 'complete-bundle',
    name: 'Complete Indicator Bundle',
    price: 3999,
  });
});

run('known indicator product returns its price and name', () => {
  assert.deepEqual(getProductCatalogEntry('aria-supreme'), {
    canonicalId: 'aria-supreme',
    name: 'ARIA SUPREME Indicator',
    price: 2999,
  });
});

run('unknown product returns null', () => {
  assert.equal(getProductCatalogEntry('not-a-product'), null);
});

run('payment verify payload keeps ownership and amount fields intact', () => {
  const payload = buildPaymentVerifyPayload({
    response: {
      razorpay_order_id: 'order_123',
      razorpay_payment_id: 'pay_123',
      razorpay_signature: 'sig_123',
    },
    email: 'abhi@paperpe.in',
    phone: '+919999999999',
    productId: 'aria-supreme',
    productName: 'ARIA SUPREME Indicator',
    userId: 'user_123',
    amount: 2999,
  });

  assert.deepEqual(payload, {
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123',
    razorpay_signature: 'sig_123',
    email: 'abhi@paperpe.in',
    phone: '+919999999999',
    productId: 'aria-supreme',
    productName: 'ARIA SUPREME Indicator',
    userId: 'user_123',
    amount: 2999,
  });
});

run('verified orders target the customer_email column expected by Supabase', () => {
  const record = buildVerifiedOrderInsert({
    userId: 'user_123',
    productId: 'product_123',
    amount: 2999,
    razorpayOrderId: 'order_123',
    razorpayPaymentId: 'pay_123',
    email: 'abhi@paperpe.in',
  });

  assert.deepEqual(record, {
    user_id: 'user_123',
    product_id: 'product_123',
    amount: 2999,
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123',
    status: 'paid',
    customer_email: 'abhi@paperpe.in',
  });
});

run('relative storage paths are treated as private storage objects', () => {
  assert.equal(isStoragePath('indicators/product/file.pine'), true);
});

run('absolute urls are not treated as storage paths', () => {
  assert.equal(isStoragePath('https://example.com/download.pine'), false);
});

console.log('All commerce tests passed.');
