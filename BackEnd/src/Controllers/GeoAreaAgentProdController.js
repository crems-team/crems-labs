const GeoAreaAgentProdService = require("../Services/GeoAreaAgentProd.service");

const GeoAreaAgentProdController = {};

GeoAreaAgentProdController.getAgentGeoProduction = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;

      console.log(selectedLocation);
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getAgentGeoProduction(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.searchAgents = async (req, res) => {
    try {
      const selectedLocation = req.body.selectedLocation;
      const searchTerm = req.body.searchTerm;
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.searchAgents(selectedLocation, searchTerm);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getGeoProductionForAgent = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      const agentId = req.body.agentId;

      console.log(agentId);

      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getGeoProductionForAgent(selectedLocation, agentId);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agent found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getZipsbyCityName = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      console.log(selectedLocation);
      if (!selectedLocation?.county || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'County and city are required' });
      }

      const data = await GeoAreaAgentProdService.getZipsbyCityName(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.fetchTransactionsGeoByAgent = async (req, res) => {
      try {
        const agentId = req.body.agentId;
        //const nbrMonth = req.body.nbrMonth;
        //const decodedparam = decodeURIComponent(zips).split(",").join("','");
  
        const data = await GeoAreaAgentProdService.fetchTransactionsGeoByAgent(agentId);
    
        if (!data) {
          return res.status(404).json({ message: 'Result not found' });
        }
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    };

  GeoAreaAgentProdController.getNumberOfAgent = async (req, res) => {
      try {
  
        const selectedLocation = req.body.selectedLocation;
  
        console.log(selectedLocation);
        
        if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
          return res.status(400).json({ message: 'state and city are required' });
        }
  
        const data = await GeoAreaAgentProdService.getNumberOfAgent(selectedLocation);
    
        if (!data || data.length === 0) {
          return res.status(404).json({ message: 'No agents found for this location' });
        }
    
        res.status(200).json(data);
      } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
      }
    };

  GeoAreaAgentProdController.getAgentGeoProductionForExtraction = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;

      console.log(selectedLocation);
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getAgentGeoProductionForExtraction(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getTotalTransaction = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getTotalTransaction(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

   GeoAreaAgentProdController.getTotalListings = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getTotalListings(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getListingsGeoProduction = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;

      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getListingsGeoProduction(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getTotalTransactionsListings = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getTotalTransactionsListings(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  GeoAreaAgentProdController.getTotalAgentsListings = async (req, res) => {
    try {

      const selectedLocation = req.body.selectedLocation;
      
      if (!selectedLocation?.stateCode || !selectedLocation?.city?.length) {
        return res.status(400).json({ message: 'state and city are required' });
      }

      const data = await GeoAreaAgentProdService.getTotalAgentsListings(selectedLocation);
  
      if (!data || data.length === 0) {
        return res.status(404).json({ message: 'No agents found for this location' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

module.exports = GeoAreaAgentProdController;