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
