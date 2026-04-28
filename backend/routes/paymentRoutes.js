const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.post('/process', async (req, res) => {
  try {
    const { amount } = req.body;

    // 1. Ensure amount is a whole number (integer)
    // Stripe will throw an error if it receives a decimal (float)
    const totalAmount = Math.round(amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount,
      currency: 'inr',
      // 2. Enable automatic payment methods (Required for newer Stripe versions)
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: { company: "Tech Connect" },
    });

    // 3. Send back the secret
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    // Log the error on the server so you can see it in the terminal
    console.error("Stripe Backend Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;