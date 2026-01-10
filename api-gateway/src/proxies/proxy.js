import { createProxyMiddleware } from "http-proxy-middleware";

export const createServiceProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyReq: (proxyReq, req) => {
      if (req.user) {
        proxyReq.setHeader("x-user-id", req.user.id);
        proxyReq.setHeader("x-user-role", req.user.role);
      }
    },
  });
