import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Toss Payments Secret Key (Default test key if env not provided)
  const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY || "test_sk_zXL1z4J2yeYwv2M09E13YLG42D3v";

  // Helper for Toss Payments Authorization header
  const getTossAuthHeader = () => {
    const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString("base64");
    return `Basic ${encoded}`;
  };

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // 12. 결제 승인 서버 API (/api/payments/confirm)
  app.post("/api/payments/confirm", async (req, res) => {
    const { paymentKey, orderId, amount } = req.body;

    if (!paymentKey || !orderId || amount === undefined) {
      return res.status(400).json({
        success: false,
        code: "INVALID_REQUEST",
        message: "paymentKey, orderId, and amount are required.",
      });
    }

    try {
      // Call Toss Payments Confirm API
      const response = await fetch("https://api.tosspayments.com/v1/payments/confirm", {
        method: "POST",
        headers: {
          Authorization: getTossAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentKey,
          orderId,
          amount: Number(amount),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Toss Payment Confirmation Failed:", responseData);
        return res.status(response.status).json({
          success: false,
          code: responseData.code || "PAYMENT_CONFIRM_FAILED",
          message: responseData.message || "결제 승인 처리 중 오류가 발생했습니다.",
          details: responseData,
        });
      }

      // Success
      return res.json({
        success: true,
        data: responseData,
      });
    } catch (error: any) {
      console.error("Error confirming payment:", error);
      return res.status(500).json({
        success: false,
        code: "SERVER_ERROR",
        message: error?.message || "서버 내부 오류가 발생했습니다.",
      });
    }
  });

  // 13. 결제 취소 API (/api/payments/cancel)
  app.post("/api/payments/cancel", async (req, res) => {
    const { paymentKey, cancelReason } = req.body;

    if (!paymentKey || !cancelReason) {
      return res.status(400).json({
        success: false,
        code: "INVALID_REQUEST",
        message: "paymentKey와 취소 사유(cancelReason)가 필요합니다.",
      });
    }

    try {
      const response = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}/cancel`, {
        method: "POST",
        headers: {
          Authorization: getTossAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cancelReason,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        return res.status(response.status).json({
          success: false,
          code: responseData.code || "PAYMENT_CANCEL_FAILED",
          message: responseData.message || "결제 취소 요청이 실패했습니다.",
          details: responseData,
        });
      }

      return res.json({
        success: true,
        data: responseData,
      });
    } catch (error: any) {
      console.error("Error cancelling payment:", error);
      return res.status(500).json({
        success: false,
        code: "SERVER_ERROR",
        message: error?.message || "결제 취소 처리 중 서버 오류가 발생했습니다.",
      });
    }
  });

  // 14. 결제 웹훅 처리 API (/api/payments/webhook)
  app.post("/api/payments/webhook", (req, res) => {
    const webhookData = req.body;
    console.log("Toss Payments Webhook Received:", webhookData);

    // Toss Payments expects a 200 OK response
    res.status(200).json({ received: true });
  });

  // Vite development or production static middleware
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
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
