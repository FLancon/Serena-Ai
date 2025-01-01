import { createHmac } from 'crypto';

export function validateWebhookSignature(payload: any, signature?: string): boolean {
  if (!signature) {
    return false;
  }

  const config = useRuntimeConfig();
  const webhookSecret = config.BEDS24_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.warn('Webhook secret not configured - skipping signature validation');
    return true;
  }

  const hmac = createHmac('sha256', webhookSecret);
  const calculatedSignature = hmac
    .update(JSON.stringify(payload))
    .digest('hex');

  return signature === calculatedSignature;
}