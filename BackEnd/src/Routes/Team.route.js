const express = require('express');

const TeamRouter = express.Router();

const TeamController = require("../Controllers/Team.controller");



/**
 * @openapi
 * /app/team/getTeam:
 *   post:
 *     tags: [Teams]
 *     summary: Team graph (level 1)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TeamIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamGraph' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamRouter.post('/getTeam',TeamController.getTeam);

/**
 * @openapi
 * /app/team/getTeamSecondLevel:
 *   post:
 *     tags: [Teams]
 *     summary: Team graph (level 2)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TeamIdPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamGraph' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamRouter.post('/getTeamSecondLevel',TeamController.getTeamSecondLevel);

/**
 * @openapi
 * /team/getTeamByFilter:
 *   post:
 *     tags: [Teams]
 *     summary: Graph (level 1) filtered by tier/office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TeamGraphFilterPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamGraph' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamRouter.post('/getTeamByFilter',TeamController.getTeamByFilter);

/**
 * @openapi
 * /team/getTeamSecLevelByFilter:
 *   post:
 *     tags: [Teams]
 *     summary: Graph (level 2) filtered by tier/office
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TeamGraphFilterPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamGraph' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamRouter.post('/getTeamSecLevelByFilter',TeamController.getTeamSecLevelByFilter);

/**
 * @openapi
 * /team/getTeamTableByFilter:
 *   post:
 *     tags: [Teams]
 *     summary: Filtered relationship table (level 1 or 2)
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TeamTableFilterPayload' }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/TeamTableResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamRouter.post('/getTeamTableByFilter',TeamController.getTeamTableByFilter);

//Search Team by name ****************************************************************************************************************************

TeamRouter.post('/getTeamByName',TeamController.getTeamByName);

TeamRouter.post('/getAgentByTeamName',TeamController.getAgentByTeamName);

TeamRouter.post('/getTeamInfos',TeamController.getTeamInfos);

TeamRouter.post('/generateCoryHomeTeamGraph',TeamController.generateCoryHomeTeamGraph);

TeamRouter.post('/getAgentTeamTable',TeamController.getAgentTeamTable);

TeamRouter.post('/save-search',TeamController.saveSearchHistory);

TeamRouter.post('/saved-searches',TeamController.getSearchHistory);

TeamRouter.post('/toggle-favorite',TeamController.toggleFavorite);

TeamRouter.post('/deteteNonFavorite',TeamController.deteteNonFavorite);

TeamRouter.post('/getFavoriteHistory',TeamController.getFavoriteHistory);

TeamRouter.post('/getOrgNodesByTeamKey',TeamController.getOrgNodesByTeamKey);








module.exports = {
    TeamRouter
};