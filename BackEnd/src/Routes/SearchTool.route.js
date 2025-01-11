const express = require('express');

const SearchToolRouter = express.Router();

const SearchToolController = require("../Controllers/SearchTool.controller");


SearchToolRouter.post('/getAgentIdAutoComplete',SearchToolController.getAutoCompleteAgentId);
SearchToolRouter.post('/getAutoCompleteOffice',SearchToolController.getAutoCompleteOffice);
SearchToolRouter.post('/getAutoCompleteAddress',SearchToolController.getAutoCompleteAddress);
SearchToolRouter.post('/getAutoCompleteCity',SearchToolController.getAutoCompleteCity);
SearchToolRouter.post('/getSearchData',SearchToolController.getSearchData);

SearchToolRouter.post('/save-search',SearchToolController.saveSearchHistory);

SearchToolRouter.post('/saved-searches',SearchToolController.getSearchHistory);

SearchToolRouter.post('/toggle-favorite',SearchToolController.toggleFavorite);

SearchToolRouter.post('/getFavoriteHistory',SearchToolController.getFavoriteHistory);




module.exports = {
    SearchToolRouter
};