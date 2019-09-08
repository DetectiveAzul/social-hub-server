const Koa = require('koa');
//Midleware
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');

//Initialization
const app = new Koa();
const PORT = process.env.PORT || 8080;
const router = require('./router/index.js');

//Koa using
app.use(cors());
app.use(bodyParser());
app.use(logger());
app.use(router.routes());

//Start listening
app.listen(PORT, () => {
	console.log(`Server listening on port: ${PORT}`);
});

//Exporting
module.exports = app;
