import express from "express";
import { createServer as createViteServer } from "vite";
import Stripe from "stripe";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

let stripeClient: Stripe | null = null;

function getStripe() {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    console.log(`[STRIPE] Initializing client. Key present: ${!!key}`);
    
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables. Please add it in Settings > Environment Variables.");
    }
    
    if (key.startsWith('pk_')) {
      console.error("[STRIPE] Error: Publishable key used instead of Secret key");
      throw new Error("You are using a Stripe Publishable Key (pk_...) as a Secret Key. Please use a Secret Key (sk_...) or Restricted Key (rk_...) instead.");
    }
    
    stripeClient = new Stripe(key);
    console.log("[STRIPE] Client initialized successfully");
  }
  return stripeClient;
}

async function startServer() {
  console.log("Starting server initialization...");
  const app = express();
  const PORT = 3000;

  // Basic middlewares
  app.use(cors());
  app.use(express.json());

  // Logging middleware
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      message: "Server is running",
      env: {
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        nodeEnv: process.env.NODE_ENV
      }
    });
  });

  // API Route for Stripe Checkout
  app.post(["/api/create-checkout-session", "/api/create-checkout-session/"], async (req, res, next) => {
    const { priceId, planName, origin } = req.body;
    console.log(`[STRIPE] Creating session: ${planName} (${priceId})`);
    console.log(`[STRIPE] Origin: ${origin}`);

    try {
      if (!origin && !process.env.APP_URL) {
        console.warn("[STRIPE] Warning: No origin or APP_URL provided");
      }

      const stripe = getStripe();
      const baseUrl = origin || process.env.APP_URL || "http://localhost:3000";
      const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

      console.log(`[STRIPE] Using baseUrl: ${cleanBaseUrl}`);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: planName,
              },
              unit_amount: priceId === "single" ? 299 : 799,
              recurring: priceId === "professional" ? { interval: "month" } : undefined,
            },
            quantity: 1,
          },
        ],
        mode: priceId === "professional" ? "subscription" : "payment",
        success_url: `${cleanBaseUrl}/?success=true`,
        cancel_url: `${cleanBaseUrl}/?canceled=true`,
      });

      console.log(`[STRIPE] Session created: ${session.id}`);
      res.json({ url: session.url });
    } catch (error: any) {
      console.error("[STRIPE] Error:", error);
      next(error);
    }
  });

  // 404 for any other /api routes to prevent falling through to SPA fallback
  app.all("/api/*", (req, res) => {
    console.log(`[API 404] ${req.method} ${req.url}`);
    res.status(404).json({ 
      error: "API endpoint not found",
      method: req.method,
      path: req.url
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile("dist/index.html", { root: "." });
    });
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error Handler:", err);
    res.status(500).json({ 
      error: err.message || "Internal Server Error",
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`> Server ready at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("FATAL: Failed to start server:", err);
});
