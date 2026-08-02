import express from "express";
import path from "path";
import adminRoutes from "./server/routes/adminRoutes";
import speechRoutes from "./server/routes/speechRoutes";
import learningRoutes from "./server/routes/learningRoutes";

const app = express();
const PORT = 3000;

// Enable CORS for Vercel and cross-origin calls
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json({ limit: "20mb" }));
app.use("/assets", express.static(path.join(process.cwd(), "public", "assets")));
app.use("/assets", express.static(path.join(process.cwd(), "assets")));

const apiRouter = express.Router();

// Mount Modular Route Handlers
apiRouter.use(adminRoutes);
apiRouter.use(speechRoutes);
apiRouter.use(learningRoutes);

// Mount apiRouter on both /api prefix and root / prefix to accommodate Vercel rewrites
app.use("/api", apiRouter);
app.use("/", apiRouter);

// Global Error Handler for Express
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global Express Error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

// Start Vite server in dev or serve static build in local production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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
    console.log(`EduBridge HK Server running on http://0.0.0.0:${PORT}`);
  });
}

export default app;

const isServerless = !!(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NOW_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  (process.argv[1] && process.argv[1].includes("/api/"))
);

if (!isServerless) {
  startServer();
}
