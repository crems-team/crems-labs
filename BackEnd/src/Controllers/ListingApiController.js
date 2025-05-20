const listingService = require('../Services/listingsApiService');

const ListingApiController = {};

// Contrôleur pour mettre à jour les données
ListingApiController.updateData = async (req, res) => {

    const {
        authToken = 'HVJOXQNIVXKOGOBGLOWU', // Valeur par défaut pour authToken
        mlsSid,
        status = 'All',
        searchStr = 'All',
        searchBy = 'office',
        fromDate,
        toDate,
        recLimit
    } = req.body.criteria;

     const params = {
        authToken,
        mlsSid,
        status,
        searchStr,
        searchBy,
        fromDate,
        toDate,
        recLimit
    };

    try {
        const listings = await listingService.fetchDataFromAPI(params);
        await listingService.saveDataToDB(listings);
        res.json({ message: 'Data updated successfully from API' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update data' });
    }
}

// Contrôleur pour rechercher des listings
// ListingApiController.searchListings = async (req, res) => {
//      try {
    
//           const criteria = req.body.criteria;
//           const listings = await listingService.searchListings(criteria);
      
//           if (!listings) {
//             return res.status(404).json({ message: 'Result not found' });
//           }
      
//           res.status(200).json(listings);
//         } catch (error) {
//             console.log(error);
//           res.status(500).json({ message: 'Failed to search listings' });
//         }
// }
ListingApiController.searchListings = async (req, res) => {
     try {
        const { first, rows } = req.body.criteria;

        //   const criteria = req.body.criteria;
          const offset = parseInt(first);
          const limit  = parseInt(rows);
        //   const listings = await listingService.searchListings(criteria);
          const totalRecords = await listingService.getTotalRecords();
          const listings = await listingService.getListings(offset, limit);
          res.json({ listings, totalRecords });
      
          if (!listings) {
            return res.status(404).json({ message: 'Result not found' });
          }
      
          res.status(200).json(listings);
        } catch (error) {
            console.log(error);
          res.status(500).json({ message: 'Failed to search listings' });
        }
}

ListingApiController.getAutoCompleteOffice = async (req, res) => {
    try {
      const office = req.body.office; 

      const officeSuggest = await listingService.getAutoCompleteOffice(office);
  
      if (!officeSuggest) {
        return res.status(404).json({ message: 'Office  not found' });
      }
  
      res.status(200).json(officeSuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};

ListingApiController.getAutoCompleteAddress = async (req, res) => {
    try {
      const address = req.body.address; 

      const addressSuggest = await listingService.getAutoCompleteAddress(address);
  
      if (!addressSuggest) {
        return res.status(404).json({ message: 'Address  not found' });
      }
  
      res.status(200).json(addressSuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  ListingApiController.getAutoCompleteCity = async (req, res) => {
    try {
      const city = req.body.city; 

      const citySuggest = await listingService.getAutoCompleteCity(city);
  
      if (!citySuggest) {
        return res.status(404).json({ message: 'City  not found' });
      }
  
      res.status(200).json(citySuggest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  ListingApiController.getSearchData = async (req, res) => {
    try {
      const office  = req.body.office; 
      const address = req.body.address; 
      const city    = req.body.city;


      const data = await listingService.getSearchData(office, address, city);
  
      if (!data) {
        return res.status(404).json({ message: 'data  not found' });
      }
  
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  ListingApiController.getListingsTop1000 = async (req, res) => {
    try {
      const data = await listingService.getListingsTop1000();
      const count = await listingService.getListingsCount();

      if (!data && !count) {
        return res.status(404).json({ message: 'data  not found' });
      }
  
      res.status(200).json({ message: data.length+' records have been recovered from API and '+count[0].total+' records have been loaded', data });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


module.exports = ListingApiController;