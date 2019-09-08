const Router = require('koa-router');
const router = new Router();
const app = require('../server.js');

//Importing routers
const loginRouter = require('./loginEndPoint/loginRouter.js');
//const ticketsRouter = require('./secureEndPoints/ticketsRouter.js');

//Connection to DB
require('../db/mongoDb.js')(app);

//Index Routes
router.get('/api/v2/health', async ctx => {
  ctx.status = 200;
  ctx.body = {
    status: 'healthy',
    message: 'Edinburgh-by-night running smoothly'
  }
});

// Re-routing
router.use(loginRouter.routes());
//router.use(ticketsRouter.routes());

module.exports = router;