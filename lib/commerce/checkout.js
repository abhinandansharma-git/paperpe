import { canonicalizeProductId } from './catalog.js';

/**
 * @param {{
 *   response: Record<string, unknown>,
 *   email: string | undefined,
 *   phone?: string | undefined,
 *   productId: string,
 *   productName: string,
 *   userId: string | undefined,
 *   amount: number,
 * }} params
 */
export function buildPaymentVerifyPayload({
  response,
  email,
  phone = undefined,
  productId,
  productName,
  userId,
  amount,
}) {
  return {
    ...response,
    email,
    phone,
    productId: canonicalizeProductId(productId),
    productName,
    userId,
    amount,
  };
}

/**
 * @param {{
 *   userId: string | undefined,
 *   productId: string | null | undefined,
 *   amount: number,
 *   razorpayOrderId: string,
 *   razorpayPaymentId: string,
 *   email: string | undefined,
 *   phone?: string | undefined,
 * }} params
 */
export function buildVerifiedOrderInsert({
  userId,
  productId,
  amount,
  razorpayOrderId,
  razorpayPaymentId,
  email,
  phone = undefined,
}) {
  return {
    user_id: userId || null,
    product_id: productId || null,
    amount,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    status: 'paid',
    customer_email: email || null,
    customer_phone: phone || null,
    fulfillment_status: 'pending',
  };
}
