'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  const { USERS_SERVICE_URL, API_PREFIX } = process.env

  if (!USERS_SERVICE_URL) {
    throw new Error('USERS_SERVICE_URL is required in .env')
  }

  const prefix = `/${API_PREFIX || 'api'}/auth`

  fastify.register(require('@fastify/http-proxy'), {
    upstream: USERS_SERVICE_URL,
    prefix: prefix,
    rewritePrefix: '/auth',
    http2: false,
    acceptExposedHeaders: ['Set-Cookie'],
    disableCache: true,
    replyOptions: {
      rewriteRequestHeaders: (originalReq, headers) => {
        return {
          ...headers,
          cookie: originalReq.headers.cookie || '',
          authorization: originalReq.headers.authorization || ''
        }
      }
    }
  })
})