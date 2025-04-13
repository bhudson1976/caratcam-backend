const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
require("dotenv").config();

app.use(cors());
app.use(express.json());

// Confirm CaratCam backend is up
app.get("/", (req, res) => {
  res.send("✅ CaratCam backend is live!");
});

// Stripe checkout session endpoint
app.post("/create-checkout-session", async (req, res) => {
  const { priceId, mode } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: "https://caratcam.com/success",
      cancel_url: "https://caratcam.com/cancel",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    res.status(400).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
