const AgentService = require("../Services/Agent.service");

const agentController = {};

agentController.findAgentById = async (req, res) => {
  try {
    const agentId = req.body.id; 
    const agent = await AgentService.findAgentById(agentId);

    if (!agent) {
      return res.status(404).json({ message: 'Agent not found' });
    }

    res.status(200).json(agent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

agentController.getLastName = async (req, res) => {
    try {
      const term = req.query.term; 

      const lastName = await AgentService.getLastName(term);
  
      if (!lastName) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(lastName);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.getFirstName = async (req, res) => {
    try {
      const firstName = req.query.term; 
      const lastName  = req.query.lastName; 
      console.log(firstName);
      console.log(lastName);


      const firstNameSugges = await AgentService.getFirstName(lastName,firstName);
  
      if (!firstNameSugges) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(firstNameSugges);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.getAgentByName = async (req, res) => {
    try {
      const firstName = req.body.firstName; 
      const lastName  = req.body.lastName; 
      console.log(firstName);
      console.log(lastName);


      const agent = await AgentService.getAgentByName(lastName,firstName);
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  agentController.get_histo_data = async (req, res) => {
    try {
      const agentId = req.body.id; 
      console.log(agentId);
      if (!agentId) {
        return res.status(404).json({ message: 'Agent ID null' });
      }
      const agent = await AgentService.get_histo_data(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_total_past = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const agent = await AgentService.get_total_past(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_total_present = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const agent = await AgentService.get_total_present(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_Data_Present_Report = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const agent = await AgentService.get_Data_Present_Report(agentId);
  
      if (!agent) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(agent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_total_future = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_total_future(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_Data_Future_Report = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_Data_Future_Report(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_geo_data_tot10 = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_geo_data_tot10(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_Data_Geo_Report = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_Data_Geo_Report(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_agent_ranking = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const officeId = req.body.officeId;
      const data = await AgentService.get_agent_ranking(agentId,officeId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_office_production = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const officeId = req.body.officeId;
      const data = await AgentService.get_office_production(agentId,officeId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_Office_Ranking_Report = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const officeId = req.body.officeId;
      const data = await AgentService.get_Office_Ranking_Report(agentId,officeId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  agentController.get_team_data = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_team_data(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_team_agents_table = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_team_agents_table(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.get_agent_tier_persona = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const data = await AgentService.get_agent_tier_persona(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 //For saved search and favorite option
  agentController.getSearchHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await AgentService.getSearchHistory(userId,savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  agentController.toggleFavorite = async (req, res) => {
    const { userId, search } = req.body;
    try {
        await AgentService.toggleFavorite(userId, search.firstName, search.lastName, search.isFavorite);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error toggling favorite');
    }
  };

  agentController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, firstName, lastName, agentIdC } = req.body;
    try {
        await AgentService.saveSearchHistory(userId, savedType, firstName, lastName, agentIdC);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error saving search history');
    }
  };

  agentController.getFavoriteHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await AgentService.getFavoriteHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 

module.exports = agentController;