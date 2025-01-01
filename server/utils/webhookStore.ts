export interface WebhookEntry {
  id: number;
  timestamp: string;
  eventType: string;
  payload: any;
  status: 'success' | 'failed';
  error?: string;
}

export class WebhookStore {
  private static instance: WebhookStore;
  private webhooks: WebhookEntry[] = [];
  private readonly maxEntries = 100;

  private constructor() {}

  static getInstance(): WebhookStore {
    if (!WebhookStore.instance) {
      WebhookStore.instance = new WebhookStore();
    }
    return WebhookStore.instance;
  }

  addWebhook(webhook: WebhookEntry): void {
    this.webhooks.unshift(webhook);
    
    // Keep only the latest entries
    if (this.webhooks.length > this.maxEntries) {
      this.webhooks = this.webhooks.slice(0, this.maxEntries);
    }
  }

  getWebhooks(): WebhookEntry[] {
    return [...this.webhooks];
  }

  clearWebhooks(): void {
    this.webhooks = [];
  }
}