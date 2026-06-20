interface TeamNode  {
  id: string;
  name?: string;
  office?: string;
  size?: number;    
  color?: string;  
};

interface TeamLink {
  source: string;
  target: string;
  size?: number;    
  role?: string;    
};

export default interface  TeamInvestigationNeo4jData { 
  nodes: TeamNode[];
  links: TeamLink[] 
};