const express = require('express');

const GeoAreaTeamProdRouter = express.Router();

const GeoAreaTeamProdController = require("../Controllers/GeoAreaTeamProdController");


/**
 * @openapi
 * /app/geoAreaTeamProd/getTeamGeoProduction:
 *   post:
 *     tags: [Area]
 *     summary: Get teams operating in the selected area
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoArea_AgentGeoProduction_Payload'
 *     responses:
 *       200:
 *         description: Teams found in the selected area
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeoArea_TeamGeoProductionArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaTeamProdRouter.post('/getTeamGeoProduction',GeoAreaTeamProdController.getTeamGeoProduction);

/**
 * @openapi
 * /app/geoAreaTeamProd/getAgentTeamTable:
 *   post:
 *     tags: [Area]
 *     summary: Get agents belonging to a team
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GeoArea_TeamId_Payload'
 *     responses:
 *       200:
 *         description: Team agents
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GeoArea_AgentTeamTableArray'
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
GeoAreaTeamProdRouter.post('/getAgentTeamTable',GeoAreaTeamProdController.getAgentTeamTable);



module.exports = {
    GeoAreaTeamProdRouter
};