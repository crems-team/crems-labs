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
  //Search history
  OfficeController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, officeName, officeId } = req.body;
    try {
        await OfficeService.saveSearchHistory(userId, savedType, officeName, officeId);
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

module.exports = OfficeController;