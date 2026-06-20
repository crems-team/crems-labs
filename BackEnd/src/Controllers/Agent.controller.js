const AgentService = require("../Services/Agent.service");
const catchAsync = require('../Utils/CatchAsync');

const agentController = {};

agentController.findAgentById = catchAsync(async (req, res, next) => {
 
  const agent = await AgentService.findAgentById(req.body.id);

  res.status(200).json(//{
    // status: 'success',
    // data: {
      [agent]
    // },
 // }
);
});

 agentController.getAgentByName =catchAsync(async (req, res, next) => {
    
      const agent = await AgentService.getAgentByName(req.body.term);
  
      res.status(200).json(//{
        // status: 'success',
        // data: {
          agent
        // },
     // }
    );
  });

agentController.get_histo_data = catchAsync(async (req, res, next)  => {
    
      const agent = await AgentService.get_histo_data(req.body.id);
  
      res.status(200).json(//{
        // status: 'success',
        // data: {
          agent
        // },
     // }
    );
  });

agentController.get_total_past = catchAsync(async (req, res, next) => {
      const agent = await AgentService.get_total_past(req.body.id);
  
      res.status(200).json(//{
        // status: 'success',
        // data: {
          agent
        // },
     // }
    );
  });

agentController.get_total_present = catchAsync(async (req, res, next) => {
    const totalPresent = await AgentService.get_total_present(req.body.id);
    res.status(200).json(totalPresent);
});


agentController.get_Data_Present_Report = catchAsync(async (req, res, next) => {
    const reportData = await AgentService.get_Data_Present_Report(req.body.id);
    res.status(200).json(reportData);

});


agentController.get_total_future = catchAsync(async (req, res, next) => {
    const totalFuture = await AgentService.get_total_future(req.body.id);
    res.status(200).json(totalFuture);

});


agentController.get_Data_Future_Report = catchAsync(async (req, res, next) => {
    const futureReport = await AgentService.get_Data_Future_Report(req.body.id);
    res.status(200).json(futureReport);

});


agentController.get_geo_data_tot10 = catchAsync(async (req, res, next) => {
    const geoData = await AgentService.get_geo_data_tot10(req.body.id);
    res.status(200).json(geoData);

});


agentController.get_Data_Geo_Report = catchAsync(async (req, res, next) => {
    const geoReport = await AgentService.get_Data_Geo_Report(req.body.id);
    res.status(200).json(geoReport);

});


agentController.get_office_production = catchAsync(async (req, res, next) => {
    const { id, officeId } = req.body;
    const officeProduction = await AgentService.get_office_production(id, officeId);
    res.status(200).json(officeProduction);

});


agentController.get_Office_Ranking_Report = catchAsync(async (req, res, next) => {
    const { id, officeId } = req.body;
    const rankingReport = await AgentService.get_Office_Ranking_Report(id, officeId);
    res.status(200).json(rankingReport);

});


agentController.get_team_data = catchAsync(async (req, res, next) => {
    const teamData = await AgentService.get_team_data(req.body.id);
    res.status(200).json(teamData);

});


agentController.get_team_agents_table = catchAsync(async (req, res, next) => {
    const teamTable = await AgentService.get_team_agents_table(req.body.id);
    res.status(200).json(teamTable);

});


agentController.get_agent_tier_persona = catchAsync(async (req, res, next) => {
    const tierPersona = await AgentService.get_agent_tier_persona(req.body.id);
    res.status(200).json(tierPersona);

});

 //For saved search and favorite option

agentController.saveSearchHistory = catchAsync(async (req, res, next) => {
    const { userId, savedType, fullName, agentIdC, state } = req.body;
    await AgentService.saveSearchHistory(userId, savedType, fullName, agentIdC, state);
    res.sendStatus(201);

});

 
agentController.getSearchHistory = catchAsync(async (req, res, next) => {
    const { userId, savedType } = req.body;
    const history = await AgentService.getSearchHistory(userId, savedType);
    res.status(200).json(history);

});


agentController.getFavoriteHistory = catchAsync(async (req, res, next) => {
    const { userId, savedType } = req.body;
    const favorites = await AgentService.getFavoriteHistory(userId, savedType);
    res.status(200).json(favorites);

});


agentController.toggleFavorite = catchAsync(async (req, res, next) => {
  const { search } = req.body;
  await AgentService.toggleFavorite(search.agentId, search.isFavorite);
    res.sendStatus(200);

});


agentController.deteteNonFavorite = catchAsync(async (req, res, next) => {
    const { userId, savedType } = req.body;
    await AgentService.deteteNonFavorite(userId, savedType);
    res.sendStatus(204);

});

module.exports = agentController;