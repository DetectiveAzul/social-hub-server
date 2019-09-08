const koaJwt = require('koa-jwt');
const jwtKey = require('../../db/config.js').jwtKey;

module.exports = koaJwt({
  secret: jwtKey
});