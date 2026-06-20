const express = require('express');

const ListingApiRouter = express.Router();

const ListingApiController = require("../Controllers/ListingApiController");

/**
 * @openapi
 * /app/listingApi/update-data:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Fetch listings from external XML API and save into local DB
 *     description: Calls the TerraDatum endpoint and persists rows into `api_raw_listings_data` (table is truncated before insert).
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ListingsApiUpdateBody' }
 *           examples:
 *             default:
 *               value:
 *                 criteria:
 *                   authToken: "ABCDEFGHIJKLMNOP"
 *                   mlsSid: "NTREIS"
 *                   status: "All"
 *                   searchStr: "All"
 *                   searchBy: "office"
 *                   fromDate: "2024-01-01"
 *                   toDate:   "2024-12-31"
 *                   recLimit: 5000
 *     responses:
 *       200:
 *         description: Import done
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ListingsApiUpdateResponse' }
 *       502:
 *         description: Error fetching data from external API
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ErrorResponse' }
 *             examples:
 *               upstream:
 *                 value: { status: "error", message: "Error fetching data from external API" }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/update-data', ListingApiController.updateData);

/**
 * @openapi
 * /app/listingApi/searchListings:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Paginated search over `api_raw_listings_data`
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/SearchListingsBody' }
 *           examples:
 *             page1: { value: { criteria: { first: 0, rows: 10 } } }
 *     responses:
 *       200:
 *         description: Page of listings + total count
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/SearchListingsResponse' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/searchListings', ListingApiController.searchListings);

/**
 * @openapi
 * /app/listingApi/getAutoCompleteOffice:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Autocomplete office names from local table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LAutoOfficeBody' }
 *           examples:
 *             sample: { value: { office: "eXp" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/getAutoCompleteOffice',ListingApiController.getAutoCompleteOffice);

/**
 * @openapi
 * /app/listingApi/getAutoCompleteAddress:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Autocomplete addresses from local table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LAutoAddressBody' }
 *           examples:
 *             sample: { value: { address: "Main" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/getAutoCompleteAddress',ListingApiController.getAutoCompleteAddress);

/**
 * @openapi
 * /app/listingApi/getAutoCompleteCity:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Autocomplete cities from local table
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/LAutoCityBody' }
 *           examples:
 *             sample: { value: { city: "Dal" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Item' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/getAutoCompleteCity',ListingApiController.getAutoCompleteCity);

/**
 * @openapi
 * /app/listingApi/getSearchData:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Filter listings by exact office/address/city (all optional)
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ListingFreeSearchBody' }
 *           examples:
 *             byOffice: { value: { office: "eXp Realty - Dallas" } }
 *             byCity:   { value: { city: "Dallas" } }
 *             full:     { value: { office: "eXp Realty - Dallas", address: "123 Main St", city: "Dallas" } }
 *     responses:
 *       200:
 *         description: Result
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/ListingRecord' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/getSearchData',ListingApiController.getSearchData);

/**
 * @openapi
 * /app/listingApi/getListingsTop1000:
 *   post:
 *     tags: [ListingAPI]
 *     summary: Return top 1000 rows from local table + summary message
 *     responses:
 *       200:
 *         description: Top 1000
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/ListingsTop1000Response' }
 *       401: { $ref: '#/components/responses/Unauthorized' }
 *       403: { $ref: '#/components/responses/Forbidden' }
 *       500: { $ref: '#/components/responses/InternalError' }
 */
ListingApiRouter.post('/getListingsTop1000',ListingApiController.getListingsTop1000);


module.exports = {
    ListingApiRouter
};