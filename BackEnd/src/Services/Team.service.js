
const neo4j = require('neo4j-driver');
const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const TeamService = {};


// Configure Neo4j driver
// const driver = neo4j.driver('neo4j+s://a9e75dfd.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'vuHw18s09-ASCgJi8c6fxryXnJ7vubHbidCjH-LU8B0'));
const driver = neo4j.driver('neo4j+s://e0f2da96.databases.neo4j.io:7687', neo4j.auth.basic('neo4j', 'EpuuDtyOoXBM63LPUZ2r06PyIdTsQkuFqbN7F4EfBF4'));
// Configure Neo4j driver Staging
  // const driver = neo4j.driver('neo4j+s://7b44f9f9.databases.neo4j.io:7687', 
  //   neo4j.auth.basic('neo4j', '8bXsTQdr3mAMq_xUZg2DJL9PetwASwUSn-KskZI74kA'),{
  //   // disableLosslessIntegers: true, //Neo4j Integer → JS Number
  // });
function cleanName(name) {
  return name.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ")
             .toLowerCase()
             .trim();
}


TeamService.getTeam= async (idAgent) => {
  const session = driver.session();

  const queryNode = `
    MATCH (a:Agent {agId: ${idAgent}})
    RETURN 
      toString(a.agId) AS id,
      coalesce(a.name, '') AS agentname,
      coalesce(a.office, '') AS agentoffice,
      coalesce(a.size, 0) AS size,
      coalesce(a.color, '') AS color

    UNION

    MATCH (a:Agent {agId: ${idAgent}})-[r*1]-(b:Agent)
    WHERE b.agId IS NOT NULL
    RETURN 
      toString(b.agId) AS id,
      coalesce(b.name, '') AS agentname,
      coalesce(b.office, '') AS agentoffice,
      coalesce(b.size, 0) AS size,
      coalesce(b.color, '') AS color
    `;
  const queryLinks = `MATCH (n:Agent {agId: ${idAgent}})-[r*1]-(m:Agent)
    UNWIND r AS rels
    WITH 
      startNode(rels) AS s,
      endNode(rels) AS t,
      rels
    WHERE s.agId IS NOT NULL AND t.agId IS NOT NULL

    RETURN 
      toString(s.agId) AS source,
      toString(t.agId) AS target,
      coalesce(rels.size, 0) AS size,
      coalesce(rels.total, 0) AS count,
      coalesce(rels.sell, 0) AS sell,
      coalesce(rels.colist, 0) AS colist`;

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
      //let size = record.get('size');
      const     color= record.get('color').toString();
      // green 12 ;8
      // tar 8    ;6
      // pink 6   ;4
      // blue 3	  ;2

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
      //old since 16/05/2026 when switch to staging
      const size = record.get('size').toNumber()+1;
      const count = record.get('count').toNumber();
      const sell = record.get('sell').toNumber();
      const colist = record.get('colist').toNumber();
      // const size = record.get('size')+1;
      // const count = record.get('count');
      // const sell = record.get('sell');
      // const colist = record.get('colist');
      // const office     = record.get('office').toString();



      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
        // office : office,
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
MATCH (a:Agent{agId:${idAgent}})-[r*1..2]-(b:Agent)
return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1..2]-(m:Agent)
  unwind r as rels
  return startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);


    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
      const sourceNodeId = record.get('id')?.toString() ?? '';
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id')?.toString() ?? '';
      const     agentname =record.get('agentname')?.toString() ?? '';
      const     agentoffice= record.get('agentoffice')?.toString() ?? '';
      let size = record.get('size')?.toNumber() ?? 1;
      const     color= record.get('color')?.toString() ?? '';
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
      const sourceNodeId = record.get('source')?.toString() ?? '';
      const targetNodeId = record.get('target')?.toString() ?? '';
      const size = record.get('size')?.toNumber()+1 ?? 2;
      const count = record.get('count')?.toNumber() ?? 0;
      const sell = record.get('sell')?.toNumber() ?? 0;
      const colist = record.get('colist')?.toNumber() ?? 0;


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
  const { office,officeName, tiers } = filterCriteria;

  const queryNode = `MATCH (a:Agent{agId:${idAgent}})
  return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
    union
    MATCH (a:Agent{agId:${idAgent}})-[r*1]-(b:Agent)
    where 1=1
    ${tiers.T1 ? "AND b.tier <> 'T1'" : ''} 
    ${tiers.T2 ? "AND b.tier <> 'T2'" : ''}
    ${tiers.T3 ? "AND b.tier <> 'T3'" : ''}
    ${tiers.T4 ? "AND b.tier <> 'T4'" : ''}
    ${office ? "AND b.office = a.office" : ''}
    return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1]-(m:Agent)
  unwind r as rels
  with rels 
  where 1=1
  ${tiers.T1 ? "and ((endNode(rels).tier<>'T1' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T1' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T2 ? "and ((endNode(rels).tier<>'T2' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T2' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T3 ? "and ((endNode(rels).tier<>'T3' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T3' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T4 ? "and ((endNode(rels).tier<>'T4' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T4' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${office ? "AND (startNode(rels).office = n.office and endNode(rels).office = n.office)" : ''}
  return rels.office,startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;
  
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
    console.log(nodes);
    console.log(links);
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};

TeamService.getTeamSecLevelByFilter= async (idAgent,filterCriteria) => {
  const session = driver.session();
  const { office,officeName, tiers } = filterCriteria;

  // const queryNode = `MATCH (a:Agent{agId:${idAgent}})
  // return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
  // union
  // MATCH (a:Agent{agId:${idAgent}})-[r*1..2]-(b)
  // where 1=1
  //   ${tiers.T1 ? "AND b.tier <> 'T1'" : ''} 
  //   ${tiers.T2 ? "AND b.tier <> 'T2'" : ''}
  //   ${tiers.T3 ? "AND b.tier <> 'T3'" : ''}
  //   ${tiers.T4 ? "AND b.tier <> 'T4'" : ''}
  //   ${office ? "AND b.office = a.office" : ''}
  // return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;

  const queryNode = `MATCH (a:Agent{agId:${idAgent}})
	  return a.agId as id, a.name as agentname,a.office as agentoffice,a.size as size, a.color as color
	union
	MATCH (a:Agent {agId:${idAgent}}) 
	  MATCH path=(a)-[*1..2]-(b:Agent) 
	  WHERE ALL(n in nodes(path) where (
	  1=1
	  ${tiers.T1 ? "AND n.tier <> 'T1'" : ''}
	  ${tiers.T2 ? "AND n.tier <> 'T2'" : ''}
	   ${tiers.T3 ? "AND n.tier <> 'T3'" : ''}
	   ${tiers.T4 ? "AND n.tier <> 'T4'" : ''}
	   ${office ? "AND n.office = a.office" : ''} 
	  ) or n.agId=a.agId)
	  return b.agId as id, b.name as agentname,b.office as agentoffice,b.size as size, b.color as color`;
  
  
    const queryLinks = `MATCH (n:Agent{agId:${idAgent}})-[r*1..2]-(m:Agent)
    unwind r as rels
    with rels 
    where 1=1
    ${tiers.T1 ? "and ((endNode(rels).tier<>'T1' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T1' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
    ${tiers.T2 ? "and ((endNode(rels).tier<>'T2' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T2' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
    ${tiers.T3 ? "and ((endNode(rels).tier<>'T3' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T3' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
    ${tiers.T4 ? "and ((endNode(rels).tier<>'T4' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T4' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
    ${office ? "AND (startNode(rels).office = n.office and endNode(rels).office = n.office)" : ''}
    return startNode(rels).agId as source,endNode(rels).agId as target,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);

    



    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {
       const sourceNodeId = record.get('id')?.toString() ?? '';
      //const targetNodeId = record.get('target').toString();

      const     id= record.get('id')?.toString() ?? '';
      const     agentname =record.get('agentname')?.toString() ?? '';
      const     agentoffice= record.get('agentoffice')?.toString() ?? '';
      let size = record.get('size')?.toNumber() ?? 1;
      const     color= record.get('color')?.toString() ?? '';
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
     const sourceNodeId = record.get('source')?.toString() ?? '';
      const targetNodeId = record.get('target')?.toString() ?? '';
      const size = record.get('size')?.toNumber()+1 ?? 2;
      const count = record.get('count')?.toNumber() ?? 0;
      const sell = record.get('sell')?.toNumber() ?? 0;
      const colist = record.get('colist')?.toNumber() ?? 0;

      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
      });
    });
    console.log(nodes);
    console.log(links);
    
    return { nodes, links };

  } finally {
    await session.close();
  }
};

TeamService.getTeamTableByFilter= async (idAgent,filterCriteria) => {
  const session = driver.session();
  const { office,typeTable, tiers } = filterCriteria;
  let firstSecondLevelResult = null;
  const firstSecondLevelList = [];


  const queryTableFirstLevel = `MATCH (n:Agent{agId:${idAgent}})-[r*1]-(m:Agent)
    unwind r as rels
    with rels,n 
    where 1=1
  ${tiers.T1 ? "and ((endNode(rels).tier<>'T1' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T1' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T2 ? "and ((endNode(rels).tier<>'T2' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T2' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T3 ? "and ((endNode(rels).tier<>'T3' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T3' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T4 ? "and ((endNode(rels).tier<>'T4' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T4' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${office ? "and (startNode(rels).office = n.office and endNode(rels).office = n.office)" : ''}
  with startNode(rels) as a, endNode(rels) as b,rels
  where EXISTS ((a)--()) and EXISTS ((b)--())
  return DISTINCT startNode(rels).name as source,endNode(rels).name as target,endNode(rels).office as office,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;
  
  const queryTableSecondLevel = `MATCH (n:Agent{agId:${idAgent}})-[r*1..2]-(m:Agent)
    unwind r as rels
    with rels,n 
    where 1=1
  ${tiers.T1 ? "and ((endNode(rels).tier<>'T1' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T1' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T2 ? "and ((endNode(rels).tier<>'T2' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T2' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T3 ? "and ((endNode(rels).tier<>'T3' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T3' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${tiers.T4 ? "and ((endNode(rels).tier<>'T4' and endNode(rels).agId<>n.agId) or endNode(rels).agId=n.agId) and ((startNode(rels).tier<>'T4' and startNode(rels).agId<>n.agId) or startNode(rels).agId=n.agId) " : ''} 
  ${office ? "and (startNode(rels).office = n.office and endNode(rels).office = n.office)" : ''}
  with startNode(rels) as a, endNode(rels) as b,rels
  where EXISTS ((a)--()) and EXISTS ((b)--())
  return DISTINCT startNode(rels).name as source,endNode(rels).name as target,endNode(rels).office as office,rels.size as size,rels.total as count,rels.sell as sell,rels.colist as colist`;
  
  try {

    if(typeTable === 'level1'){
      firstSecondLevelResult = await session.run(queryTableFirstLevel);


      firstSecondLevelResult.records.forEach(record => {
      const source = record.get('source')?.toString() ?? '';
      const target = record.get('target')?.toString() ?? '';
      const office = record.get('office')?.toString() ?? '';
      const size   = record.get('size')?.toNumber() ?? 1;
      const count  = record.get('count')?.toNumber() ?? 0;
      const sell   = record.get('sell')?.toNumber() ?? 0;
      const colist = record.get('colist')?.toNumber() ?? 0;



      firstSecondLevelList.push({
        source: source,
        target: target,
        office: office,
        size : size,
        count: count,
        sell : sell,
        colist : colist,
      });
    });

    }else if(typeTable === 'level2'){
      firstSecondLevelResult = await session.run(queryTableSecondLevel);

  
      firstSecondLevelResult.records.forEach(record => {
         const source = record.get('source')?.toString() ?? '';
      const target = record.get('target')?.toString() ?? '';
      const office = record.get('office')?.toString() ?? '';
      const size   = record.get('size')?.toNumber() ?? 1;
      const count  = record.get('count')?.toNumber() ?? 0;
      const sell   = record.get('sell')?.toNumber() ?? 0;
      const colist = record.get('colist')?.toNumber() ?? 0;
  
  
  
        firstSecondLevelList.push({
          source: source,
          target: target,
          office: office,
          size : size,
          count: count,
          sell : sell,
          colist : colist,
        });
      });

    }
    // const linkResult = await session.run(queryLinks);

    



    

    return { firstSecondLevelList };

  } finally {
    await session.close();
  }
};

//Search a team by name ****************************************************************************************************************************************************************

TeamService.getTeamByName = async (item) => {
  await poolConnect;
  const request = pool.request();
  const query = "SELECT DISTINCT teamName as label, teamName as value FROM team_names WHERE teamName LIKE '%' + @name + '%'";
  request.input('name', mssql.VarChar, item);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No data found.', 404);

  return res.recordset;
};

TeamService.getAgentByTeamName = async (name) => {
  await poolConnect;
  const request = pool.request();
  request.input('name', mssql.VarChar, name);
  const query = "SELECT DISTINCT  agentName, ISNULL(NULLIF(agentPhone, 'NULL'), '')  AS agentPhone, ISNULL(NULLIF(agentEmail, 'NULL'), '')  AS agentEmail FROM team_names WHERE teamName = @name";
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found.', 404);
  console.log(res.recordset);
  return res.recordset;
};

TeamService.getTeamInfos = async (name) => {
  await poolConnect;
  const request = pool.request();
  request.input('name', name);

  const query = `
    SELECT TOP 1 teamName, officeName, teamSize, officeAddress, city, state 
    FROM team_names 
    WHERE teamName = @name
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No team found with this Name '+name, 404);
  }

  return res.recordset[0];
};

TeamService.getAgentForGraphByTeamName = async (name) => {
  await poolConnect;
  const request = pool.request();
  request.input('name', mssql.VarChar, name);
  console.log(name);
  const query = `
      SELECT
        ISNULL(NULLIF(LTRIM(RTRIM(agentId)), 'NULL'), '')  AS agentId,
        agentName,
        ISNULL(NULLIF(LTRIM(RTRIM(agentPhone)), 'NULL'), '')  AS agentPhone,
        ISNULL(NULLIF(LTRIM(RTRIM(agentEmail)), 'NULL'), '')  AS agentEmail,
        officeName,
        flagAdmin,
        transactions,
        role
      FROM team_names
      WHERE teamName = @name
      ORDER BY agentName
    `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found.', 404);
  return res.recordset;
};

function enrichAgentsWithTier(agents) {
  return agents.map((agent, i) => ({
    ...agent,
    tier: (i % 5) + 1  
  }));
}


TeamService.generateTeamGraph = async (teamName) => {
 
   const TIER_COLORS = {
    0: '#379ffaff', 
    1: '#98EFBF', 
    2: '#F6DDCC', 
    3: '#F5B7B1', 
    4: '#AED6F1', 
    5: '#B0B0B0', 
  };

  const sizes = [5, 7, 9];  

  const nodes = [];
  const links = [];

  const rawAgents = await TeamService.getAgentForGraphByTeamName(teamName);
  if (!rawAgents || rawAgents.length === 0) {
    return { nodes: [], links: [] };
  }

  const agents = enrichAgentsWithTier(rawAgents);

  const HUB_ID = `team-${teamName.replace(/\s+/g, '-').toLowerCase()}`;
  const HUB_NAME = teamName;

  nodes.push({
    id: HUB_ID,
    agentname: HUB_NAME,
    agentoffice: agents[0].officeName || `${teamName} Office`,
    size: 12,
    color: TIER_COLORS[0],
    tier: 0
  });

  agents.forEach((agent, i) => {
    const id = `agent-${String(i + 1).padStart(3, '0')}`;

    const tier = agent.tier;            
    const color = TIER_COLORS[tier];
    const size = sizes[i % sizes.length];

    nodes.push({
      id,
      agentname: agent.agentName,
      agentoffice: agent.officeName,
      size,
      color,
      tier,
      admin: agent.flagAdmin
    });

    links.push({
      source: HUB_ID,
      target: id,
      size: 3,
      count: 1,
      sell: 1,
      colist: 0
    });
  });

  return { nodes, links };

  
};


TeamService.getAgentTeamTable = async (teamName) => {
  const rawAgents = await TeamService.getAgentForGraphByTeamName(teamName);
  const agentsWithTier = enrichAgentsWithTier(rawAgents);
  return agentsWithTier;   
};

TeamService.saveSearchHistory = async (userId, savedType, teamName) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('teamName', teamName);
  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND TeamName = @teamName
    )
    BEGIN
      IF (
        SELECT COUNT(*) FROM agp_searchHistory WHERE UserId = @userId AND savedType = @savedType
      ) >= 10
      BEGIN
        DELETE FROM agp_searchHistory
        WHERE id IN (
          SELECT TOP 1 id FROM agp_searchHistory
          WHERE UserId = @userId AND savedType = @savedType
          ORDER BY CreatedAt ASC
        )
      END
      INSERT INTO agp_searchHistory (UserId, savedType, TeamName, IsFavorite)
      VALUES (@userId, @savedType, @teamName, 1)
    END
  `;
  return await executeWithRetry(() => request.query(query));
};

TeamService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, id as idHistory, TeamName as teamName, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  // if (!res || res.recordset.length === 0)
  //   throw new AppError("No history found.", 404);
  return res.recordset;
};

TeamService.toggleFavorite = async (idHistory, isFavorite) => {
  await poolConnect;
  const request = pool.request();
  request.input('idHistory', idHistory);
  request.input('isFavorite', isFavorite);
  const query = `
    UPDATE agp_searchHistory
    SET IsFavorite = @isFavorite
    WHERE id = @idHistory
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (res.rowsAffected[0] === 0)
    throw new AppError("No line to update.", 404);
  return res;
};

TeamService.deteteNonFavorite = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    DELETE FROM agp_searchHistory
    WHERE savedType = @savedType AND UserId = @userId AND IsFavorite = 1;
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (res.rowsAffected[0] === 0)
    throw new AppError("No non-favorite entry to delete", 404);
  return res;
};

TeamService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, TeamName as teamName, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No favorite found", 404);
  return res.recordset;
};

TeamService.getOrgNodesByTeamKey = async (teamKey) => {
  await poolConnect;

  const request = pool.request();
  request.input("teamKey", mssql.NVarChar(50), teamKey);

  // const query = `
  //   SELECT
  //     NodeId AS id,
  //     ParentNodeId AS parentId,
  //     ISNULL(NULLIF(FullName, 'NULL'), '')  AS fullName,
  //     ISNULL(NULLIF(RoleTitle, 'NULL'), '') AS roleTitle,
  //     NodeType AS nodeType,
  //     SortOrder AS sortOrder,
  //     AvatarUrl AS avatarUrl,
  //     Color AS color
  //   FROM TeamOrgNode
  //   WHERE TeamKey = @teamKey
  //     AND IsActive = 1
  //   ORDER BY
  //     ParentNodeId,
  //     SortOrder,
  //     NodeId;
  // `;
    const query = `
    WITH A AS (
      SELECT
        a.TeamKey,
        a.PersonId,
        NULLIF(LTRIM(RTRIM(a.FullName)), 'NULL') AS FullName,
        NULLIF(LTRIM(RTRIM(a.AvatarUrl)), 'NULL') AS AvatarUrl,
        a.RoleKey,
        ISNULL(a.SortOrder, 100000) AS PersonSort,
        ROW_NUMBER() OVER (
          PARTITION BY a.RoleKey
          ORDER BY ISNULL(a.SortOrder, 100000), NULLIF(LTRIM(RTRIM(a.FullName)), 'NULL')
        ) AS rn,
        COUNT(*) OVER (PARTITION BY a.RoleKey) AS cnt
      FROM agp_teamRoleAssignment a
      WHERE a.TeamKey = @teamKey AND a.IsActive = 1
    ),
    RoleEffectiveNode AS (
      SELECT
        r.RoleKey,
        r.ParentRoleKey,
        r.SortOrder,
        r.DefaultColor,
        r.RoleTitle,
        -- id du node racine de ce rôle
        CASE
          WHEN p.PersonId IS NOT NULL THEN CONCAT('P:', CONVERT(varchar(36), p.PersonId))
          ELSE CONCAT('V:', r.RoleKey)
        END AS EffectiveNodeId
      FROM agp_teamOrgRoleTemplate r
      LEFT JOIN A p
        ON p.RoleKey = r.RoleKey AND p.rn = 1
      WHERE r.IsActive = 1
    ),
    Resolved AS (
      SELECT
        r.RoleKey,
        r.SortOrder,
        r.DefaultColor,
        r.RoleTitle,
        r.EffectiveNodeId AS NodeId,
        CASE
          WHEN r.ParentRoleKey IS NULL THEN NULL
          ELSE p.EffectiveNodeId
        END AS ParentNodeId
      FROM RoleEffectiveNode r
      LEFT JOIN RoleEffectiveNode p
        ON p.RoleKey = r.ParentRoleKey
    ),
    VacantNodes AS (
      SELECT
        res.NodeId AS id,
        res.ParentNodeId AS parentId,
        CAST(NULL AS varchar(200)) AS fullName,
        res.RoleTitle AS roleTitle,
        'VACANT' AS nodeType,
        res.SortOrder AS sortOrder,
        CAST(NULL AS varchar(500)) AS avatarUrl,
        res.DefaultColor AS color
      FROM Resolved res
      LEFT JOIN A a ON a.RoleKey = res.RoleKey
      WHERE a.RoleKey IS NULL
        AND NOT (
          res.RoleKey LIKE '%[_]L4[_]%'   -- contain "_L4_"
          OR res.RoleKey LIKE 'L4[_]%'    -- start with "L4_"
        )
    ),
    PersonNodes AS (
      SELECT
        CONCAT('P:', CONVERT(varchar(36), a.PersonId)) AS id,
        res.ParentNodeId AS parentId,
        a.FullName AS fullName,
        res.RoleTitle AS roleTitle,
        'PERSON' AS nodeType,
        (res.SortOrder * 1000) + a.rn AS sortOrder,
        a.AvatarUrl AS avatarUrl,
        res.DefaultColor AS color
      FROM A a
      JOIN Resolved res ON res.RoleKey = a.RoleKey
    )
    SELECT * FROM VacantNodes
    UNION ALL
    SELECT * FROM PersonNodes
    ORDER BY parentId, sortOrder, id;
    `;
  //   const query = `
  //     SELECT
  // r.RoleKey            AS id,
  // r.ParentRoleKey      AS parentId,
  // CAST(NULL AS varchar(200)) AS fullName,
  // r.RoleTitle          AS roleTitle,
  // CAST('VACANT' AS varchar(20)) AS nodeType,
  // r.SortOrder          AS sortOrder,
  // CAST(NULL AS varchar(500)) AS avatarUrl,
  // r.DefaultColor       AS color
  // FROM prod.OrgRoleTemplate r
  // order by SortOrder ;
  //   `;

  const res = await executeWithRetry(() => request.query(query));
console.log(res.recordset);

  return res.recordset;
};

module.exports = TeamService;