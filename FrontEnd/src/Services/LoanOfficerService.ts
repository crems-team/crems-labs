import http from "../http-common";
import { SankeyData, SankeyChartData } from '../Models/SankeyData';
import SearchItemHistory from "../Models/SearchItemHistory";  






const getNameLoanOfficer = (data : {term:string}) => {
  return http.post<any>("/loanOfficer/getNameLoanOfficer", data);
};

const getAgentByName = (data : {name:string}) => {
  return http.post<any>("/loanOfficer/getAgentByName", data);
};

const getSankeyData = (data : {officerId:string}) => {
  return http.post<SankeyData>("/loanOfficer/getSankeyData", data);
};

const findLoanOfficerById = (data : {id:string}) => {
  return http.post<any>("/loanOfficer/findLoanOfficerById", data);
};

const getTotalAgents = (data : {id:string}) => {
  return http.post<any>("/loanOfficer/getTotalAgents", data);
};

const getTotalSalesAndCapRate = (data : {id:string}) => {
  return http.post<any>("/loanOfficer/getTotalSalesAndCapRate", data);
};

//for saved search and favorite  
const saveSearchHistory = (userId : string, savedType : string, officerId : string, officerName : string) => {
  return http.post("/loanOfficer/save-search", { userId, savedType, officerId, officerName});
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory>("/loanOfficer/saved-searches",{userId, savedType});
};

const toggleFavorite = (userId : string, idHistory : number, isFavorite : boolean) => {
  return http.post("/loanOfficer/toggle-favorite", { userId, search: { idHistory, isFavorite } });
};

const getSavedFavorite = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory>("/loanOfficer/getFavoriteHistory",{userId, savedType});
};

const getOfficeRankingReportLO = (idOfficer : string, idAgent : string, officeId: string) => {
  return http.post<any>("/loanOfficer/getAgentRankingLO", {idOfficer, idAgent, officeId});
};

const getOfficeNamesLo = (data : {id:string}) => {
  return http.post<SearchItemHistory>("/loanOfficer/getOfficeNamesLo",data);
};

const getDataLOWorkedWithAgent = (idAgent : string) => {
  return http.post<any>("/loanOfficer/getDataLOWorkedWithAgent", {idAgent});
};
const LoanOfficerService = {
  getNameLoanOfficer,
  getAgentByName,
  getSankeyData,
  saveSearchHistory,
  getSavedSearches,
  toggleFavorite,
  getSavedFavorite,
  findLoanOfficerById,
  getTotalAgents,
  getTotalSalesAndCapRate,
  getOfficeRankingReportLO,
  getOfficeNamesLo,
  getDataLOWorkedWithAgent


};

export default LoanOfficerService;