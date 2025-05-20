const express = require('express');

const GeoAreaAgentProdRouter = express.Router();

const GeoAreaAgentProdController = require("../Controllers/GeoAreaAgentProdController");




GeoAreaAgentProdRouter.post('/getAgentGeoProduction',GeoAreaAgentProdController.getAgentGeoProduction);
GeoAreaAgentProdRouter.post('/searchAgents',GeoAreaAgentProdController.searchAgents);
GeoAreaAgentProdRouter.post('/getGeoProductionForAgent',GeoAreaAgentProdController.getGeoProductionForAgent);
GeoAreaAgentProdRouter.post('/getZipsbyCityName',GeoAreaAgentProdController.getZipsbyCityName);
GeoAreaAgentProdRouter.post('/fetchTransactionsGeoByAgent',GeoAreaAgentProdController.fetchTransactionsGeoByAgent);
GeoAreaAgentProdRouter.post('/getNumberOfAgent',GeoAreaAgentProdController.getNumberOfAgent);
GeoAreaAgentProdRouter.post('/getAgentGeoProductionForExtraction',GeoAreaAgentProdController.getAgentGeoProductionForExtraction);
GeoAreaAgentProdRouter.post('/getTotalTransaction',GeoAreaAgentProdController.getTotalTransaction);
GeoAreaAgentProdRouter.post('/getTotalListings',GeoAreaAgentProdController.getTotalListings);
GeoAreaAgentProdRouter.post('/getListingsGeoProduction',GeoAreaAgentProdController.getListingsGeoProduction);
GeoAreaAgentProdRouter.post('/getTotalTransactionsListings',GeoAreaAgentProdController.getTotalTransactionsListings);
GeoAreaAgentProdRouter.post('/getTotalAgentsListings',GeoAreaAgentProdController.getTotalAgentsListings);





module.exports = {
    GeoAreaAgentProdRouter
};