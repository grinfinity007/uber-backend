import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

import gatewayRoutes from "./routes/gateway.routes.js";

app.use("/api/v1", gatewayRoutes);

app.get("/api/v1/health", (_, res) => {
  res.json({status: "gateway-ok"});
});

export default app;