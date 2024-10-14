import http from "../http-common";
import States from "../Models/States";
import Counties from "../Models/Counties";
import Cities from "../Models/Cities";
import Zip from "../Models/Zip";
import CityCoordinates from "../Models/CityCoordinates";
import { zip } from "lodash";
import SearchItemArea from "../Models/SearchItemArea";
import {setTotalTransactions} from '../Redux/Slices/MapSlice'




const getStates = () => {
  return http.post<States>("/geoArea/getStates");
};

const getCounties = (stateCode : string | null) => {
    return http.post<Counties>("/geoArea/getCounties",{stateCode : stateCode});
};

const getCities = (county : number | null) => {
    return http.post<Cities>("/geoArea/getCities",{county : county});
};

const getZips = (code : number | null) => {
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

const fetchTransactions = async (dispatch: any,zips: string,nbrMonth : number): Promise<any[]> => {
    try {
      const param = encodeURIComponent(zips);
      const response = await http.post<any>("/geoArea/fetchTransactions",{zips : zips,nbrMonth : nbrMonth});
      const data = response.data;
      
      let cumulativeTotal = 0;

  
      data.forEach((obj: any) => {
        for (let key in obj) {
          if (obj[key] === null || obj[key] === '') {
            obj[key] = 0;
          }
        }
        obj.total = parseInt(obj.listings, 10) + parseInt(obj.selling, 10);
        cumulativeTotal += obj.total; // Update cumulative total

      });
      dispatch(setTotalTransactions(cumulativeTotal));
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
const saveSearchHistory = (userId : string, savedType : string, city : string, zips : string, state : string, county : string,nbrMonth:number) => {
    return http.post("/geoArea/save-search", { userId, savedType, city, zips,state,county,nbrMonth });
  };

  const toggleFavorite = (userId : string, city : string, zips : string,state : string, county : string,nbrMonth : number, isFavorite : boolean) => {
    return http.post("/geoArea/toggle-favorite", { userId, search: { city, zips,state, county,nbrMonth, isFavorite } });
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

const GetTotalTransactions = async (zips: string,nbrMonth : number): Promise<any[]> => {
  try {
    const param = encodeURIComponent(zips);
    const response = await http.post<any>("/geoArea/GetTotalTransactions",{zips : zips,nbrMonth : nbrMonth});
    const data = response.data;

    return data;

  } catch (err) {
    console.log(err);
    return [];
  }
};

const GetTotalAgents = async (zips: string,nbrMonth : number): Promise<any[]> => {
  try {
    const param = encodeURIComponent(zips);
    const response = await http.post<any>("/geoArea/GetTotalAgents",{zips : zips,nbrMonth : nbrMonth});
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
    fetchTransactionsGeoByAgent,
    GetTotalTransactions,
    GetTotalAgents
};

export default GeoAreaService;