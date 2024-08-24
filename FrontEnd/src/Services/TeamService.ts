import http from "../http-common";
import TeamNeo4jData from "../Models/TeamNeo4jData";
import AgentInfosRequest from "../Models/AgentInfosRequest";



const getTeam = (data : AgentInfosRequest) => {
  return http.post<TeamNeo4jData>("/team/getTeam", data);
};

const TeamService = {
    getTeam
};

export default TeamService;