
const neo4j = require('neo4j-driver');

const TeamService = {};


// Configure Neo4j driver
// const driver = neo4j.driver('neo4j+s://a9e75dfd.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'vuHw18s09-ASCgJi8c6fxryXnJ7vubHbidCjH-LU8B0'));
const driver = neo4j.driver('neo4j+s://e0f2da96.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'EpuuDtyOoXBM63LPUZ2r06PyIdTsQkuFqbN7F4EfBF4'));

function cleanName(name) {
  return name.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ")
             .toLowerCase()
             .trim();
}


TeamService.getTeam= async (idAgent) => {
  const session = driver.session();

  const queryNode = `MATCH (a:Agent{agId:${idAgent}})
  return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
  union
  MATCH (a:Agent{agId:${idAgent}})-[r*1]-(b)
  return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1]-(m)
  unwind r as rels
  return startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);


    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
      const sourceNodeId = record.get('id').toString();
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id').toString();
      const     agentname =record.get('agentname').toString();
      const     agentoffice= record.get('agentoffice').toString();
      let size = record.get('size').toNumber();
      const     color= record.get('color').toString();
      // green 12 ;8
      // tar 8    ;6
      // pink 6   ;4
      // blue 3	 ; 2

      //prod
      if (size === 12) {
        size = 9;
      }
      if (size === 8) {
        size = 7;
      }
      if (size === 6) {
        size = 5;
      }
      // if (size === 3) {
      //   size = 3;
      // }

      //preProd
      // green 7
      // pink 3
      // tar 5
      // blue 1
      if (size === 7) {
        size = 9;
      }
      if (size === 5) {
        size = 7;
      }
      if (size === 3) {
        size = 5;
      }
      if (size === 1) {
        size = 3;
      }

        nodes.push({
            id: id,
            agentname: agentname,
            agentoffice: agentoffice,
            size: size,
            color: color,
        });
     
       
      
    });

    // console.log(nodes);

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source').toString();
      const targetNodeId = record.get('target').toString();
      const size = record.get('size').toNumber()+1;
      const count = record.get('count').toNumber();
      const sell = record.get('sell').toNumber();
      const colist = record.get('colist').toNumber();


      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
      });
    });
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};


TeamService.getTeamSecondLevel= async (idAgent) => {
  const session = driver.session();

  const queryNode = `MATCH (a:Agent{agId:${idAgent}})
return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
union
MATCH (a:Agent{agId:${idAgent}})-[r*1..2]-(b)
return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1..2]-(m)
  unwind r as rels
  return startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);


    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
      const sourceNodeId = record.get('id').toString();
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id').toString();
      const     agentname =record.get('agentname').toString();
      const     agentoffice= record.get('agentoffice').toString();
      let size = record.get('size').toNumber();
      const     color= record.get('color').toString();
      // green 12 ;8
      // tar 8    ;6
      // pink 6   ;4
      // blue 3	 ; 2
      if (size === 12) {
        size = 9;
      }
      if (size === 8) {
        size = 7;
      }
      if (size === 6) {
        size = 5;
      }
      // if (size === 3) {
      //   size = 3;
      // }

        nodes.push({
            id: id,
            agentname: agentname,
            agentoffice: agentoffice,
            size: size,
            color: color,
        });
     
       
      
    });

    console.log(nodes);

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source').toString();
      const targetNodeId = record.get('target').toString();
      const size = record.get('size').toNumber()+1;
      const count = record.get('count').toNumber();
      const sell = record.get('sell').toNumber();
      const colist = record.get('colist').toNumber();


      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
      });
    });
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};

TeamService.getTeamByFilter= async (idAgent,filterCriteria) => {
  const session = driver.session();

  console.log(filterCriteria);
  const { office, tiers } = filterCriteria;


  const queryNode = `MATCH (a:Agent{agId:${idAgent}})
  return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
    union
    MATCH (a:Agent{agId:${idAgent}})-[r*1]-(b)
    where 1=1
    ${tiers.T1 ? "AND b.tier <> 'T1'" : ''} 
    ${tiers.T2 ? "AND b.tier <> 'T2'" : ''}
    ${tiers.T3 ? "AND b.tier <> 'T3'" : ''}
    ${tiers.T4 ? "AND b.tier <> 'T4'" : ''}
    return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1]-(m)
  unwind r as rels
  with rels 
  where 1=1
  ${tiers.T1 ? "and endNode(rels).tier<>'T1'and ((startNode(rels).tier<>'T1' and startNode(rels).agId<>n.agId) or (startNode(rels).tier=n.tier and startNode(rels).agId=n.agId)) " : ''} 
  ${tiers.T2 ? "and endNode(rels).tier<>'T2'and ((startNode(rels).tier<>'T2' and startNode(rels).agId<>n.agId) or (startNode(rels).tier=n.tier and startNode(rels).agId=n.agId)) " : ''} 
  ${tiers.T3 ? "and endNode(rels).tier<>'T3'and ((startNode(rels).tier<>'T3' and startNode(rels).agId<>n.agId) or (startNode(rels).tier=n.tier and startNode(rels).agId=n.agId)) " : ''} 
  ${tiers.T4 ? "and endNode(rels).tier<>'T4'and ((startNode(rels).tier<>'T4' and startNode(rels).agId<>n.agId) or (startNode(rels).tier=n.tier and startNode(rels).agId=n.agId)) " : ''} 
  return startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);

    console.log(queryNode);
    console.log(queryLinks);



    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
      const sourceNodeId = record.get('id').toString();
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id').toString();
      const     agentname =record.get('agentname').toString();
      const     agentoffice= record.get('agentoffice').toString();
      let size = record.get('size').toNumber();
      const     color= record.get('color').toString();
      // green 12 ;8 t1
      // tar 8    ;6 3
      // pink 6   ;4 2
      // blue 3	 ; 2 4

      //prod
      if (size === 12) {
        size = 9;
      }
      if (size === 8) {
        size = 7;
      }
      if (size === 6) {
        size = 5;
      }
      // if (size === 3) {
      //   size = 3;
      // }

      //preProd
      // green 7
      // pink 3
      // tar 5
      // blue 1
      if (size === 7) {
        size = 9;
      }
      if (size === 5) {
        size = 7;
      }
      if (size === 3) {
        size = 5;
      }
      if (size === 1) {
        size = 3;
      }

        nodes.push({
            id: id,
            agentname: agentname,
            agentoffice: agentoffice,
            size: size,
            color: color,
        });
     
       
      
    });

    // console.log(nodes);

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source').toString();
      const targetNodeId = record.get('target').toString();
      const size = record.get('size').toNumber()+1;
      const count = record.get('count').toNumber();
      const sell = record.get('sell').toNumber();
      const colist = record.get('colist').toNumber();


      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
      });
    });
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};


module.exports = TeamService;