const express = require('express');

const LoanOfficerRouter = express.Router();

const LoanOfficerController = require("../Controllers/LoanOfficer.controller");

/**
 * @openapi
 * /app/loanOfficer/getNameLoanOfficer:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Autocomplete loan officer names
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TermBody' }
 *           examples:
 *             sample: { value: { term: "Ja" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/LoanOfficerSearchItem' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getNameLoanOfficer',LoanOfficerController.getNameLoanOfficer);

/**
 * @openapi
 * /app/loanOfficer/getAgentByName:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get loan officer records by exact name
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/NameBody' }
 *           examples:
 *             sample: { value: { name: "Jane Doe" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoanOfficerList' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getAgentByName',LoanOfficerController.getAgentByName);

/**
 * @openapi
 * /app/loanOfficer/getSankeyData:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Build Sankey data for an officer (top listing agents and capture rate)
 *     description: Uses officer NMLS id in `officerId`.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficerIdBody' }
 *           examples:
 *             sample: { value: { officerId: "123456" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SankeyResponse' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getSankeyData',LoanOfficerController.get_SankeyData);

/**
 * @openapi
 * /app/loanOfficer/getTotalAgents:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get total distinct agents worked with by an officer (last 12 months)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/IdBody' }
 *           examples:
 *             sample: { value: { id: "123456" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TotalAgents' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getTotalAgents',LoanOfficerController.getTotalAgents);

/**
 * @openapi
 * /app/loanOfficer/findLoanOfficerById:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Find a loan officer by NMLS id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/IdBody' }
 *           examples:
 *             sample: { value: { id: "123456" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/LoanOfficer' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/findLoanOfficerById',LoanOfficerController.findLoanOfficerById);

/**
 * @openapi
 * /app/loanOfficer/getTotalSalesAndCapRate:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get total sales and capture rate for an officer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/IdBody' }
 *           examples:
 *             sample: { value: { id: "123456" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SalesCapRate' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getTotalSalesAndCapRate',LoanOfficerController.getTotalSalesAndCapRate);

/**
 * @openapi
 * /app/loanOfficer/save-search:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Save a loan officer search to history (max 10 per user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SaveSearchBodyLO' }
 *           examples:
 *             sample:
 *               value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "LO", officerName: "Jane Doe", officerId: "123456" }
 *     responses:
 *       200:
 *         description: Saved
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/save-search',LoanOfficerController.saveSearchHistory);

/**
 * @openapi
 * /app/loanOfficer/saved-searches:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get saved search history for loan officers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "LO" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HistoryItemLO' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/saved-searches',LoanOfficerController.getSearchHistory);

/**
 * @openapi
 * /app/loanOfficer/toggle-favorite:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Toggle favorite flag for a saved search row (by idHistory)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ToggleFavoriteBodyLO' }
 *           examples:
 *             sample: { value: { search: { idHistory: 101, isFavorite: 0 } } }
 *     responses:
 *       200:
 *         description: Updated
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/toggle-favorite',LoanOfficerController.toggleFavorite);

/**
 * @openapi
 * /app/loanOfficer/getFavoriteHistory:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get favorite loan officers history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "LO" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/FavoriteItemLO' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getFavoriteHistory',LoanOfficerController.getFavoriteHistory);

/**
 * @openapi
 * /app/loanOfficer/deteteNonFavorite:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Delete all no favorite loan officer items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "LO" } }
 *     responses:
 *       200:
 *         description: Deleted
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/deteteNonFavorite',LoanOfficerController.deteteNonFavorite);

/**
 * @openapi
 * /app/loanOfficer/getAgentRankingLO:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get office ranking for an officer vs agents (includes LO transaction count & capture %)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/RankingLOBody' }
 *           examples:
 *             sample:
 *               value: { idOfficer: "123456", idAgent: "998877", officeId: "678576" }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/RankingItemLO' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getAgentRankingLO',LoanOfficerController.get_agent_ranking_LO);

/**
 * @openapi
 * /app/loanOfficer/getOfficeNamesLo:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get distinct DNA office names for an officer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/IdBody' }
 *           examples:
 *             sample: { value: { id: "123456" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/OfficeName' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getOfficeNamesLo',LoanOfficerController.getOfficeNamesLo);

/**
 * @openapi
 * /app/loanOfficer/getDataLOWorkedWithAgent:
 *   post:
 *     tags: [LoanOfficer]
 *     summary: Get top loan officers who worked with a specific agent (plus capture rate)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idAgent]
 *             properties:
 *               idAgent: { type: 'string', example: '998877' }
 *           examples:
 *             sample: { value: { idAgent: "998877" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/WorkedWithAgentItem' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
LoanOfficerRouter.post('/getDataLOWorkedWithAgent',LoanOfficerController.getDataLOWorkedWithAgent);










module.exports = {
    LoanOfficerRouter
};