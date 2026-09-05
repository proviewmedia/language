// Creates a Stripe Checkout Session for the EspTalk Pro one-time unlock.
// Runs server-side only — this is the one place the Stripe secret key is used.
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { userId, email } = req.body || {};
  if (!userId) {
    res.status(400).json({ error: 'userId is required' });
    return;
  }

  const params = new URLSearchParams();
  params.append('mode', 'payment');
  params.append('line_items[0][price]', process.env.STRIPE_PRICE_ID);
  params.append('line_items[0][quantity]', '1');
  params.append('client_reference_id', userId);
  if (email) params.append('customer_email', email);
  params.append('success_url', 'https://esptalk.com/app.html?checkout=success');
  params.append('cancel_url', 'https://esptalk.com/app.html?checkout=cancel');

  try {
    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
    const session = await stripeRes.json();
    if (!stripeRes.ok) {
      console.error('Stripe checkout session error', session);
      res.status(502).json({ error: 'Could not start checkout' });
      return;
    }
    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('create-checkout-session failed', err);
    res.status(500).json({ error: 'Could not start checkout' });
  }
};
