const express = require('express');

const officesRouter = express.Router();

const officeController = require("../Controllers/Office.controller");




officesRouter.get('/getCity?:term',officeController.getCity);

officesRouter.get('/getOfficeByCity',officeController.getOfficeByCity);


officesRouter.post('/getAgentsByOffice',officeController.getAgentsByOffice);

officesRouter.post('/getOfficeInfos',officeController.findOfficeById);


officesRouter.post('/save-search',officeController.saveSearchHistory);

officesRouter.post('/saved-searches',officeController.getSearchHistory);

officesRouter.post('/toggle-favorite',officeController.toggleFavorite);

officesRouter.post('/getFavoriteHistory',officeController.getFavoriteHistory);

officesRouter.post('/getTotalPastOffice',officeController.get_total_past_Office);

officesRouter.post('/get_histo_data',officeController.get_histo_data_office);

officesRouter.post('/getOfficeDataPresentReport',officeController.get_Office_Data_Present_Report);

officesRouter.post('/getOfficePresentMetrics',officeController.get_Office_Present_Metrics);

officesRouter.post('/getOfficeNbrAgents',officeController.get_Office_NbrAgents);

officesRouter.post('/getGeoDataTot10',officeController.get_geo_data_tot10);

officesRouter.post('/getOfficeDataGeoReport',officeController.get_Office_Data_Geo_Report);

officesRouter.post('/getOfficeProduction',officeController.get_office_production);

officesRouter.post('/getOfficeRankingReport',officeController.get_Office_Ranking_Report);










module.exports = {
    officesRouter
};