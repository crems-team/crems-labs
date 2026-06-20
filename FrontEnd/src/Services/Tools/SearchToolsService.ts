import http from "../../http-common";
import SearchItemHistory from "../../Models/SearchItemHistory";


interface AutocompleteItem {
  value: number;
  label: string;
}


const getAgentIdAutoComplete = (data : {agentId:string}) => {
  return http.post<AutocompleteItem>("/searchTool/getAgentIdAutoComplete", data);
};

const getAutoCompleteOffice = (data : {office:string, agentId:string}) => {
  return http.post<AutocompleteItem>("/searchTool/getAutoCompleteOffice", data);
};

const getAutoCompleteAddress = (data : {address:string, agentId:string}) => {
  return http.post<AutocompleteItem>("/searchTool/getAutoCompleteAddress", data);
};

const getAutoCompleteCity = (data : {city:string, agentId:string}) => {
  return http.post<AutocompleteItem>("/searchTool/getAutoCompleteCity", data);
};

const getSearchData = (data : {agentId :string | null, office:string | null, address:string | null, city:string | null}) => {
  return http.post<any[]>("/searchTool/getSearchData", data);
};

//for saved search and favorite  
const saveSearchHistory = (userId : string, savedType : string, agentId : string, officeName : string, address : string, city : string) => {
  return http.post("/searchTool/save-search", { userId, savedType, agentId, officeName, address, city});
};

const getSavedSearches = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory>("/searchTool/saved-searches",{userId, savedType});
};

const toggleFavorite = (userId : string, idHistory : number, isFavorite : boolean) => {
  return http.post("/searchTool/toggle-favorite", { userId, search: { idHistory, isFavorite } });
};

const getSavedFavorite = (userId : string, savedType : string) => {
  return http.post<SearchItemHistory>("/searchTool/getFavoriteHistory",{userId, savedType});
};

const deteteNonFavorite = (userId : string, savedType : string) => {
  return http.post("/searchTool/deteteNonFavorite", {userId, savedType});
};

const SearchToolsService = {
  getAgentIdAutoComplete,
  getAutoCompleteOffice,
  getAutoCompleteAddress,
  getAutoCompleteCity,
  getSearchData,
  saveSearchHistory,
  getSavedSearches,
  toggleFavorite,
  getSavedFavorite,
  deteteNonFavorite

};

export default SearchToolsService;