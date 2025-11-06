---
title: Deliver webhooks through HTTPS
description: >-
  HTTPS delivery requires far more work to prepare for production. Here are key
  considerations when working with this delivery method.
source_url:
  html: 'https://shopify.dev/docs/apps/build/webhooks/subscribe/https'
  md: 'https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md'
---

ExpandOn this page

* [Step 1: Notify Shopify that your app is receiving webhooks](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-1-notify-shopify-that-your-app-is-receiving-webhooks)
* [Step 2: Validate the origin of your webhook to ensure it's coming from Shopify](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-2-validate-the-origin-of-your-webhook-to-ensure-its-coming-from-shopify)
* [Step 3: Queue your webhooks to process later in case of bursts of traffic](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-3-queue-your-webhooks-to-process-later-in-case-of-bursts-of-traffic)

# Deliver webhooks through HTTPS

You might want to use HTTPS rather than a cloud-based event bus due to infrastructure requirements, where your domain knowledge lies, budget constraints, or because you want full control to customize your webhooks system. This approach will require additional steps, however, to ensure your system is production-ready and can handle receiving Shopify webhooks at scale. Shopify recommends using cloud-based event buses whenever possible to minimize this overhead.

### What you'll learn

1. Notify Shopify that your app is receiving webhooks
2. Validate the origin of each webhook
3. Prepare your system to handle occasional bursts of webhook traffic

### Requirements

* An app with webhook subscriptions configured using HTTPS delivery
* Ensure your server is correctly configured to support HTTPS with a valid SSL certificate.

Shopify sends an HTTP POST request to the URI you have specified every time that event occurs. The HTTP `POST` request's parameters contain the JSON data relevant to the event that triggered the request. Shopify verifies SSL certificates when delivering payloads to HTTPS webhook addresses.

Info

You might want to use your app URL as the endpoint for webhook subscriptions during development. This URL has your CloudFlare tunnel path as an input, which will change after each time you run `shopify app dev`.

In this case, leverage Shopify's support of relative paths for the URI: `uri = "/webhooks"`

***

## Step 1: Notify Shopify that your app is receiving webhooks

### Respond with a 200 OK, quickly

Your system acknowledges that it received webhooks by sending Shopify a `200 OK` response. Any response outside of the 200 range, including 3XX HTTP redirection codes, indicates that you didn't receive the webhook. Shopify will consider these codes to be an error response.

Because Shopify has a connection timeout of one second, your server must accept connections within one second.

Note

There is a five-second timeout for the entire request: Shopify expects to establish the connection and receive your response in less than five seconds or the request times out.

### Manage your connection to optimize your system

Shopify's webhook delivery system uses [HTTP Keep-Alive](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Keep-Alive) to reuse connections to the same host and endpoint. This reduces network congestion and the latency in subsequent requests. Ensure that you have Keep-Alive enabled for your endpoint to reduce the overhead of receiving concurrent requests.

### Consider building a reconciliation job if you can't afford to miss webhooks

In instances where you can't provide a response in less than five seconds, Shopify recommends queuing your webhooks. Your queue should be persistent. Common practice here is also to build a reconciliation job that retrieves the data that is important for you, and you might have missed, periodically using our APIs.

### Shopify will always try to re-deliver your webhooks even if they are failing

Shopify waits five seconds for a response to each request to a webhook. If there's no response, or an error is returned, then Shopify retries the connection 8 times over the next 4 hours. If there are 8 consecutive failures, then the webhook subscription is automatically deleted if it was configured using the Admin API.

Warning emails that the subscription is failing, and could be deleted, are sent to the app's emergency developer email address. This is the email address that was used to create your Partner account.

You can learn more about troubleshooting your webhooks in the [Troubleshoot your webhooks guide here](https://shopify.dev/docs/apps/build/webhooks/troubleshooting-webhooks).

***

## Step 2: Validate the origin of your webhook to ensure it's coming from Shopify

Before you respond to a webhook, you need to verify that the webhook was sent from Shopify. You can verify the webhook by calculating a digital signature.

[ShopifyApp](https://shopify.dev/docs/api/shopify-app-react-router/latest/entrypoints/shopifyapp) abstracts this from you with the [authenticate](https://shopify.dev/docs/api/shopify-app-react-router/latest/authenticate/webhook) method, which also validates the origin.

If you use the default [React Router template](https://shopify.dev/docs/api/shopify-app-react-router/latest/guide-webhooks#endpoints), then this is already prepared for you right before processing the webhook with the following line:

```javascript
const {topic, shop, session} = await authenticate.webhook(request);
```

If you just want to validate, then you can make the call yourself. Each webhook includes a [base64-encoded](https://tools.ietf.org/html/rfc4648#section-4) `X-Shopify-Hmac-SHA256` field in the payload header, which is generated using the app's client secret along with the data sent in the request.

Note

If you're using PHP, or a Rack-based framework such as Ruby on Rails or Sinatra, then the header is `HTTP_X_SHOPIFY_HMAC_SHA256`.

To validate the webhook's origin manually, calculate and compare the HMAC digest according to the following algorithm.

## Compute HMAC digest

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();


// Warning: Never store your app's client secret key in plaintext in production environments.
// This is for demonstration purposes only.
const appClientSecret = '***PUT IN YOUR APP'S CLIENT SECRET***';


app.use(express.raw({ type: '*/*' }));


app.post('*', (req, res) => {
  const shopifyHmac = req.headers['x-shopify-hmac-sha256'];
  const calculatedHmacDigest = crypto.createHmac('sha256', appClientSecret).update(req.body).digest('base64');
  const hmacValid = crypto.timingSafeEqual(Buffer.from(calculatedHmacDigest, 'base64'), Buffer.from(shopifyHmac, 'base64'));


  if (hmacValid) {
    res.send('HMAC validation successful.');
  } else {
    res.status(401).send('HMAC validation failed.');
  }
});
```

This algorithm compares the computed value to the value in the `X-Shopify-Hmac-SHA256` header. If the HMAC digest and header value match, then the webhook was sent from Shopify.

Or use the [ShopifyApp library](https://shopify.dev/docs/api/shopify-app-react-router/latest/entrypoints/shopifyapp) to handle header processing, stringifying, and payload parsing.

## Validate HMAC digest

```javascript
app.post('/webhooks', express.text({type: '*/*'}), async (req, res) => {
  const {valid, topic, domain} = await shopify.webhooks.validate({
    rawBody: req.body, // is a string
    rawRequest: req,
    rawResponse: res,
  });


  if (!valid) {
    // This is not a valid request!
    res.send(400); // Bad Request
  }


  // Run my webhook-processing code here
});
```

For more details on the functions used in this snippet, you can check the library documentation for [webhooks](https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-api/docs/guides/webhooks.md) and [validation](https://github.com/Shopify/shopify-app-js/blob/main/packages/apps/shopify-api/docs/reference/webhooks/validate.md).

Caution

When you [rotate an app's client secret](https://shopify.dev/docs/apps/build/authentication-authorization/client-secrets/rotate-revoke-client-credentials), it can take up to an hour for the HMAC digest to be generated using the new secret.

### Common pitfalls and nuances to be aware of during validation

* **Raw Body Parsing**: Shopify's HMAC verification requires the raw request body. If you're using a body parser middleware like `express.json()`, it will parse the body before your webhook verification code gets to it. You need to capture the raw body before it's parsed.

* **Buffered Raw Body**: You should use the raw buffered body for the HMAC calculation.

* **Middleware Order**: Ensure that your webhook verification middleware is placed before any body parsing middleware in your app.

* **Encoding:** Ensure your encoding is set properly.

***

## Step 3: Queue your webhooks to process later in case of bursts of traffic

Queuing is a useful pattern to also handle occasional bursts of traffic. To queue, you can install a package like [Better Que](https://www.npmjs.com/package/better-queue) (or similar for the programming language of your choice) to store the webhook payload in a message queue to process later.

Queuing reduces the chance of the request timing out and having the webhook delivery count as a failure. This should enable your app to respond quickly, and for your job to take as long as it needs to complete, ensuring that your system is resilient to a high volume of requests.

***

* [Step 1: Notify Shopify that your app is receiving webhooks](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-1-notify-shopify-that-your-app-is-receiving-webhooks)
* [Step 2: Validate the origin of your webhook to ensure it's coming from Shopify](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-2-validate-the-origin-of-your-webhook-to-ensure-its-coming-from-shopify)
* [Step 3: Queue your webhooks to process later in case of bursts of traffic](https://shopify.dev/docs/apps/build/webhooks/subscribe/https.md#step-3-queue-your-webhooks-to-process-later-in-case-of-bursts-of-traffic)