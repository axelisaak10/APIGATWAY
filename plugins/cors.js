'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  const origins = (process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(o => o)

  fastify.register(require('@fastify/cors'), {
    origin: origins.length > 0 ? origins : true,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
  })
})