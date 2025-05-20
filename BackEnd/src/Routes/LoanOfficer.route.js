const express = require('express');

const LoanOfficerRouter = express.Router();

const LoanOfficerController = require("../Controllers/LoanOfficer.controller");


LoanOfficerRouter.post('/getNameLoanOfficer',LoanOfficerController.getNameLoanOfficer);

LoanOfficerRouter.post('/getAgentByName',LoanOfficerController.getAgentByName);

LoanOfficerRouter.post('/getSankeyData',LoanOfficerController.get_SankeyData);

LoanOfficerRouter.post('/getTotalAgents',LoanOfficerController.getTotalAgents);

LoanOfficerRouter.post('/findLoanOfficerById',LoanOfficerController.findLoanOfficerById);

LoanOfficerRouter.post('/getTotalSalesAndCapRate',LoanOfficerController.getTotalSalesAndCapRate);

LoanOfficerRouter.post('/save-search',LoanOfficerController.saveSearchHistory);

LoanOfficerRouter.post('/saved-searches',LoanOfficerController.getSearchHistory);

LoanOfficerRouter.post('/toggle-favorite',LoanOfficerController.toggleFavorite);

LoanOfficerRouter.post('/getFavoriteHistory',LoanOfficerController.getFavoriteHistory);

LoanOfficerRouter.post('/getAgentRankingLO',LoanOfficerController.get_agent_ranking_LO);

LoanOfficerRouter.post('/getOfficeNamesLo',LoanOfficerController.getOfficeNamesLo);

LoanOfficerRouter.post('/getDataLOWorkedWithAgent',LoanOfficerController.getDataLOWorkedWithAgent);










module.exports = {
    LoanOfficerRouter
};