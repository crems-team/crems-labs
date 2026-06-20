import { api } from "../http-data";
import AgentModel from "../Models/AgentModel";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import AgentInfos from "../Models/AgentInfos";
import AgentTotalPast from "../Models/AgentTotalPast";
import DataPresentRep from "../Models/DataPresentRep";
import FutureMetrics from "../Models/FutureMetrics";
import DataFutureRep from "../Models/DataFutureRep";
import GeoDataTot from "../Models/GeoDataTot";
import GeoDataReport from "../Models/GeoDataReport";
import OfficeProd from "../Models/OfficeProd";
import AgentRanking from "../Models/AgentRanking";
import TeamData from "../Models/TeamData";
import TeamAgentsTable from "../Models/TeamAgentsTable";
import AgentTierPersona from "../Models/AgentTierPersona";
import SearchItem from "../Models/SearchItemHistory";
import SearchItemAgent from "../Models/SearchItemAgent";

interface DataReqAgentRank {
  id: string;
  officeId: string;
}

const getAgent = (data: { term: string }) =>
  api.post<AgentModel[]>("/search/agentByName", data);

const getAgentInfos = (data: AgentInfosRequest) =>
  api.post<AgentInfos[]>("/search/getAgentInfos", data);

const getTotalPast = async (data: AgentInfosRequest) => {
  return api.post<AgentTotalPast>("/search/getTotalPast", data);
};

const getTeamData = async (data: AgentInfosRequest) => {
  return api.post<TeamData>("/search/getTeamData", data);
  // return JSON.parse(raw) as TeamData;
};

const getofficeproduction = async (dataReq: DataReqAgentRank) => {
  return api.post<OfficeProd>("/search/getofficeproduction", dataReq);
  // return JSON.parse(raw) as OfficeProd;
};

const getAgentHistoData = (data: AgentInfosRequest) =>
  api.post<string[][]>("/search/getAgentHistoData", data);

const getTotalPresent = (data: AgentInfosRequest) =>
  api.post<[{ list: number; sell: number; dna: number }]>(
    "/search/getTotalPresent",
    data
  );

const getDataPresentReport = (data: AgentInfosRequest) =>
  api.post<DataPresentRep[]>("/search/getDataPresentReport", data);

const getTotalFuture = (data: AgentInfosRequest) =>
  api.post<FutureMetrics[]>("/search/getTotalFuture", data);

const getDataFutureReport = (data: AgentInfosRequest) =>
  api.post<DataFutureRep[]>("/search/getDataFutureReport", data);

const getGeoDataTot = (data: AgentInfosRequest) =>
  api.post<GeoDataTot>("/search/getGeoDataTot", data);

const getDataGeoReport = (data: AgentInfosRequest) =>
  api.post<GeoDataReport[]>("/search/getDataGeoReport", data);

const getOfficeRankingReport = (dataReq: DataReqAgentRank) =>
  api.post<AgentRanking[]>("/search/getOfficeRankingReport", dataReq);

const getTeamAgentsTable = (data: AgentInfosRequest) =>
  api.post<TeamAgentsTable[]>("/search/getTeamAgentsTable", data);

const getAgentTierPersona = (data: AgentInfosRequest) =>
  api.post<AgentTierPersona[]>("/search/getAgentTierPersona", data);

// Saved search
const saveSearchHistory = (
  userId: string,
  savedType: string,
  fullName: string,
  agentIdC: string,
  state: string
) =>
  api.post<void, {userId: string, savedType: string, fullName: string, agentIdC: string, state: string  }>("/search/save-search", { userId, savedType, fullName, agentIdC, state });

const toggleFavorite = (agentId: string, isFavorite: boolean) =>
  api.post<void, { search: { agentId: string; isFavorite: boolean } }>(
    "/search/toggle-favorite",
    { search: { agentId, isFavorite } }
  );

const getSavedSearches = (userId: string, savedType: string) =>
  api.post<SearchItem[]>("/search/saved-searches", { userId, savedType });

const getSavedFavorite = (userId: string, savedType: string) =>
  api.post<SearchItemAgent[]>("/search/getFavoriteHistory", { userId, savedType });

// Autosuggest
const getAgentFullName = (data: { term: string }) =>
  api.post<Array<{ value: number; label: string }>>("/search/getAgentFullName", data);

// Delete non-favorite
const deteteNonFavorite = (userId: string, savedType: string) =>
  api.post<void>("/search/deteteNonFavorite", { userId, savedType });

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
  getSavedFavorite,
  getAgentFullName,
  deteteNonFavorite,
};

export default AgentService;
