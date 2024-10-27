const TeamService = require("../Services/Team.service");

const TeamController = {};

TeamController.getTeam = async (req, res) => {
    try {
        
      const agentId = req.body.id; 

      const team = await TeamService.getTeam(agentId);
  
      if (!team) {
        return res.status(404).json({ message: 'team not found' });
      }
  
      res.status(200).json(team);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

TeamController.getTeamSecondLevel = async (req, res) => {
  try {
      
    const agentId = req.body.id; 

    const team = await TeamService.getTeamSecondLevel(agentId);

    if (!team) {
      return res.status(404).json({ message: 'team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

TeamController.getTeamByFilter = async (req, res) => {
  try {
      
    const agentId = req.body.data.id; 
    const filterCriteria = req.body.filterCriteria;

console.log(agentId);
console.log( req.body);
    const team = await TeamService.getTeamByFilter(agentId,filterCriteria);

    if (!team) {
      return res.status(404).json({ message: 'team not found' });
    }

    res.status(200).json(team);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


  module.exports = TeamController;