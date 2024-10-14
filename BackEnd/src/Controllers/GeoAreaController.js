const GeoAreaService = require("../Services/GeoArea.service");

const GeoAreaController = {};



GeoAreaController.getStates = async (req, res) => {
    try {
      const data = await GeoAreaService.getStates();
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

GeoAreaController.getCounties = async (req, res) => {
    try {

      const stateCode = req.body.stateCode;
      const data = await GeoAreaService.getCounties(stateCode);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.getCities = async (req, res) => {
    try {

      const county = req.body.county;
      const data = await GeoAreaService.getCities(county);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.getZips = async (req, res) => {
    try {

      const city = req.body.city;
      const data = await GeoAreaService.getZips(city);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.getZipByCode = async (req, res) => {
    try {

      const code = req.body.code;
      const data = await GeoAreaService.getZipByCode(code);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.getCityById = async (req, res) => {
    try {

      const code = req.body.code;
      const data = await GeoAreaService.getCityById(code);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.getZipByCity = async (req, res) => {
    try {

      const city = req.body.city;
      const data = await GeoAreaService.getZipByCity(city);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.fetchTransactions = async (req, res) => {
    try {

      const zips = req.body.zips;
      const nbrMonth = req.body.nbrMonth;
      
      const data = await GeoAreaService.fetchTransactions(zips,nbrMonth);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.fetchTransactionsGeo = async (req, res) => {
    try {

      const zips = req.body.zips;
      const nbrMonth = req.body.nbrMonth;
      const decodedparam = decodeURIComponent(zips).split(",").join("','");

      const data = await GeoAreaService.fetchTransactionsGeo(decodedparam,nbrMonth);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //Search history and favorite
  GeoAreaController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, city, zips,state,county,nbrMonth } = req.body;
    console.log(zips);
    try {
        await GeoAreaService.saveSearchHistory(userId, savedType, city, zips,state,county,nbrMonth);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error saving search history');
    }
  };

  GeoAreaController.getSearchHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await GeoAreaService.getSearchHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.toggleFavorite = async (req, res) => {
    const { userId, search } = req.body;
    try {
        await GeoAreaService.toggleFavorite(userId, search.city, search.zips,search.state,search.county,search.nbrMonth, search.isFavorite);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error toggling favorite');
    }
  };

  GeoAreaController.getFavoriteHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await GeoAreaService.getFavoriteHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };
 
  GeoAreaController.fetchTransactionsGeoByAgent = async (req, res) => {
    try {
      const agentId = req.body.agentId;
      const nbrMonth = req.body.nbrMonth;
      //const decodedparam = decodeURIComponent(zips).split(",").join("','");

      const data = await GeoAreaService.fetchTransactionsGeoByAgent(agentId,nbrMonth);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.GetTotalTransactions = async (req, res) => {
    try {

      const zips = req.body.zips;
      const nbrMonth = req.body.nbrMonth;
      const data = await GeoAreaService.GetTotalTransactions(zips,nbrMonth);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaController.GetTotalAgents = async (req, res) => {
    try {

      const zips = req.body.zips;
      const nbrMonth = req.body.nbrMonth;
      console.log(nbrMonth);
      console.log(zips);
      const data = await GeoAreaService.GetTotalAgents(zips,nbrMonth);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
        console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = GeoAreaController;