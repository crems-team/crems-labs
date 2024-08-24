const express = require('express');

const agentsRouter = express.Router();

const agentController = require("../Controllers/Agent.controller");


agentsRouter.post('/getAgentInfos',agentController.findAgentById);

agentsRouter.get('/lastName?:term',agentController.getLastName);

agentsRouter.get('/firstName',agentController.getFirstName);

agentsRouter.post('/agentByName',agentController.getAgentByName);

agentsRouter.post('/getAgentHistoData',agentController.get_histo_data);

agentsRouter.post('/getTotalPast',agentController.get_total_past);

agentsRouter.post('/getTotalPresent',agentController.get_total_present);

agentsRouter.post('/getDataPresentReport',agentController.get_Data_Present_Report);

agentsRouter.post('/getTotalFuture',agentController.get_total_future);

agentsRouter.post('/getDataFutureReport',agentController.get_Data_Future_Report);

agentsRouter.post('/getGeoDataTot',agentController.get_geo_data_tot10);

agentsRouter.post('/getDataGeoReport',agentController.get_Data_Geo_Report);

agentsRouter.post('/getofficeproduction',agentController.get_office_production);

agentsRouter.post('/getOfficeRankingReport',agentController.get_Office_Ranking_Report);

agentsRouter.post('/getTeamData',agentController.get_team_data);

agentsRouter.post('/getTeamAgentsTable',agentController.get_team_agents_table);

agentsRouter.post('/getAgentTierPersona',agentController.get_agent_tier_persona);

agentsRouter.post('/saved-searches',agentController.getSearchHistory);

agentsRouter.post('/toggle-favorite',agentController.toggleFavorite);

agentsRouter.post('/save-search',agentController.saveSearchHistory);
//agentsRouter.post('/save-search',agentController.getSearchHistory);

agentsRouter.post('/getFavoriteHistory',agentController.getFavoriteHistory);









module.exports = {
    agentsRouter
};