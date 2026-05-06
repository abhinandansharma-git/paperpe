export const SUPPORT_EMAIL = 'hello@paperpe.in';
export const SUPPORT_WHATSAPP_NUMBER = '+91 99303 24251';

function normalizeText(value) {
  return String(value || '').trim().toLowerCase();
}

export function getOrderDeliveryType(order) {
  return order?.product?.file_url ? 'auto-download' : 'manual';
}

export function getOrderDeliveryStatus(order) {
  if (order?.status !== 'paid') {
    return 'awaiting-payment';
  }

  if (getOrderDeliveryType(order) === 'auto-download') {
    return 'available';
  }

  return order?.fulfillment_status === 'delivered' ? 'delivered' : 'pending';
}

export function filterOrdersForAdmin(orders, {
  query = '',
  paymentStatus = 'all',
  deliveryState = 'all',
} = {}) {
  const normalizedQuery = normalizeText(query);

  return (orders || []).filter((order) => {
    if (paymentStatus !== 'all' && order?.status !== paymentStatus) {
      return false;
    }

    const deliveryType = getOrderDeliveryType(order);
    const deliveryStatus = getOrderDeliveryStatus(order);

    if (deliveryState === 'manual-pending' && !(deliveryType === 'manual' && deliveryStatus === 'pending')) {
      return false;
    }

    if (deliveryState === 'manual-delivered' && !(deliveryType === 'manual' && deliveryStatus === 'delivered')) {
      return false;
    }

    if (deliveryState === 'auto-download' && deliveryType !== 'auto-download') {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      order?.id,
      order?.customer_email,
      order?.customer_phone,
      order?.user?.email,
      order?.user?.phone,
      order?.product?.name,
      order?.product?.slug,
    ].map(normalizeText).join(' ');

    return haystack.includes(normalizedQuery);
  });
}

export function normalizeWhatsAppNumber(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  if (!digits) {
    return null;
  }

  if (digits.length === 10) {
    return `91${digits}`;
  }

  if (digits.length === 11 && digits.startsWith('0')) {
    return `91${digits.slice(1)}`;
  }

  return digits;
}

export function buildOrderSupportMessage(order) {
  const productName = order?.product?.name || 'your PaperPe order';
  return `Hi! Your PaperPe order for ${productName} is confirmed. Order ID: ${order?.id}. Reply here if you need help with delivery.`;
}

export function buildOrderWhatsAppLink(order) {
  const normalizedNumber = normalizeWhatsAppNumber(order?.customer_phone || order?.user?.phone);
  if (!normalizedNumber) {
    return null;
  }

  return `https://wa.me/${normalizedNumber}?text=${encodeURIComponent(buildOrderSupportMessage(order))}`;
}

export function buildOrderMailtoLink(order, supportEmail = SUPPORT_EMAIL) {
  const targetEmail = order?.customer_email || order?.user?.email;
  if (!targetEmail) {
    return null;
  }

  const productName = order?.product?.name || 'your PaperPe order';
  const subject = `PaperPe order update: ${productName}`;
  const body = [
    'Hi,',
    '',
    `This is a quick update on your PaperPe order ${order?.id}.`,
    `Product: ${productName}`,
    '',
    'If you need anything, reply to this email or message us on WhatsApp.',
    '',
    supportEmail,
  ].join('\n');

  return `mailto:${targetEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function escapeCsvCell(value) {
  const stringValue = String(value ?? '');
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function buildOrdersCsv(orders) {
  const header = [
    'order_id',
    'created_at',
    'product_slug',
    'product_name',
    'amount',
    'payment_status',
    'delivery_type',
    'delivery_status',
    'customer_email',
    'customer_phone',
  ];

  const rows = (orders || []).map((order) => [
    order?.id,
    order?.created_at,
    order?.product?.slug,
    order?.product?.name,
    order?.amount,
    order?.status,
    getOrderDeliveryType(order),
    getOrderDeliveryStatus(order),
    order?.customer_email || order?.user?.email,
    order?.customer_phone || order?.user?.phone,
  ]);

  return [
    header.join(','),
    ...rows.map((row) => row.map(escapeCsvCell).join(',')),
  ].join('\n');
}
