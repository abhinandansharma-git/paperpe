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
import {
  buildOrdersCsv,
  buildOrderWhatsAppLink,
  filterOrdersForAdmin,
} from '../lib/admin/fulfillment.js';

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
    phone: '+919999999999',
  });

  assert.deepEqual(record, {
    user_id: 'user_123',
    product_id: 'product_123',
    amount: 2999,
    razorpay_order_id: 'order_123',
    razorpay_payment_id: 'pay_123',
    status: 'paid',
    customer_email: 'abhi@paperpe.in',
    customer_phone: '+919999999999',
    fulfillment_status: 'pending',
  });
});

run('relative storage paths are treated as private storage objects', () => {
  assert.equal(isStoragePath('indicators/product/file.pine'), true);
});

run('absolute urls are not treated as storage paths', () => {
  assert.equal(isStoragePath('https://example.com/download.pine'), false);
});

run('admin order filter narrows to the manual fulfillment queue and matches search text', () => {
  const orders = [
    {
      id: 'order_auto',
      status: 'paid',
      fulfillment_status: 'pending',
      customer_email: 'auto@paperpe.in',
      customer_phone: '+91 9000000001',
      product: { name: 'ARIA SUPREME Indicator', file_url: 'indicators/aria/file.pine' },
    },
    {
      id: 'order_manual_pending',
      status: 'paid',
      fulfillment_status: 'pending',
      customer_email: 'manual@paperpe.in',
      customer_phone: '+91 9000000002',
      product: { name: 'Fear & Greed Meter', file_url: null },
    },
    {
      id: 'order_manual_delivered',
      status: 'paid',
      fulfillment_status: 'delivered',
      customer_email: 'delivered@paperpe.in',
      customer_phone: '+91 9000000003',
      product: { name: 'OI Pulse', file_url: null },
    },
  ];

  const filtered = filterOrdersForAdmin(orders, {
    query: 'fear',
    paymentStatus: 'paid',
    deliveryState: 'manual-pending',
  });

  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].id, 'order_manual_pending');
});

run('whatsapp links normalize phone numbers and include the order context', () => {
  const link = buildOrderWhatsAppLink({
    id: 'ord_123456',
    customer_phone: '98765 43210',
    product: { name: 'Fear & Greed Meter', file_url: null },
  });

  assert.equal(
    link,
    'https://wa.me/919876543210?text=Hi!%20Your%20PaperPe%20order%20for%20Fear%20%26%20Greed%20Meter%20is%20confirmed.%20Order%20ID%3A%20ord_123456.%20Reply%20here%20if%20you%20need%20help%20with%20delivery.'
  );
});

run('csv export includes delivery details for manual and auto orders', () => {
  const csv = buildOrdersCsv([
    {
      id: 'ord_manual',
      created_at: '2026-05-04T10:30:00.000Z',
      amount: 499,
      status: 'paid',
      fulfillment_status: 'pending',
      customer_email: 'manual@paperpe.in',
      customer_phone: '+91 9000000002',
      product: { name: 'Fear & Greed Meter', slug: 'fear-greed', file_url: null },
    },
    {
      id: 'ord_auto',
      created_at: '2026-05-04T11:00:00.000Z',
      amount: 2999,
      status: 'paid',
      fulfillment_status: 'pending',
      customer_email: 'auto@paperpe.in',
      customer_phone: '+91 9000000001',
      product: { name: 'ARIA SUPREME Indicator', slug: 'aria-supreme', file_url: 'indicators/aria/file.pine' },
    },
  ]);

  assert.match(csv, /^order_id,created_at,product_slug,product_name,amount,payment_status,delivery_type,delivery_status,customer_email,customer_phone$/m);
  assert.match(csv, /^ord_manual,2026-05-04T10:30:00.000Z,fear-greed,Fear & Greed Meter,499,paid,manual,pending,manual@paperpe.in,\+91 9000000002$/m);
  assert.match(csv, /^ord_auto,2026-05-04T11:00:00.000Z,aria-supreme,ARIA SUPREME Indicator,2999,paid,auto-download,available,auto@paperpe.in,\+91 9000000001$/m);
});

console.log('All commerce tests passed.');
