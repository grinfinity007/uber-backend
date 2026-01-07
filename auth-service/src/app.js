import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);

app.get("/api/v1/health", (req, res) => {
  res.status(200).send("Auth service is healthy");
});

export default app;