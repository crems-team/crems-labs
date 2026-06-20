const express = require('express');

const agentsRouter = express.Router();

const agentController = require("../Controllers/Agent.controller");

// const keycloak = require('../Config/keycloak'); 

const validate = require('../Middlewares/validate'); 
const { 
  agentIdSchema, 
  termSchema, 
  firstNameSchema,
  rankingSchema,
  saveHistorySchema
} = require('../Validations/Agent.validation');

agentsRouter.get('/debug', (req, res) => {
    res.json({
      token: req.kauth ? req.kauth.grant.access_token.content : null
    });
  }); 
/**
 * @openapi
 * /app/search/getAgentInfos:
 *   post:
 *     tags: [Agents]
 *     summary: Search agents by ID
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
// agentsRouter.post('/getAgentInfos',keycloak.protect(),agentController.findAgentById);
// agentsRouter.post('/getAgentInfos',validate(agentIdSchema),agentController.findAgentById);
agentsRouter.post('/getAgentInfos', agentController.findAgentById);

// agentsRouter.get('/lastName?:term',agentController.getLastName);

// agentsRouter.get('/firstName',agentController.getFirstName);

/**
 * @openapi
 * /app/search/agentByName:
 *   post:
 *     tags: [Agents]
 *     summary: Search agents by name
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TermPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/AgentNameArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/agentByName',agentController.getAgentByName);
/**
 * @openapi
 * /app/search/getAgentHistoData:
 *   post:
 *     tags: [Agents]
 *     summary: (Report) How is the agent doing this year over last year?
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         descriptionn: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/HistoArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getAgentHistoData',agentController.get_histo_data);
/**
 * @openapi
 * /app/search/getTotalPast:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) (Recent 12m vs Previous 12m)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PastTotals' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getTotalPast',agentController.get_total_past);

/**
 * @openapi
 * /app/search/getDataPresentReport:
 *   post:
 *     tags: [Agents]
 *     summary: (Report) What's their mix of business, listing or selling
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/PresentArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getDataPresentReport',agentController.get_Data_Present_Report);

/**
 * @openapi
 * /app/search/getTotalPresent:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) (LIST/SELL/DNA)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: StatData[]
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/StatDataArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getTotalPresent',agentController.get_total_present);

/**
 * @openapi
 * /app/search/getDataFutureReport:
 *   post:
 *     tags: [Agents]
 *     summary: (Report) What sales do they expect in the near future
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FutureArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getDataFutureReport',agentController.get_Data_Future_Report);

/**
 * @openapi
 * /app/search/getTotalFuture:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) "Future" (new/exist/pending) for current month
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/FutureTotalsArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getTotalFuture',agentController.get_total_future);

/**
 * @openapi
 * /app/search/getDataGeoReport:
 *   post:
 *     tags: [Agents]
 *     summary: (Report) Where do most of their sales take place
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoReportArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getDataGeoReport',agentController.get_Data_Geo_Report);

/**
 * @openapi
 * /app/search/getGeoDataTot:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) % of production in the Top 10 ZIP codes (last 12 months)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/GeoTop10Percent' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getGeoDataTot',agentController.get_geo_data_tot10);

/**
 * @openapi
 * /app/search/getOfficeRankingReport:
 *   post:
 *     tags: [Agents]
 *     summary: (Report) How do they rank in their office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeCtxPayload' }
 *     responses:
 *       200:
 *         description: Results
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

agentsRouter.post('/getOfficeRankingReport',agentController.get_Office_Ranking_Report);

/**
 * @openapi
 * /app/search/getofficeproduction:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) Agent’s share of production within their office + ranking
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeCtxPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/OfficeProdSummary' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getofficeproduction',agentController.get_office_production);

/**
 * @openapi
 * /app/search/getTeamData:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) Team members count + number of transactions
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamCounts' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getTeamData',agentController.get_team_data);

/**
 * @openapi
 * /app/search/getTeamAgentsTable:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) Team agents table with volumes
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamAgentArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getTeamAgentsTable',agentController.get_team_agents_table);

/**
 * @openapi
 * /app/search/getAgentTierPersona:
 *   post:
 *     tags: [Agents]
 *     summary: (Metrics) Agent’s tier persona
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TierPersonaArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */

agentsRouter.post('/getAgentTierPersona',agentController.get_agent_tier_persona);

/**
 * @openapi
 * /app/search/saved-searches:
 *   post:
 *     tags: [Agents]
 *     summary: Get saved search history
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SearchQueryPayload' }
 *     responses:
 *       200:
 *         description: Results
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SearchArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/saved-searches',agentController.getSearchHistory);

/**
 * @openapi
 * /app/search/toggle-favorite:
 *   post:
 *     tags: [Agents]
 *     summary: Toggle favorite
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ToggleFavoritePayload' }
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
agentsRouter.post('/toggle-favorite',agentController.toggleFavorite);

/**
 * @openapi
 * /app/search/save-search:
 *   post:
 *     tags: [Agents]
 *     summary: Save a search (limit 10)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SaveSearchPayload' }
 *     responses:
 *       201: { description: Created }
 */
agentsRouter.post('/save-search',agentController.saveSearchHistory);
//agentsRouter.post('/save-search',agentController.getSearchHistory);

/**
 * @openapi
 *  /app/search/getFavoriteHistory:
 *   post:
 *     tags: [Agents]
 *     summary: Get favorites history (isFavorite = 0)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SearchQueryPayload' }
 *     responses:
 *       200:
 *         description: Favoris
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SearchArray' }
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalError'
 */
agentsRouter.post('/getFavoriteHistory',agentController.getFavoriteHistory);

// agentsRouter.post('/getAgentFullName',agentController.getAgentFullName);

/**
 * @openapi
 *  /app/search/deteteNonFavorite:
 *   post:
 *     tags: [Agents]
 *     summary: Delete non-favorite searches
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SearchQueryPayload' }
 *     responses:
 *       204: { description: Deleted }
 */
agentsRouter.post('/deteteNonFavorite',agentController.deteteNonFavorite);








module.exports = {
    agentsRouter
};