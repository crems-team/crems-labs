const express = require('express');

const SearchToolRouter = express.Router();

const SearchToolController = require("../Controllers/SearchTool.controller");

/**
 * @openapi
 * /app/searchTool/getAgentIdAutoComplete:
 *   post:
 *     tags: [SearchTool]
 *     summary: Autocomplete agentId from listing historicals
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AgentIdAutoBody' }
 *           examples:
 *             sample: { value: { agentId: "123" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getAgentIdAutoComplete',SearchToolController.getAutoCompleteAgentId);

/**
 * @openapi
 * /app/searchTool/getAutoCompleteOffice:
 *   post:
 *     tags: [SearchTool]
 *     summary: Autocomplete offices for a given agentId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/OfficeAutoBody' }
 *           examples:
 *             sample: { value: { office: "eXp", agentId: "987654" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getAutoCompleteOffice',SearchToolController.getAutoCompleteOffice);

/**
 * @openapi
 * /app/searchTool/getAutoCompleteAddress:
 *   post:
 *     tags: [SearchTool]
 *     summary: Autocomplete addresses for a given agentId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/AddressAutoBody' }
 *           examples:
 *             sample: { value: { address: "Main", agentId: "987654" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getAutoCompleteAddress',SearchToolController.getAutoCompleteAddress);

/**
 * @openapi
 * /app/searchTool/getAutoCompleteCity:
 *   post:
 *     tags: [SearchTool]
 *     summary: Autocomplete cities for a given agentId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/CityAutoBody' }
 *           examples:
 *             sample: { value: { city: "Aus", agentId: "987654" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getAutoCompleteCity',SearchToolController.getAutoCompleteCity);

/**
 * @openapi
 * /app/searchTool/getSearchData:
 *   post:
 *     tags: [SearchTool]
 *     summary: Search listing historical data by agentId with optional office/address/city filters
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SearchDataBody' }
 *           examples:
 *             min: { value: { agentId: "987654" } }
 *             full:
 *               value:
 *                 agentId: "987654"
 *                 office:  "eXp Realty - Dallas"
 *                 address: "123 Main St"
 *                 city:    "Dallas"
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ListingHistorical' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getSearchData',SearchToolController.getSearchData);

/**
 * @openapi
 * /app/searchTool/save-search:
 *   post:
 *     tags: [SearchTool]
 *     summary: Save a search (max 10 per user)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SaveSearchBodySearchTool' }
 *           examples:
 *             sample:
 *               value:
 *                 userId: 'fe394ec1-ac90-8752-9d67-12334094a3'
 *                 savedType: "SEARCH"
 *                 agentId: "987654"
 *                 officeName: "eXp Realty - Dallas"
 *                 address: "123 Main St"
 *                 city: "Dallas"
 *     responses:
 *       200:
 *         description: Saved
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/save-search',SearchToolController.saveSearchHistory);

/**
 * @openapi
 * /app/searchTool/saved-searches:
 *   post:
 *     tags: [SearchTool]
 *     summary: Get saved search history
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "SEARCH" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/HistoryItemSearchTool' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/saved-searches',SearchToolController.getSearchHistory);

/**
 * @openapi
 * /app/searchTool/toggle-favorite:
 *   post:
 *     tags: [SearchTool]
 *     summary: Toggle favorite flag for a saved search row 
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ToggleFavoriteBody' }
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
SearchToolRouter.post('/toggle-favorite',SearchToolController.toggleFavorite);

/**
 * @openapi
 * /app/searchTool/deteteNonFavorite:
 *   post:
 *     tags: [SearchTool]
 *     summary: Delete all favorite rows for the given user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "SEARCH" } }
 *     responses:
 *       200:
 *         description: Deleted
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/deteteNonFavorite',SearchToolController.deteteNonFavorite);

/**
 * @openapi
 * /app/searchTool/getFavoriteHistory:
 *   post:
 *     tags: [SearchTool]
 *     summary: Get items where isFavorite for the given user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SavedTypeBody' }
 *           examples:
 *             sample: { value: { userId: 'fe394ec1-ac90-8752-9d67-12334094a3', savedType: "SEARCH" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/FavoriteItemSearchTool' }
 *       404: { $ref: '#/components/responses/NotFound' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
SearchToolRouter.post('/getFavoriteHistory',SearchToolController.getFavoriteHistory);




module.exports = {
    SearchToolRouter
};