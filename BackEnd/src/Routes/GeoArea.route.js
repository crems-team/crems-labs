const express = require('express');

const GeoAreaRouter = express.Router();

const GeoAreaController = require("../Controllers/GeoAreaController");




GeoAreaRouter.post('/getStates',GeoAreaController.getStates);
GeoAreaRouter.post('/getCounties',GeoAreaController.getCounties);
GeoAreaRouter.post('/getCities',GeoAreaController.getCities);
GeoAreaRouter.post('/getZips',GeoAreaController.getZips);
GeoAreaRouter.post('/getZipByCode',GeoAreaController.getZipByCode);
GeoAreaRouter.post('/getCityById',GeoAreaController.getCityById);
GeoAreaRouter.post('/getZipByCity',GeoAreaController.getZipByCity);
GeoAreaRouter.post('/fetchTransactions',GeoAreaController.fetchTransactions);
GeoAreaRouter.post('/fetchTransactionsGeo',GeoAreaController.fetchTransactionsGeo);

GeoAreaRouter.post('/save-search',GeoAreaController.saveSearchHistory);

GeoAreaRouter.post('/saved-searches',GeoAreaController.getSearchHistory);

GeoAreaRouter.post('/toggle-favorite',GeoAreaController.toggleFavorite);

GeoAreaRouter.post('/getFavoriteHistory',GeoAreaController.getFavoriteHistory);

GeoAreaRouter.post('/fetchTransactionsGeoByAgent',GeoAreaController.fetchTransactionsGeoByAgent);











module.exports = {
    GeoAreaRouter
};