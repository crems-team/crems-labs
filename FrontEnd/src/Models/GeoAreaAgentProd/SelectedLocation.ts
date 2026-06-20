export default interface SelectedLocation {
    state: string;
    stateCode: string;
    county: string;
    city: string[];
    agentId : number;
    zip: string[];
    searchType: 'A' | 'T';
  }