const express = require('express');

const officesRouter = express.Router();

const officeController = require("../Controllers/Office.controller");




officesRouter.get('/getCity?:term',officeController.getCity);

officesRouter.get('/getOfficeByCity',officeController.getOfficeByCity);


officesRouter.post('/getAgentsByOffice',officeController.getAgentsByOffice);

officesRouter.post('/save-search',officeController.saveSearchHistory);

officesRouter.post('/saved-searches',officeController.getSearchHistory);

officesRouter.post('/toggle-favorite',officeController.toggleFavorite);

officesRouter.post('/getFavoriteHistory',officeController.getFavoriteHistory);










module.exports = {
    officesRouter
};