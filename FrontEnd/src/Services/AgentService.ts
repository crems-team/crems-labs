import http from "../http-common";
import AgentNameRequest from "../Models/AgentNameRequest";
import AgentModel from "../Models/AgentModel";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import AgentInfos from "../Models/AgentInfos";
import AgentTotalPast from '../Models/AgentTotalPast';
import DataPresentRep from '../Models/DataPresentRep';
import FutureMetrics from '../Models/FutureMetrics';
import DataFutureRep from '../Models/DataFutureRep';
import GeoDataTot from '../Models/GeoDataTot';
import GeoDataReport from '../Models/GeoDataReport';
import OfficeProd from '../Models/OfficeProd';
import AgentRanking from '../Models/AgentRanking';
import TeamData from '../Models/TeamData';
import TeamAgentsTable from '../Models/TeamAgentsTable';
import AgentTierPersona from '../Models/AgentTierPersona';







interface dataReqAgentRank {
  id: string;
  officeId : string
}
interface SearchItem {
  savedType : string;
  firstName : string;
  lastName  : string;
  isFavorite: boolean;
  agentIdC : string;

}

const getAgent = (data : AgentNameRequest) => {
  return http.post<AgentModel>("/search/agentByName", data);
};

const getAgentInfos = (data : AgentInfosRequest) => {
return http.post<AgentInfos>("/search/getAgentInfos", data);
};

const getTotalPast = (data : AgentInfosRequest) => {
return http.post<AgentTotalPast>("/search/getTotalPast", data);
};

const getAgentHistoData = (data : AgentInfosRequest) => {

return http.post<string[][]>("/search/getAgentHistoData", data);
};

const getTotalPresent = (data : AgentInfosRequest) => {

return http.post<string[][]>("/search/getTotalPresent", data);
};

const getDataPresentReport = (data : AgentInfosRequest) => {

return http.post<DataPresentRep>("/search/getDataPresentReport", data);
};

const getTotalFuture = (data : AgentInfosRequest) => {

return http.post<FutureMetrics>("/search/getTotalFuture", data);
};

const getDataFutureReport = (data : AgentInfosRequest) => {
return http.post<DataFutureRep>("/search/getDataFutureReport", data);
};

const getGeoDataTot = (data : AgentInfosRequest) => {
return http.post<GeoDataTot>("/search/getGeoDataTot", data);
};

const getDataGeoReport = (data:AgentInfosRequest ) => {
return http.post<GeoDataReport>("/search/getDataGeoReport", data);
};

const getofficeproduction = (dataReq:dataReqAgentRank ) => {
  return http.post<OfficeProd>("/search/getofficeproduction", dataReq);
  };

const getOfficeRankingReport = (dataReq:dataReqAgentRank ) => {
  return http.post<AgentRanking>("/search/getOfficeRankingReport", dataReq);
  };

const getTeamData = (data:AgentInfosRequest ) => {
  return http.post<TeamData>("/search/getTeamData", data);
  };


const getTeamAgentsTable = (data : AgentInfosRequest) => {
  return http.post<TeamAgentsTable>("/search/getTeamAgentsTable", data);
};

const getAgentTierPersona = (data : AgentInfosRequest) => {
  return http.post<AgentTierPersona>("/search/getAgentTierPersona", data);
};

//for saved search and l
const saveSearchHistory = (userId : string, savedType : string, firstName : string, lastName : string, agentIdC : string) => {
  return http.post("/search/save-search", { userId, savedType, firstName, lastName ,agentIdC});
};

const toggleFavorite = (userId : string, firstName : string, lastName : string, isFavorite : boolean) => {
  return http.post("/search/toggle-favorite", { userId, search: { firstName, lastName, isFavorite } });
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItem>("/search/saved-searches",{userId, savedType});
};

const getSavedFavorite = (userId : string, savedType : string) => {
  return http.post<SearchItem>("/search/getFavoriteHistory",{userId, savedType});
};
const AgentService = {
    getAgent,
    getAgentInfos,
    getTotalPast,
    getAgentHistoData,
    getTotalPresent,
    getDataPresentReport,
    getTotalFuture,
    getDataFutureReport,
    getGeoDataTot,
    getDataGeoReport,
    getofficeproduction,
    getOfficeRankingReport,
    getTeamData,
    getTeamAgentsTable,
    getAgentTierPersona,
    saveSearchHistory,
    toggleFavorite,
    getSavedSearches,
    getSavedFavorite

};

export default AgentService;