 interface Node {
    id: string;
    agentname: string;
    agentoffice: string;
    size: number;
    color : string;
  }

  
 interface Link {
    source: string;
    target: string;
    count: number;
    size : number;
    sell:number;
    colist : number;
  }
  
  export default interface TeamNeo4jData {
    nodes: Node[];
    links: Link[];
  }
  