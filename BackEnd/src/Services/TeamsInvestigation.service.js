const neo4j = require('neo4j-driver');
const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const { query } = require('mssql');
const TeamsInvestigationService = {};


// Configure Neo4j driver OLD
// const driver = neo4j.driver('neo4j+s://05842f39.databases.neo4j.io:7687', 
//     neo4j.auth.basic('neo4j', 'XDXTAr1Wh_QxUW8FrddY3sOUDricco8herjRXPszA04'),{
//     disableLosslessIntegers: true, 
//   });

// Configure Neo4j driver Staging
  // const driver = neo4j.driver('neo4j+s://7b44f9f9.databases.neo4j.io:7687', 
  //   neo4j.auth.basic('neo4j', '8bXsTQdr3mAMq_xUZg2DJL9PetwASwUSn-KskZI74kA'),{
  //   disableLosslessIntegers: true, 
  // });

    //Configure Neo4j driver Prod
  const driver = neo4j.driver('neo4j+s://e0f2da96.databases.neo4j.io:7687', 
    neo4j.auth.basic('neo4j', 'EpuuDtyOoXBM63LPUZ2r06PyIdTsQkuFqbN7F4EfBF4'),{
    // disableLosslessIntegers: true, 
  });

function cleanName(name) {
  return name.replace(/[^\w\s]|_/g, "")
             .replace(/\s+/g, " ")
             .toLowerCase()
             .trim();
}


TeamsInvestigationService.getTeamByName = async (term) => {
  const session = driver.session();

  const cypher = `
    MATCH (t:Team)
    WHERE toLower(t.name) CONTAINS toLower($term)
    MATCH (t)--(a:Agent)
    WHERE a.name IS NOT NULL
    WITH t, count(DISTINCT a) AS validAgentCount
    WHERE validAgentCount > 0
    RETURN
      t.teamId AS id,
      t.name   AS name
    ORDER BY name
    LIMIT 20
  `;
// MATCH (t:Team)
//     WITH t.teamId AS teamId, collect(DISTINCT t)[0] AS t
//     WHERE toLower(t.name) CONTAINS toLower($term)
//     RETURN
//       teamId AS id,
//       t.name AS name
//     ORDER BY name
//     LIMIT 20
  try {
    const result = await session.run(cypher, { term });

    const items = result.records.map((record) => {
      const id = record.get('id').toString();
      const name = record.get('name');

      
      return {
        value: id,  
        label: name,
      };
    });

    if (!items || items.length === 0) {
      throw new AppError('No data found.', 404);
    }

    return items;
  } finally {
    await session.close();
  }
};


TeamsInvestigationService.getTeam= async (teamId) => {

  const session = driver.session();

  const queryNode = `MATCH (a:Team{teamId:${teamId}})
  return 't'+a.teamId as id, a.name as name,a.office as office,a.size as size, a.color as color
  union
  MATCH (a:Team{teamId:${teamId}})-[r*1]-(b)
  return 'a'+b.agId as id, b.name as name,b.office as office,b.size as size, b.color as color`;

  const queryLinks = `MATCH (n:Team{teamId:${teamId}})-[r*1]-(m)
  unwind r as rels
  return 'a'+startNode(rels).agId as target,'t'+endNode(rels).teamId as source,rels.size as size,rels.role as role`;

  try {
    const nodeResult = await session.run(queryNode);
    const linkResult = await session.run(queryLinks);

    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {

      const     id   = record.get('id');
      const     name =record.get('name');
      const     office= record.get('office');
      let       size = record.get('size').toNumber();
      let       color= record.get('color');

      if (/^t\d+$/i.test(id)) {
        color = "#379ffaff"
      }
      
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
      if (size === 0) {
        size = 3;
      }

        nodes.push({
            id: id,
            name: name,
            office: office,
            size: size,
            color: color,
        });
     
       
      
    });

    // console.log(nodes);

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source');
      const targetNodeId = record.get('target');
      const size = record.get('size');
      const role = record.get('role');

      // const office     = record.get('office').toString();



      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        role: role,
        
      });
    });

  


    
    return { nodes, links };


  } finally {
    await session.close();
  }
};

TeamsInvestigationService.getAgentsByTeamId = async (id) => {
  const session = driver.session();

  const teamId = neo4j.int(id);

  const cypher = `
    MATCH (t:Team {teamId: $teamId})--(agent:Agent)
    RETURN
      agent.agId    AS agId,
      agent.name    AS name,
      agent.office  AS office,
      agent.officeid AS officeId,
      agent.tier    AS tier,
      agent.persona AS persona,
      agent.phone   AS phone,
      agent.email   AS email,
      agent.color   AS color,
      agent.size    AS size,
      agent.countTx AS countTx
    ORDER BY name
  `;

  try {
    const result = await session.run(cypher, { teamId });

    const items = result.records.map((record) => {
      // helper local: null/undefined => ""
      const s = (v) => (v === null || v === undefined ? '' : v);
      // helper local: null/undefined => 0
      const n = (v) => (v === null || v === undefined ? 0 : v);

      const agId = record.get('agId');
      const name = record.get('name');

      return {  
        agId: n(agId),
        name: s(name),
        office: s(record.get('office')),
        officeId: s(record.get('officeId')),
        tier: s(record.get('tier')),
        persona: s(record.get('persona')),
        phone: s(record.get('phone')),
        email: s(record.get('email')),
        color: s(record.get('color')),
        size: n(record.get('size').toNumber()),
        countTx: n(record.get('countTx').toNumber()),
      };
    });

    if (!items || items.length === 0) {
      throw new AppError('No agents found for this team.', 404);
    }

    return items;
  } finally {
    await session.close();
  }
};

TeamsInvestigationService.getTeamByFilter= async (id,filterCriteria) => {

  const session = driver.session();
  const { office,typeTable, tiers } = filterCriteria;

    const teamId = neo4j.int(id);


  const queryNode = `MATCH (t:Team { teamId: $teamId })
                      RETURN
                        't' + toString(t.teamId) AS id,
                        t.name  AS name,
                        t.office AS office,
                        t.size  AS size,
                        t.color AS color
                      UNION
                      MATCH (t:Team { teamId: $teamId })-[r*1]-(m)
                      UNWIND r AS rels
                      WITH t, rels,
                          startNode(rels) AS s,
                          endNode(rels)   AS e
                      WHERE (s:Agent OR e:Agent OR s:Team OR e:Team)
                        AND (
                          (s:Team AND s.teamId = $teamId) OR
                          (e:Team AND e.teamId = $teamId)
                        )
                        AND (NOT $removeT0 OR ( ((s:Agent AND s.tier <> 'T0') OR s:Team) AND ((e:Agent AND e.tier <> 'T0') OR e:Team) ))
                        AND (NOT $removeT1 OR ( ((s:Agent AND s.tier <> 'T1') OR s:Team) AND ((e:Agent AND e.tier <> 'T1') OR e:Team) ))
                        AND (NOT $removeT2 OR ( ((s:Agent AND s.tier <> 'T2') OR s:Team) AND ((e:Agent AND e.tier <> 'T2') OR e:Team) ))
                        AND (NOT $removeT3 OR ( ((s:Agent AND s.tier <> 'T3') OR s:Team) AND ((e:Agent AND e.tier <> 'T3') OR e:Team) ))
                        AND (NOT $removeT4 OR ( ((s:Agent AND s.tier <> 'T4') OR s:Team) AND ((e:Agent AND e.tier <> 'T4') OR e:Team) ))
                        AND (NOT $onlyThisOffice OR
                            ( ((s:Agent AND s.office = t.office) OR s:Team) AND
                              ((e:Agent AND e.office = t.office) OR e:Team) )
                        )
                      WITH
                        CASE WHEN s:Agent THEN s
                            WHEN e:Agent THEN e
                        END AS a
                      WHERE a IS NOT NULL
                      RETURN DISTINCT
                        'a' + toString(a.agId) AS id,
                        a.name  AS name,
                        a.office AS office,
                        a.size  AS size,
                        a.color AS color
                      ORDER BY name
                      `;

  const queryLinks = `MATCH (t:Team { teamId: $teamId })-[r*1]-(m)
                      UNWIND r AS rels
                      WITH t, rels,
                          startNode(rels) AS s,
                          endNode(rels)   AS e
                      WHERE (s:Agent OR e:Agent OR s:Team OR e:Team)
                        AND (
                          (s:Team AND s.teamId = $teamId) OR
                          (e:Team AND e.teamId = $teamId)
                        )
                        AND (NOT $removeT0 OR ( ((s:Agent AND s.tier <> 'T0') OR s:Team) AND ((e:Agent AND e.tier <> 'T0') OR e:Team) ))
                        AND (NOT $removeT1 OR ( ((s:Agent AND s.tier <> 'T1') OR s:Team) AND ((e:Agent AND e.tier <> 'T1') OR e:Team) ))
                        AND (NOT $removeT2 OR ( ((s:Agent AND s.tier <> 'T2') OR s:Team) AND ((e:Agent AND e.tier <> 'T2') OR e:Team) ))
                        AND (NOT $removeT3 OR ( ((s:Agent AND s.tier <> 'T3') OR s:Team) AND ((e:Agent AND e.tier <> 'T3') OR e:Team) ))
                        AND (NOT $removeT4 OR ( ((s:Agent AND s.tier <> 'T4') OR s:Team) AND ((e:Agent AND e.tier <> 'T4') OR e:Team) ))
                        AND (NOT $onlyThisOffice OR
                            ( ((s:Agent AND s.office = t.office) OR s:Team) AND
                              ((e:Agent AND e.office = t.office) OR e:Team) )
                        )
                      WITH t, rels, s, e
                      WHERE (s:Team AND e:Agent) OR (s:Agent AND e:Team)
                      RETURN DISTINCT
                        't' + toString(t.teamId)                        AS source,
                        'a' + toString( CASE WHEN s:Agent THEN s.agId ELSE e.agId END ) AS target,
                        rels.size                                       AS size,
                        rels.role                                       AS role
                      `;

      const params = {
      teamId: teamId,
      removeT0: !!tiers?.T0,
      removeT1: !!tiers?.T1,
      removeT2: !!tiers?.T2,
      removeT3: !!tiers?.T3,
      removeT4: !!tiers?.T4,
      onlyThisOffice: !!office
      };      
  try {
    const nodeResult = await session.run(queryNode, params);
    const linkResult = await session.run(queryLinks, params);

    const nodes = [];
    const links = [];

    nodeResult.records.forEach(record => {

      const   id= record.get('id');
      const   name =record.get('name');
      const   office= record.get('office');
      let     size = record.get('size').toNumber();
      let     color= record.get('color');
      
      if (/^t\d+$/i.test(id)) {
        color = "#379ffaff"
      }
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
      if (size === 0) {
        size = 3;
      }

        nodes.push({
            id: id,
            name: name,
            office: office,
            size: size,
            color: color,
        });
     
       
      
    });

    // console.log(nodes);

    linkResult.records.forEach(record => {
      const sourceNodeId = record.get('source');
      const targetNodeId = record.get('target');
      const size = record.get('size');
      const role = record.get('role');

      // const office     = record.get('office').toString();



      links.push({
        source: sourceNodeId,
        target: targetNodeId,
        size : size,
        role: role,
        
      });
    });

  


    
    return { nodes, links };

  } finally {
    await session.close();
  }
};

TeamsInvestigationService.getAgentTeamTable= async (id,filterCriteria) => {
  const session = driver.session();
  const { office,typeTable, tiers } = filterCriteria;
  let agentTeamTableResult = null;

  const teamId = neo4j.int(id);


  const queryAgentTeamTable = `MATCH (t:Team { teamId: $teamId })-[r*1]-(m)
                              UNWIND r AS rels
                              WITH t, rels,
                                  startNode(rels) AS s,
                                  endNode(rels)   AS e
                              WHERE (s:Agent OR e:Agent OR s:Team OR e:Team)
                              AND (
                                (s:Team AND s.teamId = $teamId) OR
                                (e:Team AND e.teamId = $teamId)
                              )
                              AND (NOT $removeT0 OR ( (s:Agent AND s.tier <> 'T0') OR s:Team ) AND ( (e:Agent AND e.tier <> 'T0') OR e:Team ))
                              AND (NOT $removeT1 OR ( (s:Agent AND s.tier <> 'T1') OR s:Team ) AND ( (e:Agent AND e.tier <> 'T1') OR e:Team ))
                              AND (NOT $removeT2 OR ( (s:Agent AND s.tier <> 'T2') OR s:Team ) AND ( (e:Agent AND e.tier <> 'T2') OR e:Team ))
                              AND (NOT $removeT3 OR ( (s:Agent AND s.tier <> 'T3') OR s:Team ) AND ( (e:Agent AND e.tier <> 'T3') OR e:Team ))
                              AND (NOT $removeT4 OR ( (s:Agent AND s.tier <> 'T4') OR s:Team ) AND ( (e:Agent AND e.tier <> 'T4') OR e:Team ))
                              AND (NOT $onlyThisOffice OR
                                  ( (s:Agent AND s.office = t.office) OR s:Team ) AND
                                  ( (e:Agent AND e.office = t.office) OR e:Team )
                              )
                              WITH CASE
                                    WHEN s:Agent THEN s
                                    WHEN e:Agent THEN e
                                  END AS a
                              WHERE a IS NOT NULL
                              RETURN DISTINCT
                                toString(a.agId)     AS agId,
                                a.name     AS name,
                                a.office   AS office,
                                a.persona  AS persona,
                                a.tier     AS tier,
                                a.color    AS color,
                                a.size     AS size,
                                a.countTx  AS countTx,
                                a.officeid AS officeid,
                                a.phone    AS phone,
                                a.email    AS email
                              ORDER BY a.name;
                              `;
    const params = {
    teamId: teamId,
    removeT0: !!tiers?.T0,
    removeT1: !!tiers?.T1,
    removeT2: !!tiers?.T2,
    removeT3: !!tiers?.T3,
    removeT4: !!tiers?.T4,
    onlyThisOffice: !!office
    };                                
  
  try {
      
      agentTeamTableResult = await session.run(queryAgentTeamTable,params);
            console.log(queryAgentTeamTable);

      const agents = agentTeamTableResult.records.map((record) => {
            // helper local: null/undefined => ""
            const s = (v) => (v === null || v === undefined || v === 0 ? '' : v);
            // helper local: null/undefined => 0
            const n = (v) => (v === null || v === undefined ? 0 : v);

            const agId = record.get('agId');
            const name = record.get('name');

            return {  
              agId: agId,
              name: s(name),
              office: s(record.get('office')),
              officeId: s(record.get('officeid')),
              tier: s(record.get('tier')),
              persona: s(record.get('persona')),
              phone: s(record.get('phone')),
              email: s(record.get('email')),
              color: s(record.get('color')),
              size: n(record.get('size')).toNumber(),
              countTx: n(record.get('countTx')).toNumber(),
            };
          });
    

    return agents;

  } finally {
    await session.close();
  }
};

//Save search - saved search - favorite

TeamsInvestigationService.saveSearchHistory = async (userId, savedType, teamName, teamId) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('teamName', teamName);
  request.input('teamId', teamId);
  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND TeamId = @teamId
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
      INSERT INTO agp_searchHistory (UserId, savedType, TeamName, TeamId, IsFavorite)
      VALUES (@userId, @savedType, @teamName, @teamId, 1)
    END
  `;
  return await executeWithRetry(() => request.query(query));
};

TeamsInvestigationService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, id as idHistory, TeamName as teamName, TeamId as teamId, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  // if (!res || res.recordset.length === 0)
  //   throw new AppError("No history found.", 404);
  return res.recordset;
};

TeamsInvestigationService.toggleFavorite = async (idHistory, isFavorite) => {
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

TeamsInvestigationService.deteteNonFavorite = async (userId, savedType) => {
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

TeamsInvestigationService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, TeamName as teamName, TeamId as teamId, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No favorite found", 404);
  return res.recordset;
};

TeamsInvestigationService.getTeamInfos = async (teamId) => {
  await poolConnect;
  const request = pool.request();
  request.input('teamId', teamId);

  const query = `   
  select TOP 1 ISNULL(NULLIF(Team_Name, 'NULL'), '') as teamName,ISNULL(NULLIF(Team_size, 'NULL'), '') as teamSize, ISNULL(NULLIF(Agents_on_Team, NULL), '') as agentsOnteam ,
  ISNULL(NULLIF(Brand, 'NULL'), '') as brand, ISNULL(NULLIF(Office_name_Brokerage, 'NULL'), '') as officeNameBrokerage,
  ISNULL(NULLIF(Team_website, 'NULL'), '') as teamWebsite, ISNULL(Team_Id, '')  as teamId  from  agp_teams_refs
  where Team_Id = @teamId
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No team found with this Id '+ teamId, 404);
  }

  return res.recordset[0];
};


module.exports = TeamsInvestigationService;