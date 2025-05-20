const LoanOfficerService = require("../Services/LoanOfficer.service");

const LoanOfficerController = {};

LoanOfficerController.findLoanOfficerById = async (req, res) => {
  try {
    const id = req.body.id; 
    const officer = await LoanOfficerService.findLoanOfficerById(id);

    if (!officer) {
      return res.status(404).json({ message: 'officer not found' });
    }

    res.status(200).json(officer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

LoanOfficerController.getNameLoanOfficer = async (req, res) => {
    try {
      const term = req.body.term; 

      const data = await LoanOfficerService.getNameLoanOfficer(term);
  
      if (!data) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

 

  LoanOfficerController.getAgentByName = async (req, res) => {
    try {
      const name = req.body.name; 

      const loanOfficer = await LoanOfficerService.getAgentByName(name);
  
      if (!loanOfficer) {
        return res.status(404).json({ message: 'loanOfficer not found' });
      }
  
      res.status(200).json(loanOfficer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.get_SankeyData = async (req, res) => {
    try {
      const agentId = req.body.officerId; 

      const data = await LoanOfficerService.get_SankeyData(agentId);
  
      if (!data) {
        return res.status(404).json({ message: 'data not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.getTotalAgents = async (req, res) => {
    try {
      const officerId = req.body.id; 

      const data = await LoanOfficerService.getTotalAgents(officerId);
  
      if (!data) {
        return res.status(404).json({ message: 'data not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
//
LoanOfficerController.getTotalSalesAndCapRate = async (req, res) => {
  try {
    const officerId = req.body.id; 

    const data = await LoanOfficerService.getTotalSalesAndCapRate(officerId);

    if (!data) {
      return res.status(404).json({ message: 'data not found' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
  
//  //For saved search and favorite option
LoanOfficerController.getSearchHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await LoanOfficerService.getSearchHistory(userId,savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.toggleFavorite = async (req, res) => {
      const { userId, search } = req.body;
      try {
          await LoanOfficerService.toggleFavorite(search.idHistory, search.isFavorite);
          res.sendStatus(200);
      } catch (err) {
          res.status(500).send('Error toggling favorite');
      }
    };

  LoanOfficerController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, officerName, officerId } = req.body;
    // console.log(userId);
    // console.log(savedType);
    // console.log(officerName);
    // console.log(officerId); 
    try {
        await LoanOfficerService.saveSearchHistory(userId, savedType, officerName, officerId);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error saving search history');
    }
  };

  LoanOfficerController.getFavoriteHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await LoanOfficerService.getFavoriteHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.get_agent_ranking_LO = async (req, res) => {
    try {
      const{idOfficer,idAgent,officeId} =req.body;

      const data = await LoanOfficerService.get_agent_ranking_LO(idOfficer,idAgent,officeId);
  
      if (!data) {
        return res.status(404).json({ message: 'data not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.getOfficeNamesLo = async (req, res) => {
    try {
      const officerId = req.body.id;
      const data = await LoanOfficerService.getOfficeNamesLo(officerId);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  LoanOfficerController.getDataLOWorkedWithAgent = async (req, res) => {
    try {
      const idAgent =req.body.idAgent;

      const data = await LoanOfficerService.getDataLOWorkedWithAgent(idAgent);
  
      if (!data) {
        return res.status(404).json({ message: 'data not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 

module.exports = LoanOfficerController;