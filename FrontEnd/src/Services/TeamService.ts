import http from "../http-common";
import TeamNeo4jData from "../Models/TeamNeo4jData";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import FirstSecondLevelTable from '../Models/FirstSecondLevelTable';
import SearchItemHistory from "../Models/SearchItemHistory";  
import type { OrgNode } from "../types/org.types";



const getTeam = (data : AgentInfosRequest) => {
  return http.post<TeamNeo4jData>("/team/getTeam", data);
};

const getTeamSecondLevel = (data : AgentInfosRequest) => {
  return http.post<TeamNeo4jData>("/team/getTeamSecondLevel", data);
};

const getTeamByFilter = (data : AgentInfosRequest,filterCriteria : any) => {
  return http.post<TeamNeo4jData>("/team/getTeamByFilter", {data:data,filterCriteria});
};

const getTeamSecLevelByFilter = (data : AgentInfosRequest,filterCriteria : any) => {
  return http.post<TeamNeo4jData>("/team/getTeamSecLevelByFilter", {data:data,filterCriteria});
};

const getTeamTableByFilter = (data : AgentInfosRequest,filterCriteria : any) => {

  return http.post<FirstSecondLevelTable>("/team/getTeamTableByFilter", {data:data,filterCriteria});
};

//Search team by name *********************************************************************************************************************

const getTeamByName = (data : {term:string}) => {
  return http.post<any>("/team/getTeamByName", data);
};

const getAgentByTeamName = (data : {name:string}) => {
  return http.post<any>("/team/getAgentByTeamName", data);
};

const getTeamInfos = (data : {name:string}) => {
  return http.post<any>("/team/getTeamInfos", data);
};


const getTeamMock = (data : {name:string}) => {
  return http.post<TeamNeo4jData>("/team/generateCoryHomeTeamGraph", data);
};

const getAgentTeamTable = (data : {name:string}) => {

  return http.post<any>("/team/getAgentTeamTable", data);
};
//for saved search and favorite  
const saveSearchHistory = (userId : string, savedType : string, teamName : string) => {
  return http.post("/team/save-search", { userId, savedType, teamName});
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory[]>("/team/saved-searches",{userId, savedType});
};

const toggleFavorite = (userId : string, idHistory : number, isFavorite : boolean) => {
  return http.post("/team/toggle-favorite", { userId, search: { idHistory, isFavorite } });
};

const deteteNonFavorite = (userId : string, savedType : string) => {
  return http.post("/team/deteteNonFavorite", {userId, savedType});
};

const getSavedFavorite = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory[]>("/team/getFavoriteHistory",{userId, savedType});
};

const getOrgNodesByTeamKey = (data : {name:string}) => {
  return http.post<OrgNode[]>("/team/getOrgNodesByTeamKey", data);
};
const TeamService = {
    getTeam,
    getTeamSecondLevel,
    getTeamByFilter,
    getTeamSecLevelByFilter,
    getTeamTableByFilter,
    getTeamByName,
    getAgentByTeamName,
    getTeamInfos,
    getTeamMock,
    getAgentTeamTable,
    saveSearchHistory,
    getSavedSearches,
    toggleFavorite,
    deteteNonFavorite,
    getSavedFavorite,
    getOrgNodesByTeamKey
};



export default TeamService;