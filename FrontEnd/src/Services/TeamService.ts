import http from "../http-common";
import TeamNeo4jData from "../Models/TeamNeo4jData";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import FirstSecondLevelTable from '../Models/FirstSecondLevelTable';



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
  console.log(filterCriteria);

  return http.post<FirstSecondLevelTable>("/team/getTeamTableByFilter", {data:data,filterCriteria});
};

const TeamService = {
    getTeam,
    getTeamSecondLevel,
    getTeamByFilter,
    getTeamSecLevelByFilter,
    getTeamTableByFilter
};



export default TeamService;