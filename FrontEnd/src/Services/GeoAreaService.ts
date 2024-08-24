import http from "../http-common";
import States from "../Models/States";
import Counties from "../Models/Counties";
import Cities from "../Models/Cities";
import Zip from "../Models/Zip";
import CityCoordinates from "../Models/CityCoordinates";
import { zip } from "lodash";
import SearchItemArea from "../Models/SearchItemArea";







const getStates = () => {
  return http.post<States>("/geoArea/getStates");
};

const getCounties = (stateCode : string) => {
    return http.post<Counties>("/geoArea/getCounties",{stateCode : stateCode});
};

const getCities = (county : number) => {
    return http.post<Cities>("/geoArea/getCities",{county : county});
};

const getZips = (code : number) => {
    return http.post<Zip>("/geoArea/getZips",{city : code});
};

const getZipByCode = (code : string) => {
    return http.post<Zip>("/geoArea/getZipByCode",{code : code});
};

const getCityById = (code : number) => {
    return http.post<CityCoordinates>("/geoArea/getCityById",{code : code});
};

const getZipByCity = (city : number) => {
    return http.post<Zip>("/geoArea/getZipByCity",{city : city});
};

const fetchTransactions = async (zips: string,nbrMonth : number): Promise<any[]> => {
    try {
      const param = encodeURIComponent(zips);
      const response = await http.post<any>("/geoArea/fetchTransactions",{zips : zips,nbrMonth : nbrMonth});
      const data = response.data;
      
  
      data.forEach((obj: any) => {
        for (let key in obj) {
          if (obj[key] === null || obj[key] === '') {
            obj[key] = 0;
          }
        }
        obj.total = parseInt(obj.listings, 10) + parseInt(obj.selling, 10);
      });
      console.log(data);
      return data;

    } catch (err) {
      console.log(err);
      return [];
    }
  };

 
  
const fetchTransactionsGeo = async (zips: string, nbrMonth : number): Promise<any[]> => {
    try {
      const param = encodeURIComponent(zips);
      const response = await http.post<any>("/geoArea/fetchTransactionsGeo",{zips : zips,nbrMonth : nbrMonth});
      const data = response.data;
      
      return data;

    } catch (err) {
      console.log(err);
      return [];
    }
  };

  //for saved search and favorite
const saveSearchHistory = (userId : string, savedType : string, city : string, zips : string) => {
    return http.post("/geoArea/save-search", { userId, savedType, city, zips });
  };
  
  const toggleFavorite = (userId : string, city : string, zips : string, isFavorite : boolean) => {
    return http.post("/geoArea/toggle-favorite", { userId, search: { city, zips, isFavorite } });
  };
  
  const getSavedSearches = (userId : string, savedType : string) => {
    return http.post<SearchItemArea>("/geoArea/saved-searches",{userId, savedType});
  };
  
  const getSavedFavorite = (userId : string,savedType : string) => {
    return http.post<SearchItemArea>("/geoArea/getFavoriteHistory",{userId, savedType});
  };

const fetchTransactionsGeoByAgent = async (agentId: string, nbrMonth : number): Promise<any[]> => {
    try {
      //const param = encodeURIComponent(zips);
      const response = await http.post<any>("/geoArea/fetchTransactionsGeoByAgent",{agentId : agentId,nbrMonth : nbrMonth});
      const data = response.data;
      
      return data;

    } catch (err) {
      console.log(err);
      return [];
    }
  };

const GeoAreaService = {
    
    getStates,
    getCounties,
    getCities,
    getZips,
    getZipByCode,
    getCityById,
    getZipByCity,
    fetchTransactions,
    fetchTransactionsGeo,
    saveSearchHistory,
    getSavedSearches,
    toggleFavorite,
    getSavedFavorite,
    fetchTransactionsGeoByAgent
};

export default GeoAreaService;