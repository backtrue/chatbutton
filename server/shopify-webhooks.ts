import type { Request, Response, NextFunction, Express } from 'express';
import crypto from 'crypto';
import { log } from './vite';

const HMAC_HEADER = 'x-shopify-hmac-sha256';

function getRawBody(req: Request): Buffer {
  const rawBody = (req as Request & { rawBody?: unknown }).rawBody;
  if (Buffer.isBuffer(rawBody)) {
    return rawBody;
  }

  if (typeof rawBody === 'string') {
    return Buffer.from(rawBody, 'utf8');
  }

  return Buffer.from(JSON.stringify(req.body ?? {}));
}

function verifyShopifyWebhook(req: Request): boolean {
  const hmacHeader = req.get(HMAC_HEADER);
  const secret = process.env.SHOPIFY_API_SECRET;

  if (!secret || !hmacHeader) {
    return false;
  }

  const rawBody = getRawBody(req);
  const generatedHmac = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('base64');

  try {
    return crypto.timingSafeEqual(
      Buffer.from(generatedHmac, 'utf8'),
      Buffer.from(hmacHeader, 'utf8'),
    );
  } catch (err) {
    return false;
  }
}

function shopifyWebhookMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!verifyShopifyWebhook(req)) {
    log('Rejected Shopify webhook due to invalid HMAC', 'shopify');
    return res.status(401).end();
  }

  return next();
}

function respondOk(res: Response) {
  res.status(200).json({ ok: true });
}

function registerComplianceEndpoints(app: Express) {
  app.post('/webhooks/customers/data_request', shopifyWebhookMiddleware, (req, res) => {
    log('Received customers/data_request compliance webhook', 'shopify');
    respondOk(res);
  });

  app.post('/webhooks/customers/redact', shopifyWebhookMiddleware, (req, res) => {
    log('Received customers/redact compliance webhook', 'shopify');
    respondOk(res);
  });

  app.post('/webhooks/shop/redact', shopifyWebhookMiddleware, (req, res) => {
    log('Received shop/redact compliance webhook', 'shopify');
    respondOk(res);
  });
}

export function registerShopifyComplianceWebhooks(app: Express) {
  registerComplianceEndpoints(app);
}
