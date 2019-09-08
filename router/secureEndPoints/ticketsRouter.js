const Router = require('koa-router');
const router = new Router();
const ObjectID = require('mongodb').ObjectID;

const app = require('../../server.js');
const BASE_URL = '/api/v2/tickets';

//Auth
const jwt = require('./jwt.js');

//Helpers
const helpers = require('../../helpers/helpers.js');

//GET /api/v2/tickets
router.get(`${BASE_URL}`, jwt, async ctx => {
  try {
    const ticketData = await app.tickets.find().toArray();
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: `Got ${ticketData.length} entries`,
      data: ticketData
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message || 'Sorry, an error has occurred.'
    };
  }
});

//POST /api/v2/tickets
router.post(`${BASE_URL}`, jwt, async ctx => {
  try {
    await app.tickets.insertOne(ctx.request.body.data);
    const newEntry = await app.tickets.findOne(ctx.request.body.data);
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: `Posted new entry id: ${newEntry._id}`,
      data: newEntry
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message || 'Sorry, an error has ocurred.'
    };
  }
});

//GET /api/v2/tickets/today
router.get(`${BASE_URL}/today`, jwt, async ctx => {
  try {
    const todaysDate = helpers.dateGrabber();
    const todaysTickets = await app.tickets
    .find({opened: todaysDate })
    .toArray();
    ctx.status = 200;
    ctx.body = {
      status: 'success',
      message: `We have find ${todaysTickets.length} tickets`,
      date: todaysDate,
      data: todaysTickets
    };
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message || 'Sorry, an error has ocurred.'
    };
  }
});

//GET /api/v2/tickets/:reference
router.get(`${BASE_URL}/:reference`, jwt, async ctx => {
  try {
    const ticketData = await app.tickets
      .find({ reference: ctx.params.reference })
      .toArray();
    if (ticketData) {
      ctx.status = 200;
      ctx.body = {
        status: 'success',
        message: `Retrieved object reference: ${ctx.params.reference}`,
        data: ticketData
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        status: 'error',
        message: 'That element does not exist on the collection'
      };
    }
  } catch (error) {
    ctx.status = 400;
    ctx.body = {
      status: 'error',
      message: error.message || 'Sorry, an error has ocurred.'
    };
  }
});

//PUT /api/v2/tickets/:reference
router.put(`${BASE_URL}/:reference`, jwt, async ctx => {
	try {
    const reference = ctx.params.reference;
    const newInfo = ctx.request.body.ticket;
    delete newInfo._id;
		await app.tickets.updateOne(
      { reference: reference },
			{ $set: newInfo },
			{ upsert: true }
		);
    const updatedTicket =  await app.tickets
      .findOne({reference: reference});
		ctx.status = 200;
		ctx.body = {
			status: 'success',
			message: `Updated ticket reference ${reference} successfully`,
			data: updatedTicket
		};
	} catch (error) {
    ctx.status = 400;
		ctx.body = {
			status: 'error',
			message: error.message || 'Sorry, an error has ocurred.'
		};
	}
});


//GET /api/v2/tickets/id/:id
// router.get(`${BASE_URL}/id/:id`, async ctx => {
// 	try {
// 		const id = ctx.params.id;
// 		const ticketData = await app.tickets
// 			.find({ _id: ObjectID(id) })
// 			.toArray();
// 		if (ticketData) {
// 			ctx.status = 200;
// 			ctx.body = {
// 				status: 'success',
// 				message: `Retrieved object id: ${id}`,
// 				data: ticketData
// 			};
// 		} else {
// 			ctx.status = 404;
// 			ctx.body = {
// 				status: 'error',
// 				message: 'That element does not exist on the collection'
// 			};
// 		}
// 	} catch (error) {
// 		ctx.status = 400;
// 		ctx.body = {
// 			status: 'error',
// 			message: error.message || 'Sorry, an error has ocurred.'
// 		};
// 	}
// });

//PUT /api/v2/tickets/id/:id
// router.put(`${BASE_URL}/id/:id`, async ctx => {
// 	try {
// 		const id = ctx.params.id;
// 		const newInfo = ctx.request.body.data;
// 		await app.tickets.updateOne(
// 			{ _id: ObjectID(id)},
// 			{ $set: newInfo },
// 			{ upsert: true }
// 		);
// 		const updatedTicket =  await app.tickets.findOne({_id: ObjectID(id)});
// 		ctx.status = 200;
// 		ctx.body = {
// 			status: 'success',
// 			message: `Updated object id ${id} successfully`,
// 			data: updatedTicket
// 		};
// 	} catch (error) {
// 		ctx.status = 400;
// 		ctx.body = {
// 			status: 'error',
// 			message: error.message || 'Sorry, an error has ocurred.'
// 		};
// 	}
// });

//DELETE /api/v2/tickets/id/:id
// router.delete(`${BASE_URL}/id/:id`, async ctx => {
// 	try {
// 		const id = ctx.params.id;
// 		const entryToDelete = await app.tickets.findOne({ _id: ObjectID(id) });
// 		if (entryToDelete) {
// 			await app.tickets.deleteOne(entryToDelete);
// 			ctx.status = 200;
// 			ctx.body = {
// 				status: 'success',
// 				message: `Entry id ${id} deleted`
// 			};
// 		} else {
// 			ctx.status = 404;
// 			ctx.body = {
// 				status: 'error',
// 				message: 'That element does not exist on the collection'
// 			};
// 		}
// 	} catch (error) {
// 		ctx.status = 400;
// 		ctx.body = {
// 			status: 'error',
// 			message: error.message || 'Sorry, an error has occurred.'
// 		};
// 	}
// });

module.exports = router;
