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


  module.exports = TeamController;