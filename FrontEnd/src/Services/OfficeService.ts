import http from "../http-common";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import AgentOfficeData from "../Models/AgentOfficeData";
import SearchItemOffice from "../Models/SearchItemOffice";
import OfficeInfos from "../Models/OfficeInfos";
import OfficeTotalPast from "../Models/Office/OfficeTotalPast";
import OfficeDataPresentRep from "../Models/Office/OfficeDataPresentRep";
import OfficeGeoDataReport from "../Models/Office/OfficeGeoDataReport";
import OfficeProductionMetrics from "../Models/Office/OfficeProductionMetrics";
import AgentRanking from '../Models/AgentRanking';
import OfficeTopCities from "../Models/Office/OfficeTopCities";







const getAgentsByOffice = (dataReq:AgentInfosRequest ) => {
  return http.post<AgentOfficeData>("/office/getAgentsByOffice", dataReq);
  };

  const getOfficeInfos = (data : AgentInfosRequest) => {
    return http.post<OfficeInfos>("/office/getOfficeInfos", data);
    };

//for saved search and favorite
const saveSearchHistory = (userId : string, savedType : string, officeName : string, officeId : string, officeState : string) => {
  return http.post("/office/save-search", { userId, savedType, officeName, officeId, officeState });
};

const toggleFavorite = (userId : string, officeName : string, officeId : string, isFavorite : boolean) => {
  return http.post("/office/toggle-favorite", { userId, search: { officeName, officeId, isFavorite } });
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemOffice>("/office/saved-searches",{userId, savedType});
};

const getSavedFavorite = (userId : string,savedType : string) => {
  return http.post<SearchItemOffice>("/office/getFavoriteHistory",{userId, savedType});
};

const getTotalPastOffice = (data : {id:string}) => {
  return http.post<OfficeTotalPast>("/office/getTotalPastOffice", data);
  };

const getOfficeHistoData = (data : {id:string}) => {

  return http.post<string[][]>("/office/get_histo_data", data);
  };

const getOfficeDataPresentReport = (data : AgentInfosRequest) => {

  return http.post<OfficeDataPresentRep>("/office/getOfficeDataPresentReport", data);
  };

const getOfficePresentMetrics = (data : {id:string}) => {

  return http.post<string[][]>("/office/getOfficePresentMetrics", data);
  };

const getOfficeNbrAgents = (data : {id:string}) => {

    return http.post<number>("/office/getOfficeNbrAgents", data);
};

const getGeoDataTot10 = (data : {id:string}) => {

  return http.post<number>("/office/getGeoDataTot10", data);
};

const getOfficeDataGeoReport = (data: {id:string} ) => {
  return http.post<OfficeGeoDataReport>("/office/getOfficeDataGeoReport", data);
  };

const getOfficeProduction = (data: {id:string} ) => {
    return http.post<OfficeProductionMetrics>("/office/getOfficeProduction", data);
    };

const getOfficeRankingReport = (data:{id:string} ) => {
  return http.post<AgentRanking>("/office/getOfficeRankingReport", data);
  };

const getOfficeTopCities = (data:{id:string} ) => {
    return http.post<OfficeTopCities>("/office/getOfficeTopCities", data);
    };
const OfficeService = {
    
  getAgentsByOffice,
  getOfficeInfos,
  saveSearchHistory,
  getSavedSearches,
  toggleFavorite,
  getSavedFavorite,
  getOfficeHistoData,
  getTotalPastOffice,
  getOfficeDataPresentReport,
  getOfficePresentMetrics,
  getOfficeNbrAgents,
  getGeoDataTot10,
  getOfficeDataGeoReport,
  getOfficeProduction,
  getOfficeRankingReport,
  getOfficeTopCities
};

export default OfficeService;