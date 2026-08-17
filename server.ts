import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json" with { type: "json" };
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
try {
  admin.initializeApp({
    projectId: firebaseConfig.projectId,
  });
} catch (e) {
  console.log("Firebase Admin already initialized or could not be initialized automatically.");
}

const db = getFirestore(firebaseConfig.firestoreDatabaseId);
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Example Product API (Proxing Firestore)
  app.get("/api/products", async (req, res) => {
    try {
      if (!db) throw new Error("Firestore not initialized");
      const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.post("/api/send-confirmation", async (req, res) => {
    const { email, orderId, customerName, productTitle, productPrice, address } = req.body;

    if (!resend) {
      console.warn("Resend API key not configured. Skipping email.");
      return res.status(200).json({ message: "Email service not configured", skipped: true });
    }

    try {
      const { data, error } = await resend.emails.send({
        from: "Lakshmi Fashion <onboarding@resend.dev>",
        to: [email],
        subject: `Order Confirmation - ${orderId}`,
        html: `
          <div style="font-family: serif; color: #1c1917; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; padding: 40px;">
            <h1 style="color: #800000; text-align: center; font-style: italic;">Thank You for Your Patronage</h1>
            <p style="text-align: center; text-transform: uppercase; letter-spacing: 2px; font-size: 12px; color: #d4af37;">Reservation Confirmed</p>
            
            <div style="background-color: #fcf8f0; padding: 20px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${orderId}</p>
              <p><strong>Status:</strong> Processing (Awaiting Verification)</p>
            </div>

            <h2 style="font-size: 18px; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h2>
            <p><strong>Customer:</strong> ${customerName}</p>
            <p><strong>Product:</strong> ${productTitle}</p>
            <p><strong>Amount:</strong> ₹${productPrice.toLocaleString('en-IN')}</p>
            <p><strong>Shipping Address:</strong> ${address}</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
              <p style="font-style: italic;">You can track your heritage journey on our website using your Order ID.</p>
              <a href="${process.env.APP_URL}/track?orderId=${orderId}" style="display: inline-block; background-color: #1c1917; color: #d4af37; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 2px;">Track Manifest</a>
            </div>

            <p style="font-size: 10px; color: #a8a29e; margin-top: 40px; text-align: center; text-transform: uppercase; letter-spacing: 1px;">Lakshmi Fashion - Curating Timeless Heritage</p>
          </div>
        `,
      });

      if (error) {
        return res.status(400).json(error);
      }

      res.status(200).json(data);
    } catch (err) {
      res.status(500).json({ error: (err as Error).message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
