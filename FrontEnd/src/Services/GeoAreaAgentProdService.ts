import http from "../http-common";
import AgentGeoProdResult from "../Models/GeoAreaAgentProd/AgentGeoProdResult";
import SelectedLocation from "../Models/GeoAreaAgentProd/SelectedLocation";
import AgentSearch from "../Models/GeoAreaAgentProd/AgentSearch";
import Zip from "../Models/Zip";
import {setTotalTransactions} from '../Redux/Slices/MapSlice'




export const getAgentGeoProduction = (selectedLocation: SelectedLocation) => {
  return http.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getAgentGeoProduction", { selectedLocation });
};

export const searchAgents = (selectedLocation: SelectedLocation, searchTerm: string ) => {
  return http.post<AgentSearch[]>("/geoAreaAgentProd/searchAgents", { selectedLocation, searchTerm });
};

export const getGeoProductionForAgent = (selectedLocation: SelectedLocation, agentId: string) => {
  return http.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getGeoProductionForAgent", { selectedLocation, agentId });
};

const getZipsbyCityName = (selectedLocation: SelectedLocation) => {
  return http.post<Zip[]>("/geoAreaAgentProd/getZipsbyCityName",{selectedLocation});
};

const fetchTransactionsGeoByAgent = (agentId: string) => {
  return http.post<Zip[]>("/geoAreaAgentProd/fetchTransactionsGeoByAgent",{agentId : agentId});
};

const getNumberOfAgent = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getNumberOfAgent",{selectedLocation});
};

export const getAgentGeoProductionForExtraction = (selectedLocation: SelectedLocation) => {
  return http.post<AgentGeoProdResult[]>("/geoAreaAgentProd/getAgentGeoProductionForExtraction", { selectedLocation });
};

const getTotalTransaction = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getTotalTransaction",{selectedLocation});
};

const getTotalListings = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getTotalListings",{selectedLocation});
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


const getTotalTransactionsListings = (selectedLocation: SelectedLocation) => {
  return http.post<number>("/geoAreaAgentProd/getTotalTransactionsListings",{selectedLocation});
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

const GeoAreaAgentProdService = {
    
  getAgentGeoProduction,
  searchAgents,
  getGeoProductionForAgent,
  getZipsbyCityName,
  fetchTransactionsGeoByAgent,
  getNumberOfAgent,
  getAgentGeoProductionForExtraction,
  getTotalTransaction,
  getTotalListings,
  getListingsGeoProduction,
  getTotalTransactionsListings,
  getTotalAgentsListings
};

export default GeoAreaAgentProdService;