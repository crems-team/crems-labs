import http from "../../http-common";
import SearchItemHistory from "../../Models/SearchItemHistory";


interface AutocompleteItem {
  value: number;
  label: string;
}


const callListingsAPI = (criteria : {mlsSid : string | null, fromDate : string | null, toDate : string | null, recLimit : string | null}) => {
  return http.post("/listingApi/update-data", { criteria  });
};

const getAutoCompleteOffice = (data : {office:string}) => {
  return http.post<AutocompleteItem>("/listingApi/getAutoCompleteOffice", data);
};

const getAutoCompleteAddress = (data : {address:string}) => {
  return http.post<AutocompleteItem>("/listingApi/getAutoCompleteAddress", data);
};

const getAutoCompleteCity = (data : {city:string}) => {
  return http.post<AutocompleteItem>("/listingApi/getAutoCompleteCity", data);
};

const getSearchData = (data : {office:string | null, address:string | null, city:string | null}) => {
  return http.post<any[]>("/listingApi/getSearchData", data);
};

const getListingsTop1000 = () => {
  return http.post<any[]>("/listingApi/getListingsTop1000");
};

const CallListingsAPIService = {
  callListingsAPI,
  getAutoCompleteOffice,
  getAutoCompleteAddress,
  getAutoCompleteCity,
  getSearchData,
  getListingsTop1000

};

export default CallListingsAPIService;