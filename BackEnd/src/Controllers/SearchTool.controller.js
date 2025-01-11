const SearchToolService = require("../Services/SearchTool.service");

const SearchToolController = {};


SearchToolController.getAutoCompleteAgentId = async (req, res) => {
    try {
      const agentId = req.body.agentId; 

      const agentIdSuggest = await SearchToolService.getAutoCompleteAgentId(agentId);
  
      if (!agentIdSuggest) {
        return res.status(404).json({ message: 'Agent ID not found' });
      }
  
      res.status(200).json(agentIdSuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  SearchToolController.getAutoCompleteOffice = async (req, res) => {
    try {
      const office = req.body.office; 
      const agentId = req.body.agentId; 


      const officeSuggest = await SearchToolService.getAutoCompleteOffice(office,agentId);
  
      if (!officeSuggest) {
        return res.status(404).json({ message: 'Office  not found' });
      }
  
      res.status(200).json(officeSuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  SearchToolController.getAutoCompleteAddress = async (req, res) => {
    try {
      const address = req.body.address; 
      const agentId = req.body.agentId; 

      const addressSuggest = await SearchToolService.getAutoCompleteAddress(address,agentId);
  
      if (!addressSuggest) {
        return res.status(404).json({ message: 'Address  not found' });
      }
  
      res.status(200).json(addressSuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  SearchToolController.getAutoCompleteCity = async (req, res) => {
    try {
      const city = req.body.city; 
      const agentId = req.body.agentId; 


      const citySuggest = await SearchToolService.getAutoCompleteCity(city, agentId);
  
      if (!citySuggest) {
        return res.status(404).json({ message: 'City  not found' });
      }
  
      res.status(200).json(citySuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  SearchToolController.getSearchData = async (req, res) => {
    try {
      const agentId = req.body.agentId; 
      const office  = req.body.office; 
      const address = req.body.address; 
      const city    = req.body.city;


      const data = await SearchToolService.getSearchData(agentId, office, address, city);
  
      if (!data) {
        return res.status(404).json({ message: 'data  not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  //For saved search and favorite option
  SearchToolController.getSearchHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await SearchToolService.getSearchHistory(userId,savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  SearchToolController.toggleFavorite = async (req, res) => {
    const { userId, search } = req.body;
    console.log(search);
    try {
        await SearchToolService.toggleFavorite(search.idHistory, search.isFavorite);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error toggling favorite');
    }
  };

  SearchToolController.saveSearchHistory = async (req, res) => {
    const { userId, savedType, agentId,officeName, address, city } = req.body;
    try {
        await SearchToolService.saveSearchHistory(userId, savedType, agentId,officeName, address, city);
        res.sendStatus(200);
    } catch (err) {
        res.status(500).send('Error saving search history');
    }
  };

  SearchToolController.getFavoriteHistory = async (req, res) => {
    try {
      const userId = req.body.userId;
      const savedType = req.body.savedType;
      const data = await SearchToolService.getFavoriteHistory(userId, savedType);
  
      if (!data) {
        return res.status(404).json({ message: 'Result not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  
 

module.exports = SearchToolController;