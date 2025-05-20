export interface Agent {
    agentId: string;
    Name: string;
    total: string;
  }
  
  export interface Listing {
    agentId: string;
    Name: string;
    Nlistings: string;
  }
  
  export interface SankeyData {
    agents: Agent[];
    listings: Listing[];
  }
  
  export type SankeyChartData = Array<[string, string, number]>;