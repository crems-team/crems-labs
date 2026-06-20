const express = require('express');

const TeamInvestigationRouter = express.Router();

const TeamsInvestigationController = require("../Controllers/TeamsInvestigation.controller");

/**
 * @openapi
 * /app/teamInvetigation/getTeam: 
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get team graph data
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_TeamId_Payload'
 *     responses:
 *       200:
 *         description: Team graph containing nodes and links
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_GetTeam_Response'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getTeam',TeamsInvestigationController.getTeam);

/**
 * @openapi
 * /app/teamInvetigation/getTeamByName:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Search teams by name
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_SearchTeamByName_Payload'
 *     responses:
 *       200:
 *         description: Matching teams
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_SearchTeamArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getTeamByName',TeamsInvestigationController.getTeamByName);

/**
 * @openapi
 * /app/teamInvetigation/getAgentsByTeamId:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get all agents belonging to a team
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_TeamId_Payload'
 *     responses:
 *       200:
 *         description: Team members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_AgentArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getAgentsByTeamId',TeamsInvestigationController.getAgentsByTeamId);

/**
 * @openapi
 * /app/teamInvetigation/getTeamByFilter:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Team investigation graph filtered by office and tiers
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_GraphFilterPayload'
 *     responses:
 *       200:
 *         description: Filtered team graph
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_GetTeam_Response'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getTeamByFilter',TeamsInvestigationController.getTeamByFilter);

/**
 * @openapi
 * /app/teamInvetigation/getAgentTeamTable:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get filtered team members table
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_GraphFilterPayload'
 *     responses:
 *       200:
 *         description: Filtered team members
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_AgentArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getAgentTeamTable',TeamsInvestigationController.getAgentTeamTable);

/**
 * @openapi
 * /app/teamInvetigation/save-search:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Save a Team Investigation search
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_SaveSearch_Payload'
 *     responses:
 *       200:
 *         description: Search saved successfully
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/save-search',TeamsInvestigationController.saveSearchHistory);

/**
 * @openapi
 * /app/teamInvetigation/saved-searches:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get Team Investigation search history
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_SearchQuery_Payload'
 *     responses:
 *       200:
 *         description: Search history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_SearchHistoryArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/saved-searches',TeamsInvestigationController.getSearchHistory);

/**
 * @openapi
 * /app/teamInvetigation/toggle-favorite:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Update favorite status for a Team Investigation search
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_ToggleFavorite_Payload'
 *     responses:
 *       200:
 *         description: Favorite status updated successfully
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/toggle-favorite',TeamsInvestigationController.toggleFavorite);

/**
 * @openapi
 * /app/teamInvetigation/deteteNonFavorite:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Delete non-favorite Team Investigation searches
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_SearchQuery_Payload'
 *     responses:
 *       200:
 *         description: Non-favorite searches deleted successfully
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/deteteNonFavorite',TeamsInvestigationController.deteteNonFavorite);

/**
 * @openapi
 * /app/teamInvetigation/getFavoriteHistory:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get favorite Team Investigation searches
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_SearchQuery_Payload'
 *     responses:
 *       200:
 *         description: Favorite searches
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_FavoriteHistoryArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getFavoriteHistory',TeamsInvestigationController.getFavoriteHistory);

/**
 * @openapi
 * /app/teamInvetigation/getTeamInfos:
 *   post:
 *     tags: [Team Investigation]
 *     summary: Get team information
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TeamInvestigation_TeamId_Payload'
 *     responses:
 *       200:
 *         description: Team information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TeamInvestigation_TeamInfo'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
TeamInvestigationRouter.post('/getTeamInfos',TeamsInvestigationController.getTeamInfos);


module.exports = {
    TeamInvestigationRouter
};