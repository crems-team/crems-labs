const express = require('express');
const { agentsRouter } = require('./Agent.route');
const { officesRouter } = require('./Office.route');
const { TeamRouter } = require('./Team.route');
const { GeoAreaRouter } = require('./GeoArea.route');
const { SearchToolRouter } = require('./SearchTool.route');
const { ListingApiRouter } = require('./ListingApi.route');
const { LoanOfficerRouter } = require('./LoanOfficer.route');
const { GeoAreaAgentProdRouter } = require('./GeoAreaAgentProd.route');

const keycloak = require('../Config/keycloak'); 





const apiRouter = express.Router();


// apiRouter.use('/search',  keycloak.protect(), agentsRouter);
apiRouter.use('/search',   agentsRouter);
apiRouter.use('/office', officesRouter);
apiRouter.use('/team', TeamRouter);
apiRouter.use('/geoArea', GeoAreaRouter);
apiRouter.use('/searchTool', SearchToolRouter);
apiRouter.use('/listingApi', ListingApiRouter);
apiRouter.use('/loanOfficer', LoanOfficerRouter);
apiRouter.use('/geoAreaAgentProd', GeoAreaAgentProdRouter);









module.exports = {
  apiRouter
};