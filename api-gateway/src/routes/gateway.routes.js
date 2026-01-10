import { Router } from "express";
import { verifyJWT } from "../middlewares/jwt.middleware.js";
import { createServiceProxy } from "../proxies/proxy.js";

const router = Router();

router.use("/auth", createServiceProxy(process.env.AUTH_SERVICE_URL));

router.use("/user", verifyJWT, createServiceProxy(process.env.USER_SERVICE_URL));

export default router;