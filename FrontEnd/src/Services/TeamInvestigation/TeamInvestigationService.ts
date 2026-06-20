import http from "../../http-common";
import AgentInfosRequest from "../../Models/AgentInfosRequest";
import TeamInvestigationNeo4jData from "../../Models/TeamInvestigation/TeamInvestigationNeo4jData";
import TeamInvestigationAgents from "../../Models/TeamInvestigation/TeamInvestigationAgents";
import SearchItemHistory from "../../Models/SearchItemHistory";  





const getTeamByName = (data : {term:string}) => {
  return http.post<any>("/teamInvetigation/getTeamByName", data);
};

const getAgentsByTeamId = (data : {teamId: string}) => {
  return http.post<any>("/teamInvetigation/getAgentsByTeamId", data);
};

const getTeam = (data : {teamId : string}) => {
  return http.post<TeamInvestigationNeo4jData>("/teamInvetigation/getTeam", data);
};

const getTeamByFilter = (data : {teamId : string},filterCriteria : any) => {
  return http.post<TeamInvestigationNeo4jData>("/teamInvetigation/getTeamByFilter", {data:data,filterCriteria});
};

const getAgentTeamTable = (data : {teamId : string},filterCriteria : any) => {
  return http.post<TeamInvestigationAgents>("/teamInvetigation/getAgentTeamTable", {data:data,filterCriteria});
};

//for saved search and favorite  
const saveSearchHistory = (userId : string, savedType : string, teamName : string, teamId : string) => {
  return http.post("/teamInvetigation/save-search", { userId, savedType, teamName, teamId});
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory[]>("/teamInvetigation/saved-searches",{userId, savedType});
};

const toggleFavorite = (userId : string, idHistory : number, isFavorite : boolean) => {
  return http.post("/teamInvetigation/toggle-favorite", { userId, search: { idHistory, isFavorite } });
};

const deteteNonFavorite = (userId : string, savedType : string) => {
  return http.post("/teamInvetigation/deteteNonFavorite", {userId, savedType});
};

const getSavedFavorite = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory[]>("/teamInvetigation/getFavoriteHistory",{userId, savedType});
};

const getTeamInfos = (data : {teamId:string}) => {
  return http.post<any>("/teamInvetigation/getTeamInfos", data);
};

const TeamInvestigationService = {
    getTeamByName,
    getAgentsByTeamId,
    getTeam,
    getTeamByFilter,
    getAgentTeamTable,
    saveSearchHistory,
    getSavedSearches,
    toggleFavorite,
    deteteNonFavorite,
    getSavedFavorite,
    getTeamInfos
};



export default TeamInvestigationService;