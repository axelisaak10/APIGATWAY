"use strict";

const fp = require("fastify-plugin");

module.exports = fp(async function (fastify, opts) {
  const defaultOrigins = "https://auth-dncf1iwnd-axelisaak10s-projects.vercel.app";
  const origins = (process.env.CORS_ORIGINS || defaultOrigins)
    .split(",")
    .map((o) => o.trim())
    .filter((o) => o);

  const corsOptions = {
    origin: origins.length > 0 ? origins : false,
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Set-Cookie", "Authorization", "X-Cache"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    preflightContinue: false,
    strictPreflight: false,
  };

  await fastify.register(require("@fastify/cors"), corsOptions);

  fastify.addHook("onSend", async (request, reply) => {
    const existingOrigin = reply.getHeader("access-control-allow-origin");
    if (existingOrigin && existingOrigin !== "*") {
      return;
    }
    const requestOrigin = request.headers.origin;
    if (requestOrigin && origins.includes(requestOrigin)) {
      reply.header("Access-Control-Allow-Origin", requestOrigin);
    }
  });
});
