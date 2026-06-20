const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const Agent = require('../Models/Agent.model');
const Item = require('../Models/Item.model');
const AgentHistoData = require('../Models/AgentHistoData.model');
const StatData = require('../Models/StatData.model');
const ProdData = require('../Models/ProdData.model');
const FutureMetrics = require('../Models/FutureMetrics.model');
const ProdDataFuture = require('../Models/ProdDataFuture.model');
const GeoDataTot = require('../Models/GeoDataTot.model');
const GeoDataReport = require('../Models/GeoDataReport.model');
const AgentRanking = require('../Models/AgentRanking.model');
const OfficeProd = require('../Models/OfficeProd.model');
const TeamAgentsData = require('../Models/TeamAgentsData.model');
const AgentTierPersona = require('../Models/AgentTierPersona.model');
const neo4j = require('neo4j-driver');

const AgentService = {};

// Configure Neo4j driver old
// const driver = neo4j.driver('neo4j+s://05842f39.databases.neo4j.io:7687',
//   neo4j.auth.basic('neo4j', 'XDXTAr1Wh_QxUW8FrddY3sOUDricco8herjRXPszA04'), {
//   disableLosslessIntegers: true,
// });

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



AgentService.findAgentById = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('id', id);

  const query = `
    SELECT TOP 1 agentIdC as agentIdC, firstName as agentfirstName, lastName as agentlastName, 
    officeName, officeCity, officeState, officeId, agentPhone1 as agentPhone, 
    agentEmail, officeAddress1 as officeAddress, officePhone
    FROM agp_agentref 
    WHERE agentIdC = @id
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No agent found with this ID ' + id, 404);
  }

  const agentData = res.recordset[0];
  return new Agent(
    agentData.agentIdC, agentData.agentfirstName, agentData.agentlastName, agentData.officeName,
    agentData.officeCity, agentData.officeState, agentData.officeId, agentData.agentPhone,
    agentData.agentEmail, agentData.officeAddress, agentData.officePhone
  );
};


AgentService.getAgentByName = async (item) => {
  if (!item || item.trim() === '') return [];

  // 1. build search pattern
  const searchTerms = item
    .trim()
    .split(/\s+/)
    .filter(term => term.length > 0)
    .map(term => `"${term}*"`)
    .join(' AND ');

  if (!searchTerms) return [];

  await poolConnect;

  const request = pool.request();
  request.input('searchPattern', mssql.NVarChar, searchTerms);

  const query = `
    SELECT 
      agentId as agentIdC, 
      firstName as agentfirstName, 
      lastName as agentlastName, 
      officeName, 
      officeState
    FROM agp_agent_names
    WHERE CONTAINS(fullName, @searchPattern)
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No matching agents', 404);
  }

  const agents = res.recordset;

  //   extract ids
  const agentIds = agents.map(a => a.agentIdC.toString());

  let teamMap = {};

  const session = driver.session();

  try {
    const neoResult = await session.run(
      `
      MATCH (a:Agent)
      WHERE toString(a.agId) IN $agentIds

      OPTIONAL MATCH (a)-[]-(t:Team)
      WHERE toLower(t.name) <> toLower("The Barbco Group")

      RETURN 
        toString(a.agId) AS agentId,
        collect(DISTINCT {
          teamId: toString(t.teamId),
          teamName: t.name
        }) AS teams
      `,
      { agentIds }
    );

    // map neo4j
    teamMap = neoResult.records.reduce((acc, r) => {
      acc[r.get('agentId')] = r.get('teams') || [];
      return acc;
    }, {});

  } catch (error) {
    //   ignore Neo4j failure
    console.error('Neo4j error:', error.message);
  } finally {
    await session.close();
  }

  // merge 
  const result = agents.map(a => ({
    ...a,
    teams: teamMap[a.agentIdC] || [],
  }));  

  console.log(result);
  return result;
};


AgentService.get_histo_data = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const year1 = new Date().getFullYear();
  const year2 = year1 - 1;
  const year3 = year2 - 1;
  request.input('year1', year1);
  request.input('year2', year2);
  request.input('year3', year3);

  var query = " WITH months(MonthNum) AS			" +
    "        (                         " +
    "            SELECT 1              " +
    "            UNION ALL             " +
    "            SELECT MonthNum+1     " +
    "            FROM months           " +
    "            WHERE MonthNum < 12   " +
    "        ) " +
    "        SELECT   Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName',case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS(Year(GETDATE ()), MonthNum, 1)  " +
    "                                                                                                 when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(Year(GETDATE ())-1, MonthNum, 1) " +
    "                                                                                                 end dateOrd, *" +
    "        FROM                                                                            " +
    "        (                                                                               " +
    "           SELECT LastUpdateYEAR ,lastUpdateMonth,  sum(isnull(Nlistings,0)) Nlistings  " +
    "           FROM agp_ProdDataConsolid                                                    " +
    "            where agentId=@idAgent                                                      " +
    "            and StatusCode='S'                                                          " +
    "            group by LastUpdateYEAR ,lastUpdateMonth                                    " +
    "        ) AS sourceTable                                                                " +
    "        PIVOT                                                                           " +
    "        (                                                                               " +
    "           sum(NListings)                                                               " +
    "           FOR LastUpdateYEAR IN ([" + parseInt(year3) + "], [" + year2 + "],[" + year1 + "])              " +
    "        ) AS pivotTable                                                                 " +
    "         right OUTER JOIN months m on m.MonthNum=LastUpdateMonth                        " +
    "        order by  2";

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0 || res.recordset.every(r => r[year1] === null && r[year2] === null && r[year3] === null)) {
    throw new AppError('No historical data found for this agent ' + id, 404);
  }

  let data = res.recordset.map(obj => Object.values(obj));

  const result = [];
  const year1Arr = [];
  const year2Arr = [];
  const year3Arr = [];
  const currentYear = [];
  const lastYear = [];

  const months = 12 - (new Date().getMonth() + 1);

  for (let i = 0; i < 12; i++) {
    year1Arr.push(data[i][2]);
    year2Arr.push(data[i][1]);
    year3Arr.push(data[i][0]);
  }

  for (let i = 0; i < 12; i++) {
    if (i >= months) {
      currentYear.push(year1Arr[i]);
      lastYear.push(year2Arr[i]);
    } else {
      currentYear.push(year2Arr[i]);
      lastYear.push(year3Arr[i]);
    }
  }
  for (i = 0; i < 12; i++) {
    result.push([data[i][3], lastYear[i], currentYear[i]]);


  }
  return result;
};


AgentService.get_total_past = async (id) => {

  const historicalData = await AgentService.get_histo_data(id);

  let totalCurrent = 0;
  let totalLast = 0;

  for (let i = 0; i < 12; i++) {
    totalCurrent += (historicalData[i][2] || 0);
    totalLast += (historicalData[i][1] || 0);
  }

  return { "current": totalCurrent, "last": totalLast };
};


AgentService.get_total_present = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const query = "select * from (" +
    "        select agentPos,       " +
    "                     sum(isnull(Nlistings,0)) Nlistings " +
    "                     from agp_ProdDataConsolid " +
    "                    where agentId = @idAgent  " +
    "                    and StatusCode='S' " +
    "                    and (      " +
    "                         (sign(month(GETDATE())-LastUpdateMonth)>=0 and LastUpdateYear=YEAR(GETDATE())) or " +
    "                         (sign( month(GETDATE())-LastUpdateMonth)<0 and LastUpdateYear=YEAR(GETDATE())-1)  " +
    "                        )      " +
    "                    group by agentPos " +
    "                    )          " +
    "                    AS datasource " +
    "    PIVOT (                    " +
    "        sum(Nlistings)         " +
    "        FOR AgentPos IN (      " +
    "                            [LIST], " +
    "                            [SELL], " +
    "                            [DNA]  " +
    "                            )  " +
    "    ) AS PivotTable ";

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No current production data found for ID' + id, 404);
  }

  return res.recordset.map(data => new StatData(data.LIST, data.SELL, data.DNA));
};


AgentService.get_Data_Present_Report = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const query = "WITH months(MonthNum) AS	" +
    "              (                      " +
    "                  SELECT 1           " +
    "                  UNION ALL          " +
    "                  SELECT MonthNum+1  " +
    "                  FROM months        " +
    "                  WHERE MonthNum < 12 " +
    "              )                       " +
    "              SELECT Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName',case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS(Year(GETDATE ()), MonthNum, 1)          " +
    "                          when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(Year(GETDATE ())-1, MonthNum, 1)          " +
    "                          end dateOrd , LIST,SELL,DNA                                                                          " +
    "              FROM                                                                                                             " +
    "              ( select LastUpdateYear,                                                                                         " +
    "                      LastUpdateMonth,                                                                              " +
    "                       sum(isnull(Nlistings,0)) Nlistings,                                                                     " +
    "                      AgentPos                                                                                                 " +
    "                      from agp_ProdDataConsolid                                                                                " +
    "                      where agentId = @idAgent                                                                                   " +
    "                      and StatusCode='S'                                                                                       " +
    "                      and (                                                                                                    " +
    "                           (sign(month(GETDATE())-LastUpdateMonth)>=0 and LastUpdateYear=YEAR(GETDATE())) or                   " +
    "                           (sign( month(GETDATE())-LastUpdateMonth)<0 and LastUpdateYear=YEAR(GETDATE())-1)                    " +
    "                          )                                                                                                    " +
    "                      group by AgentPos,LastUpdateYear,LastUpdateMonth                                                         " +
    "              ) as sourceTable                                                                                                 " +
    "                PIVOT(                                                                                                         " +
    "                          sum(Nlistings)                                                                                       " +
    "                          FOR AgentPos IN (                                                                                    " +
    "                              [LIST],                                                                                          " +
    "                              [SELL],                                                                                          " +
    "                              [DNA]                                                                                            " +
    "                              )                                                                                                " +
    "                      ) AS pivot_table                                                                                         " +
    "                      right OUTER JOIN months m on m.MonthNum=LastUpdateMonth                                                  " +
    "                       order by 2                                                                                              ";

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found for the current production report.' + id, 404);
  }

  return res.recordset.map(data => new ProdData(data.MonthName, data.dateOrd, data.LIST, data.SELL, data.DNA));
};


AgentService.get_total_future = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const query = "SELECT  ISNULL(sum(newListings),0) newListings,  ISNULL(sum(existListing),0) existListing, ISNULL(sum(pendingListings),0) pendingListings " +
    "FROM agp_ProdDataConsolidFuture " +
    "where agentId = @idAgent " +
    "and LastUpdateYear = YEAR(GETDATE()) " +
    "and LastUpdateMonth = MONTH(GETDATE()) ";

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No future metrics found. ID' + id, 404);
  }

  return res.recordset.map(data => new FutureMetrics(data.newListings, data.existListing, data.pendingListings));
};


AgentService.get_Data_Future_Report = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const query = "WITH months(MonthNum) AS																		" +
    "        (                                                                                        " +
    "            SELECT 1                                                                             " +
    "            UNION ALL                                                                            " +
    "            SELECT MonthNum+1                                                                    " +
    "            FROM months                                                                          " +
    "            WHERE MonthNum < 12                                                                  " +
    "        )                                                                                        " +
    "        SELECT   Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName', *  " +
    "        FROM                                                                                     " +
    "        (                                                                                        " +
    "           SELECT lastUpdateYEAR ,lastUpdateMonth, newListings,existListing,pendingListings      " +
    "           FROM agp_ProdDataConsolidFuture                                                       " +
    "            where agentId = @idAgent " +
    "            and DATEDIFF(MONTH, datefromparts(LastUpdateYear,LastUpdateMonth,1),getDATE() ) <12  " +
    "        ) AS sourceTable " +
    "        right OUTER JOIN months m on m.MonthNum=LastUpdateMonth " +
    "         order by  case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS( COALESCE(lastUpdateYEAR,Year(GETDATE ())), MonthNum, 1) " +
    "                                                                                                 when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(COALESCE(lastUpdateYEAR,Year(GETDATE ())-1), MonthNum, 1)  " +
    "                                                                                                 end ";

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found for the future metrics report.ID ' + id, 404);
  }

  return res.recordset.map(data => new ProdDataFuture(data.MonthName, data.lastUpdateYEAR, data.lastUpdateMonth, data.newListings, data.existListing,
    data.pendingListings, data.MonthNum));
};


AgentService.get_geo_data_tot = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const query = "SELECT ISNULL(sum(total),0) as total															" +
    "        FROM agp_ProdDataGeo                                                       " +
    "         where agentId=@idAgent                                                    " +
    "and DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <12";

  const res = await executeWithRetry(() => request.query(query));


  if (!res || res.recordset.length === 0) {
    return [0];
  }

  return res.recordset.map(data => data.total);
};


AgentService.get_geo_data_tot10 = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);

  const queryTop10 = `
      SELECT ISNULL(sum(t.total),0) as total 
      FROM (
          SELECT TOP 10 sum(total) as total
          FROM agp_ProdDataGeo
          WHERE agentId = @idAgent AND DATEDIFF(MONTH, datefromparts(listYear, listMonth, 1), getDATE()) < 12
          GROUP BY zipcode
          ORDER BY total DESC
      ) t
  `;

  const [resTop10, totalData] = await Promise.all([
    executeWithRetry(() => request.query(queryTop10)),
    AgentService.get_geo_data_tot(id)
  ]);

  const sum_10 = (resTop10 && resTop10.recordset.length > 0) ? resTop10.recordset[0].total : 0;
  const total = totalData[0] || 0;

  let prct = 0;
  if (total > 0) {
    prct = Math.round((sum_10 * 100) / total);
  }

  return new GeoDataTot(prct);
};

AgentService.get_Data_Geo_Report = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);

  const query = `
      SELECT TOP 10 zipCode, sum(total) as total
      FROM agp_ProdDataGeo
      WHERE agentId = @idAgent
      AND DATEDIFF(MONTH, datefromparts(listYear, listMonth, 1), getDATE()) < 12
      GROUP BY zipcode
      ORDER BY total DESC
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No geographic data found for the report ID ' + id, 404);
  }

  return res.recordset.map(data => new GeoDataReport(data.zipCode, data.total));
};

AgentService.get_agent_ranking = async (id, officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  request.input('officeId', officeId);

  // const query = `
  //     SELECT ar.officeRank as ranking, ar.agentIdC as agentId, ar.firstName, ar.lastName, ar.totPrd as nombre
  //     FROM agp_agentref ar
  //     WHERE agentIdC = @idAgent AND officeid = @officeId
  //     ORDER BY officeRank ASC
  // `;
   const query = `
      SELECT per.officeRank as ranking, ar.agentIdC as agentId, ar.firstName, ar.lastName, per.totalPrd as nombre, officeName
      FROM  agp_agent_persona per
	    inner join agp_agentref ar on per.agentId = ar.agentId
      WHERE officeid = @officeId AND agentIdC = @idAgent 
      ORDER BY per.officeRank ASC
  `;
  

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('Ranking not found for this agent in this office. ID ' + id + ' OfficeID ' + officeId, 404);
  }

  const data = res.recordset[0];
  return new AgentRanking(data.ranking, data.agentId, data.firstName, data.lastName, data.nombre);
};
AgentService.get_office_production = async (id, officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', officeId);

  // const queryOffice = `
  //     SELECT count(distinct agentIdC) as num_agents, sum(totPrd) as nombre
  //     FROM agp_agentref
  //     WHERE officeid = @officeId
  // `;
  const queryOffice = `
      select count(distinct agentIdC) as num_agents, sum(totalPrd) as nombre from agp_agent_persona per
      inner join agp_agentref agref on per.agentId = agref.agentId
      where agref.officeid = @officeId
  `;

  const [officeRes, agentRanking] = await Promise.all([
    executeWithRetry(() => request.query(queryOffice)),
    AgentService.get_agent_ranking(id, officeId)
  ]);

  if (!officeRes || officeRes.recordset.length === 0 || !agentRanking) {
    throw new AppError('Office prod not found for  ID ' + id + ' OfficeID ' + officeId, 404);
  }

  const officeData = officeRes.recordset[0];
  const officeProd = new OfficeProd(officeData.num_agents, officeData.nombre);

  let prctProdOff = 0;
  if (officeProd.nombre > 0) {
    prctProdOff = Math.round((agentRanking.nombre / officeProd.nombre) * 100);
  }

  return {
    "ranking": agentRanking.ranking,
    "numAgents": officeProd.num_agents,
    "officeProd": prctProdOff
  };
};


AgentService.get_Office_Ranking_Report = async (id, officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  request.input('officeId', officeId);

  // const query = `
  //     SELECT ar.officeRank as ranking, ar.agentIdC as agentId, ar.firstName, ar.lastName, ar.totPrd as nombre, officeName
  //     FROM agp_agentref ar
  //     WHERE officeid = @officeId AND (agentIdC = @idAgent OR officeRank <= 10)
  //     ORDER BY ar.officeRank ASC
  // `;

   const query = `
      SELECT per.officeRank as ranking, ar.agentIdC as agentId, ar.firstName, ar.lastName, per.totalPrd as nombre, officeName
      FROM  agp_agent_persona per
	    inner join agp_agentref ar on per.agentId = ar.agentId
      WHERE officeid = @officeId AND (agentIdC = @idAgent OR per.officeRank <= 10)
      ORDER BY per.officeRank ASC
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('Ranking report not found ID ' + id, 404);
  }

  return res.recordset;
};

AgentService.get_team_count_members = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);

  const query = `
      SELECT 
          ISNULL((SELECT COUNT(DISTINCT agenty) FROM agp_agent_rels WHERE agentx = @idAgent), 0) + 
          ISNULL((SELECT COUNT(DISTINCT agentx) FROM agp_agent_rels WHERE agenty = @idAgent), 0) as total
  `;

  const res = await executeWithRetry(() => request.query(query));


  return [res.recordset[0].total];
};

AgentService.get_team_agent_transactions = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);

  const query = `
      SELECT SUM(total) as total 
      FROM agp_agent_rels 
      WHERE agentx = @idAgent OR agenty = @idAgent
  `;

  const res = await executeWithRetry(() => request.query(query));

  return [res.recordset[0].total];
};


AgentService.get_team_data = async (id) => {

  const [count, transactions] = await Promise.all([
    AgentService.get_team_count_members(id),
    AgentService.get_team_agent_transactions(id)
  ]);

  return { "count": count[0], "Transactions": transactions[0] };
};


AgentService.get_team_agents_table = async (idAgent) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', idAgent);

  const query = `
      WITH teams AS (
          SELECT agenty as id, colist, sell, cosell, total FROM agp_agent_rels WHERE agentx = @idAgent
          UNION
          SELECT agentx as id, colist, sell, cosell, total FROM agp_agent_rels WHERE agenty = @idAgent
      )
      SELECT id, ag.firstName, ag.lastName, ag.officeName, 
             SUM(colist) as colist, SUM(cosell) as cosell, SUM(sell) as sell, SUM(total) as total
      FROM teams
      JOIN agp_agentref ag ON teams.id = ag.agentIdC
      GROUP BY id, firstName, lastName, officeName
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No team data found for this agent.', 404);
  }

  return res.recordset.map(teamData =>
    new TeamAgentsData(
      teamData.id, teamData.firstName, teamData.lastName, teamData.officeName,
      teamData.colist, teamData.cosell, teamData.sell, teamData.total
    )
  );
};


AgentService.get_agent_tier_persona = async (idAgent) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', idAgent);

  const query = `SELECT * FROM agp_agent_persona WHERE agentId = @idAgent`;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('Agent persona data not found.', 404);
  }

  return res.recordset.map(data =>
    new AgentTierPersona(data.agentId, data.total, data.dna, data.list, data.sell, data.persona)
  );
};


AgentService.saveSearchHistory = async (userId, savedType, fullName, agentIdC, state) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('fullName', fullName);
  request.input('agentIdC', agentIdC);
  request.input('state', state);

  const query = `
      IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND FullName = @fullName AND State = @state)
      BEGIN
          IF (SELECT COUNT(*) FROM agp_searchHistory WHERE UserId = @userId AND savedType = @savedType) >= 10
          BEGIN
              DELETE FROM agp_searchHistory
              WHERE id IN (
                  SELECT TOP 1 id FROM agp_searchHistory
                  WHERE UserId = @userId AND savedType = @savedType
                  ORDER BY CreatedAt ASC
              )
          END
          INSERT INTO agp_searchHistory (UserId, savedType, FullName, IsFavorite, agentIdC, State)
          VALUES (@userId, @savedType, @fullName, 1, @agentIdC, @state)
      END
  `;

  const result = await executeWithRetry(() => request.query(query));
  return result;
};


AgentService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);

  const query = `
      SELECT savedType, FullName as fullName, isFavorite, agentIdC, state
      FROM agp_searchHistory
      WHERE UserId = @userId AND savedType = @savedType
      ORDER BY CreatedAt DESC
  `;

  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};


AgentService.toggleFavorite = async (agentId, isFavorite) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', agentId);
  request.input('isFavorite', isFavorite);

  const query = `UPDATE agp_searchHistory SET IsFavorite = @isFavorite WHERE agentIdC = @agentId`;

  const res = await executeWithRetry(() => request.query(query));

  if (res.rowsAffected[0] === 0) {
    throw new AppError(`Search history item with agent ID ${agentId} not found.`, 404);
  }

  return res;
};


AgentService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);

  const query = `
      SELECT savedType, FullName as fullName, isFavorite, agentIdC, State
      FROM agp_searchHistory
      WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
      ORDER BY CreatedAt DESC
  `;

  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};


AgentService.deteteNonFavorite = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);

  const query = `
      DELETE FROM agp_searchHistory
      WHERE savedType = @savedType AND UserId = @userId AND IsFavorite = 1;
  `;

  const result = await executeWithRetry(() => request.query(query));
  return result;
};
module.exports = AgentService;