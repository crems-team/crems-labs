import http from "../http-common";
import TeamNeo4jData from "../Models/TeamNeo4jData";
import AgentInfosRequest from "../Models/AgentInfosRequest";



const getTeam = (data : AgentInfosRequest) => {
  return http.post<TeamNeo4jData>("/team/getTeam", data);
};

const getTeamSecondLevel = (data : AgentInfosRequest) => {
  return http.post<TeamNeo4jData>("/team/getTeamSecondLevel", data);
};

const getTeamByFilter = (data : AgentInfosRequest,filterCriteria : any) => {
  return http.post<TeamNeo4jData>("/team/getTeamByFilter", {data:data,filterCriteria});
};

const TeamService = {
    getTeam,
    getTeamSecondLevel,
    getTeamByFilter
};



export default TeamService;