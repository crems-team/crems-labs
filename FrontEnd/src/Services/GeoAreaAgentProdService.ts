import http from "../http-common";
import { api } from "../http-data";
import AgentGeoProdResult from "../Models/GeoAreaAgentProd/AgentGeoProdResult";
import TeamGeoProdResult from "../Models/GeoAreaAgentProd/TeamGeoProdResult";
import SelectedLocation from "../Models/GeoAreaAgentProd/SelectedLocation";
import AgentSearch from "../Models/GeoAreaAgentProd/AgentSearch";
import Zip from "../Models/Zip";
import {setTotalTransactions} from '../Redux/Slices/MapSlice'
import SearchItemArea from "../Models/SearchItemArea";
import Cities from "../Models/Cities";
import TeamInvestigationAgents from "../Models/TeamInvestigation/TeamInvestigationAgents";




export const getAgentGeoProduction = (selectedLocation: SelectedLocation) => {
  return api.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getAgentGeoProduction", { selectedLocation });
};

export const searchAgents = (selectedLocation: SelectedLocation, searchTerm: string ) => {
  return api.post<AgentSearch[]>("/geoAreaAgentProd/searchAgents", { selectedLocation, searchTerm });
};

export const getGeoProductionForAgent = (selectedLocation: SelectedLocation, agentId: string) => {
  return api.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getGeoProductionForAgent", { selectedLocation, agentId });
};

const getZipsbyCityName = (selectedLocation: SelectedLocation) => {
  return api.post<Zip[]>("/geoAreaAgentProd/getZipsbyCityName",{selectedLocation});
};

const fetchTransactionsGeoByAgent = (agentId: string) => {
  return api.post<Zip[]>("/geoAreaAgentProd/fetchTransactionsGeoByAgent",{agentId : agentId});
};

const getNumberOfAgent = (selectedLocation: SelectedLocation) => {
  return api.post<number>("/geoAreaAgentProd/getNumberOfAgent",{selectedLocation});
};

export const getAgentGeoProductionForExtraction = (selectedLocation: SelectedLocation) => {
  return api.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getAgentGeoProductionForExtraction", { selectedLocation });
};

const getTotalTransactionAgent = (selectedLocation: SelectedLocation) => {
  return api.post<number>("/geoAreaAgentProd/getTotalTransactionAgent",{selectedLocation});
};

const getTotalListingsAgent = (selectedLocation: SelectedLocation) => {
  return api.post<number>("/geoAreaAgentProd/getTotalListingsAgent",{selectedLocation});
};

export const getTeamGeoProduction = (selectedLocation: SelectedLocation) => {
  return api.post<TeamGeoProdResult[]>("/geoAreaTeamProd/getTeamGeoProduction", { selectedLocation });
};

const getAgentTeamTable = (data : {teamId : number}) => {
  return http.post<TeamInvestigationAgents[]>("/geoAreaTeamProd/getAgentTeamTable", {data:data});
};

//for saved search and favorite
const saveSearchHistory = (userId : string, savedType : string, city : string, zips : string, state : string, county : string) => {
  console.log('saveteam');
  console.log(savedType);
  return http.post("/geoAreaAgentProd/save-search", { userId, savedType, city, zips,state,county});
};

const toggleFavorite = (userId : string, city : string, zips : string,state : string, county : string, isFavorite : boolean) => {
  return http.post("/geoAreaAgentProd/toggle-favorite", { userId, search: { city, zips,state, county, isFavorite } });
};

const toggleFavoriteTeam = (userId : string, city : string, zips : string,state : string, county : string, isFavorite : boolean) => {
  return http.post("/geoAreaAgentProd/toggle-favoriteTeam", { userId, search: { city, zips,state, county, isFavorite } });
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemArea>("/geoAreaAgentProd/saved-searches",{userId, savedType});
};

const getSavedFavorite = (userId : string,savedType : string) => {
  return http.post<SearchItemArea[]>("/geoAreaAgentProd/getFavoriteHistory",{userId, savedType});
};

const getListingsGeoProduction = async (dispatch: any,selectedLocation: SelectedLocation): Promise<any[]> => {
  try {
    const response = await http.post<any>("/geoAreaAgentProd/getListingsGeoProduction",{selectedLocation});
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


const getTotalTransactionForListings = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getTotalTransactionForListings",{selectedLocation});
};

const getTotalAgentsListings = async (selectedLocation: SelectedLocation): Promise<any[]> => {
  try {
    const response = await http.post<any>("/geoAreaAgentProd/getTotalAgentsListings",{selectedLocation});
    const data = response.data;

    return data;

  } catch (err) {
    console.log(err);
    return [];
  }
};

const getTotalAgentForListing = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getTotalAgentForListing",{selectedLocation});
};

const deteteNonFavorite = (userId : string, savedType : string) => {
  return http.post("/geoAreaAgentProd/deteteNonFavorite", {userId, savedType});
};

const getCitiesByCountyFips = (countyFips : string | null) => {
  return http.post<Cities>("/geoAreaAgentProd/getCitiesByCountyFips",{countyFips : countyFips});
};

const getAllCities = () => {
  return http.post<any[]>("/geoAreaAgentProd/getAllCities");
};

const searchZip = (term : string | null) => {
  return http.post<any[]>("/geoAreaAgentProd/searchZip",{term : term});
};


const GeoAreaAgentProdService = {
    
  getAgentGeoProduction,
  searchAgents,
  getGeoProductionForAgent,
  getZipsbyCityName,
  fetchTransactionsGeoByAgent,
  getNumberOfAgent,
  getAgentGeoProductionForExtraction,
  getTotalTransactionAgent,
  getTotalListingsAgent,
  getListingsGeoProduction,
  getTotalTransactionForListings,
  getTotalAgentsListings,
  getTotalAgentForListing,
  saveSearchHistory,
  getSavedSearches,
  getSavedFavorite,
  toggleFavorite,
  deteteNonFavorite,
  getCitiesByCountyFips,
  getTeamGeoProduction,
  getAgentTeamTable,
  toggleFavoriteTeam,
  getAllCities,
  searchZip,
};

export default GeoAreaAgentProdService;