 interface Node {
    id: string;
    agentname: string;
    agentoffice: string;
  }
  
 interface Link {
    source: string;
    target: string;
    count: number
  }
  
  export default interface TeamNeo4jData {
    nodes: Node[];
    links: Link[];
  }
  