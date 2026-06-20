const express = require('express');

const GeoAreaAgentProdRouter = express.Router();

const GeoAreaAgentProdController = require("../Controllers/GeoAreaAgentProdController");



/**
 * @openapi
 * /app/geoAreaAgentProd/getAgentGeoProduction:
 *   post:
 *     tags: [Area]
 *     summary: Agent production (selected area)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProdArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 * 
 */
GeoAreaAgentProdRouter.post('/getAgentGeoProduction',GeoAreaAgentProdController.getAgentGeoProduction);

/**
 * @openapi
 * /app/geoAreaAgentProd/searchAgents:
 *   post:
 *     tags: [Area]
 *     summary: Search agents by name in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_SearchAgents_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_AgentSearchArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/searchAgents',GeoAreaAgentProdController.searchAgents);

/**
 * @openapi
 * /app/geoAreaAgentProd/getGeoProductionForAgent:
 *   post:
 *     tags: [Area]
 *     summary: Agent production in the selected area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_GeoProductionForAgent_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProdArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getGeoProductionForAgent',GeoAreaAgentProdController.getGeoProductionForAgent);

/**
 * @openapi
 * /app/geoAreaAgentProd/getZipsbyCityName:
 *   post:
 *     tags: [Area]
 *     summary: ZIPs by city (within a county)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['selectedLocation']
 *             properties:
 *               selectedLocation:
 *                 allOf:
 *                   - $ref: '#/components/schemas/SelectedLocation'
 *                 required: ['city','county']
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_ZipByCityArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getZipsbyCityName',GeoAreaAgentProdController.getZipsbyCityName);

/**
 * @openapi
 * /app/geoAreaAgentProd/fetchTransactionsGeoByAgent:
 *   post:
 *     tags: [Area]
 *     summary: Geolocated points of an agent’s transactions
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentId_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_TxnGeoByAgentArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/fetchTransactionsGeoByAgent',GeoAreaAgentProdController.fetchTransactionsGeoByAgent);

/**
 * @openapi
 * /app/geoAreaAgentProd/getNumberOfAgent:
 *   post:
 *     tags: [Area]
 *     summary: Number of distinct agents in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { type: 'number', example: 57 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getNumberOfAgent',GeoAreaAgentProdController.getNumberOfAgent);

/**
 * @openapi
 * /app/geoAreaAgentProd/getAgentGeoProductionForExtraction:
 *   post:
 *     tags: [Area]
 *     summary: Export aggregated production for the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_ExtractionArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getAgentGeoProductionForExtraction',GeoAreaAgentProdController.getAgentGeoProductionForExtraction);

/**
 * @openapi
 * /app/geoAreaAgentProd/getTotalTransactionAgent:
 *   post:
 *     tags: [Area]
 *     summary: Sum of transactions in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { type: 'number', example: 342 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getTotalTransactionAgent',GeoAreaAgentProdController.getTotalTransactionAgent);

/**
 * @openapi
 * /app/geoAreaAgentProd/getTotalListingsAgent:
 *   post:
 *     tags: [Area]
 *     summary: Sum of listings in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { type: 'number', example: 815 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getTotalListingsAgent',GeoAreaAgentProdController.getTotalListingsAgent);

/**
 * @openapi
 * /app/geoAreaAgentProd/getListingsGeoProduction:
 *   post:
 *     tags: [Area]
 *     summary: LIST/SELL/DNA production by ZIP/agent (area)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_ListingsGeoProdArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getListingsGeoProduction',GeoAreaAgentProdController.getListingsGeoProduction);

/**
 * @openapi
 * /app/geoAreaAgentProd/getTotalTransactionForListings:
 *   post:
 *     tags: [Area]
 *     summary: Total transactions same area (for listings)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { type: 'number', example: 210 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getTotalTransactionForListings',GeoAreaAgentProdController.getTotalTransactionForListings);

/**
 * @openapi
 * /app/geoAreaAgentProd/getTotalAgentsListings:
 *   post:
 *     tags: [Area]
 *     summary: Number of rows (agents) with SELL > 0 in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 type: 'object'
 *                 properties:
 *                   agents: { type: 'integer', example: 135 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getTotalAgentsListings',GeoAreaAgentProdController.getTotalAgentsListings);

/**
 * @openapi
 * /app/geoAreaAgentProd/getTotalAgentForListing:
 *   post:
 *     tags: [Area]
 *     summary: Number of distinct agents (all) in the area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { type: 'number', example: 420 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getTotalAgentForListing',GeoAreaAgentProdController.getTotalAgentForListing);

/**
 * @openapi
 * /app/geoAreaAgentProd/getCitiesByCountyFips:
 *   post:
 *     tags: [Area]
 *     summary: List of cities by County FIPS
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_CountyFips_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 type: 'object'
 *                 properties:
 *                   name: { type: 'string', example: 'Austin' }
 *                   code: { type: 'integer', example: 12345 }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getCitiesByCountyFips',GeoAreaAgentProdController.getCitiesByCountyFips);

//Save Search

/**
 * @openapi
 * /app/geoAreaAgentProd/save-search:
 *   post:
 *     tags: [Area]
 *     summary: Save a GeoArea search
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_SaveSearch_Payload' }
 *     responses:
 *       200: { description: Saved }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/save-search',GeoAreaAgentProdController.saveSearchHistory);

/**
 * @openapi
 * /app/geoAreaAgentProd/saved-searches:
 *   post:
 *     tags: [Area]
 *     summary: Get search history (GeoArea)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_SearchQuery_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_SearchArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/saved-searches',GeoAreaAgentProdController.getSearchHistory);

/**
 * @openapi
 * /app/geoAreaAgentProd/toggle-favorite:
 *   post:
 *     tags: [Area]
 *     summary: Update favorite for a GeoArea search
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_ToggleFavorite_Payload' }
 *     responses:
 *       200: { description: Updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/toggle-favorite',GeoAreaAgentProdController.toggleFavorite);

/**
 * @openapi
 * /app/geoAreaAgentProd/toggle-favoriteTeam:
 *   post:
 *     tags: [Area]
 *     summary: Update favorite Team for a GeoArea search
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_ToggleFavoriteTeam_Payload' }
 *     responses:
 *       200: { description: Updated }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/toggle-favoriteTeam',GeoAreaAgentProdController.toggleFavoriteTeam);

/**
 * @openapi
 * /app/geoAreaAgentProd/getFavoriteHistory:
 *   post:
 *     tags: [Area]
 *     summary: Get favorites history (GeoArea)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_SearchQuery_Payload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoArea_SearchArray' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getFavoriteHistory',GeoAreaAgentProdController.getFavoriteHistory);

/**
 * @openapi
 * /app/geoAreaAgentProd/deteteNonFavorite:
 *   post:
 *     tags: [Area]
 *     summary: Delete non-favorites (GeoArea)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/GeoArea_SearchQuery_Payload' }
 *     responses:
 *       200: { description: Deleted }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/deteteNonFavorite',GeoAreaAgentProdController.deteteNonFavorite);

/**
 * @openapi
 * /app/geoAreaAgentProd/getAllCities:
 *   post:
 *     tags: [Area]
 *     summary: Get all available cities
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of cities
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeoArea_CityArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/getAllCities',GeoAreaAgentProdController.getAllCities);

/**
 * @openapi
 * /app/geoAreaAgentProd/searchZip:
 *   post:
 *     tags: [Area]
 *     summary: Search ZIP codes by prefix
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoArea_SearchZip_Payload'
 *     responses:
 *       200:
 *         description: ZIP codes found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeoArea_SearchZipArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaAgentProdRouter.post('/searchZip',GeoAreaAgentProdController.searchZip);




module.exports = {
    GeoAreaAgentProdRouter
};