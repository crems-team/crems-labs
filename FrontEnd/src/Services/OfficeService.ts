import http from "../http-common";
import AgentInfosRequest from "../Models/AgentInfosRequest";
import AgentOfficeData from "../Models/AgentOfficeData";
import SearchItemOffice from "../Models/SearchItemOffice";







const getAgentsByOffice = (dataReq:AgentInfosRequest ) => {
  return http.post<AgentOfficeData>("/office/getAgentsByOffice", dataReq);
  };

//for saved search and favorite
const saveSearchHistory = (userId : string, savedType : string, officeName : string, officeId : string) => {
  return http.post("/office/save-search", { userId, savedType, officeName, officeId });
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



const AgentService = {
    
  getAgentsByOffice,
  saveSearchHistory,
  getSavedSearches,
  toggleFavorite,
  getSavedFavorite
};

export default AgentService;