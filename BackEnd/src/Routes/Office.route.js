const express = require('express');

const officesRouter = express.Router();

const officeController = require("../Controllers/Office.controller");


/**
 * @openapi
 * /app/office/getCity:
 *   get:
 *     tags: [Offices]
 *     summary: Autocomplete of cities
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: term
 *         schema: { type: string }
 *         required: true
 *         description: City prefix
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeCityArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

officesRouter.get('/getCity?:term',officeController.getCity);

/**
 * @openapi
 * /app/office/getOfficeByCity:
 *   get:
 *     tags: [Offices]
 *     summary: Office suggestions for a given city
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *         required: true
 *       - in: query
 *         name: term
 *         schema: { type: string }
 *         required: true
 *         description: Office prefix
 *     responses:
 *       200:
 *         description: Liste value/label d’offices
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeSuggestArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError' */
officesRouter.get('/getOfficeByCity',officeController.getOfficeByCity);

/**
 * @openapi
 * /app/office/getAgentsByOffice:
 *   post:
 *     tags: [Offices]
 *     summary: Office summary and number of agents
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentByOfficeArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getAgentsByOffice',officeController.getAgentsByOffice);

/**
 * @openapi
 * /app/office/getOfficeInfos:
 *   post:
 *     tags: [Offices]
 *     summary: Office details by ID
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeInfos',officeController.findOfficeById);

/**
 * @openapi
 * /app/office/save-search:
 *   post:
 *     tags: [Offices]
 *     summary: Save an office search (limit 10)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeSearchSavePayload' }
 *     responses:
 *       200: { description: Created }
 */
officesRouter.post('/save-search',officeController.saveSearchHistory);

/**
 * @openapi
 * /app/office/saved-searches:
 *   post:
 *     tags: [Offices]
 *     summary: Office search history
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeSearchQueryPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeSearchArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/saved-searches',officeController.getSearchHistory);

/**
 * @openapi
 * /app/office/toggle-favorite:
 *   post:
 *     tags: [Offices]
 *     summary: Toggle an office favorite for a user
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeToggleFavoritePayload' }
 *     responses:
 *       200: { description: OK }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/toggle-favorite',officeController.toggleFavorite);

/**
 * @openapi
 * /app/office/getFavoriteHistory:
 *   post:
 *     tags: [Offices]
 *     summary: Favorites history (isFavorite = 0)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeSearchQueryPayload' }
 *     responses:
 *       200:
 *         description: Favoris
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeSearchArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getFavoriteHistory',officeController.getFavoriteHistory);

/**
 * @openapi
 * /app/office/deteteNonFavorite:
 *   post:
 *     tags: [Offices]
 *     summary: Delete non-favorite searches
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeSearchQueryPayload' }
 *     responses:
 *       200: { description: Deleted }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/deteteNonFavorite',officeController.deteteNonFavorite);

/**
 * @openapi
 * /app/office/getTotalPastOffice:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) Past totals (current vs last) for an office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficePastTotals' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getTotalPastOffice',officeController.get_total_past_Office);

/**
 * @openapi
 * /app/office/get_histo_data:
 *   post:
 *     tags: [Offices]
 *     summary: (Report) How is the office doing this year over last year
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeHistoArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/get_histo_data',officeController.get_histo_data_office);

/**
 * @openapi
 * /app/office/getOfficeDataPresentReport:
 *   post:
 *     tags: [Offices]
 *     summary: (Report) What's their mix of business, listing or selling
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficePresentArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeDataPresentReport',officeController.get_Office_Data_Present_Report);

/**
 * @openapi
 * /app/office/getOfficePresentMetrics:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) (LIST/SELL/DNA)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficePresentMetricsArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficePresentMetrics',officeController.get_Office_Present_Metrics);

/**
 * @openapi
 * /app/office/getOfficeNbrAgents:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) Number of agents in an office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeNbrAgents' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeNbrAgents',officeController.get_Office_NbrAgents);

/**
 * @openapi
 * /app/office/getGeoDataTot10:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) % of production in the Top 10 ZIP codes (last 12 months)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeGeoTop10Percent' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getGeoDataTot10',officeController.get_geo_data_tot10);

/**
 * @openapi
 * /app/office/getOfficeDataGeoReport:
 *   post:
 *     tags: [Offices]
 *     summary: (Report) Where do most of their sales take place
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeGeoReportArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeDataGeoReport',officeController.get_Office_Data_Geo_Report);

/**
 * @openapi
 * /app/office/getOfficeProduction:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) Total office production (agent count, volume)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeProdArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeProduction',officeController.get_office_production);

/**
 * @openapi
 * /app/office/getOfficeRankingReport:
 *   post:
 *     tags: [Offices]
 *     summary: (Report) How do the agents rank in their office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeRankingArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeRankingReport',officeController.get_Office_Ranking_Report);

/**
 * @openapi
 * /app/office/getOfficeTopCities:
 *   post:
 *     tags: [Offices]
 *     summary: (Metrics) Top 2 cities by listing volume (office)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeTopCityArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
officesRouter.post('/getOfficeTopCities',officeController.get_Office_Top_Cities);











module.exports = {
    officesRouter
};