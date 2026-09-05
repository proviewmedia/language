// Verifies a Stripe webhook and grants Pro access. This is the ONLY place
// that actually marks a user as Pro — never trust the browser's redirect
// back from Checkout alone, since a user could hand-craft that URL.
const crypto = require('crypto');

// Needs the raw request body to verify the signature, so disable Vercel's
// automatic JSON body parsing for this function.
module.exports.config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(',').map((p) => p.split('='))
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const signedPayload = `${timestamp}.${rawBody}`;
  const expected = crypto
    .createHmac('sha256', secret)
    .update(signedPayload, 'utf8')
    .digest('hex');

  const expectedBuf = Buffer.from(expected, 'hex');
  const actualBuf = Buffer.from(signature, 'hex');
  if (expectedBuf.length !== actualBuf.length) return false;
  return crypto.timingSafeEqual(expectedBuf, actualBuf);
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  const rawBody = await readRawBody(req);
  const signatureHeader = req.headers['stripe-signature'];
  const ok = verifyStripeSignature(
    rawBody.toString('utf8'),
    signatureHeader,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  if (!ok) {
    res.status(400).send('Invalid signature');
    return;
  }

  let event;
  try {
    event = JSON.parse(rawBody.toString('utf8'));
  } catch (e) {
    res.status(400).send('Invalid payload');
    return;
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.client_reference_id;
    if (userId) {
      try {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
            Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'resolution=merge-duplicates,return=minimal',
          },
          body: JSON.stringify({
            id: userId,
            is_pro: true,
            updated_at: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.error('Failed to grant Pro after payment', userId, err);
        // Still return 200 below so Stripe doesn't retry indefinitely for a
        // payment that did succeed; this failure needs manual follow-up.
      }
    }
  }

  res.status(200).json({ received: true });
};
