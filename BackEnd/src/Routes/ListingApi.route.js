const express = require('express');

const ListingApiRouter = express.Router();

const ListingApiController = require("../Controllers/ListingApiController");


ListingApiRouter.post('/update-data', ListingApiController.updateData);
ListingApiRouter.post('/searchListings', ListingApiController.searchListings);
ListingApiRouter.post('/getAutoCompleteOffice',ListingApiController.getAutoCompleteOffice);
ListingApiRouter.post('/getAutoCompleteAddress',ListingApiController.getAutoCompleteAddress);
ListingApiRouter.post('/getAutoCompleteCity',ListingApiController.getAutoCompleteCity);
ListingApiRouter.post('/getSearchData',ListingApiController.getSearchData);
ListingApiRouter.post('/getListingsTop1000',ListingApiController.getListingsTop1000);


module.exports = {
    ListingApiRouter
};