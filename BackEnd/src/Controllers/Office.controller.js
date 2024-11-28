const OfficeService = require("../Services/Office.service");


const OfficeController = {};

OfficeController.getCity = async (req, res) => {
    try {
      const term = req.query.term; 

      const city = await OfficeService.getCity(term);
  
      if (!city) {
        return res.status(404).json({ message: 'City not found' });
      }
  
      res.status(200).json(city);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.getOfficeByCity = async (req, res) => {
    try {
      const officeName = req.query.term; 
      const city  = req.query.city; 
  
      const ofiicesSugges = await OfficeService.getOfficeByCity(city,officeName);
  
      if (!ofiicesSugges) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(ofiicesSugges);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.getAgentsByOffice = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const data = await OfficeService.getAgentByOffice(officeId);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  OfficeController.findOfficeById = async (req, res) => {
    try {
      const agentId = req.body.id; 
      const office = await OfficeService.findOfficeById(agentId);
  
      if (!office) {
        return res.status(404).json({ message: 'Agent not found' });
      }
  
      res.status(200).json(office);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  //Search history
  OfficeController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, officeName, officeId, officeState } = req.body;
    try {
        await OfficeService.saveSearchHistory(userId, savedType, officeName, officeId, officeState);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error saving search history');
    }
  };

  OfficeController.getSearchHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await OfficeService.getSearchHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.toggleFavorite = async (req, res) => {
    const { userId, search } = req.body;
    try {
        await OfficeService.toggleFavorite(userId, search.officeName, search.officeId, search.isFavorite);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error toggling favorite');
    }
  };

  OfficeController.getFavoriteHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await OfficeService.getFavoriteHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_total_past_Office = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_total_past_Office(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_histo_data_office = async (req, res) => {
    try {
      const officeId = req.body.id; 
      if (!officeId) {
        return res.status(404).json({ message: 'Office ID null' });
      }
      const officeData = await OfficeService.get_histo_data(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office data not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_Office_Data_Present_Report = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_Office_Data_Present_Report(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_Office_Present_Metrics = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_Office_Present_Metrics(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_Office_NbrAgents = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const nbrAgents = await OfficeService.get_Office_NbrAgents(officeId);
  
      if (!nbrAgents) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(nbrAgents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_geo_data_tot10 = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_geo_data_tot10(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_Office_Data_Geo_Report = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_Office_Data_Geo_Report(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_office_production = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_office_production(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  OfficeController.get_Office_Ranking_Report = async (req, res) => {
    try {
      const officeId = req.body.id; 
      const officeData = await OfficeService.get_Office_Ranking_Report(officeId);
  
      if (!officeData) {
        return res.status(404).json({ message: 'Office not found' });
      }
  
      res.status(200).json(officeData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = OfficeController;