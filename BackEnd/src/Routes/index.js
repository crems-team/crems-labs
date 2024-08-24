const express = require('express');
const { agentsRouter } = require('./Agent.route');
const { officesRouter } = require('./Office.route');
const { TeamRouter } = require('./Team.route');
const { GeoAreaRouter } = require('./GeoArea.route');




const apiRouter = express.Router();


apiRouter.use('/search', agentsRouter);
apiRouter.use('/office', officesRouter);
apiRouter.use('/team', TeamRouter);
apiRouter.use('/geoArea', GeoAreaRouter);





module.exports = {
  apiRouter
};