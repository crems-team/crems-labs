
const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const neo4j = require('neo4j-driver');

// Configure Neo4j driver Staging 
  // const driver = neo4j.driver('neo4j+s://7b44f9f9.databases.neo4j.io:7687', 
  //   neo4j.auth.basic('neo4j', '8bXsTQdr3mAMq_xUZg2DJL9PetwASwUSn-KskZI74kA'),{
  //   disableLosslessIntegers: true, 
  // });

    //Configure Neo4j driver Prod
  const driver = neo4j.driver('neo4j+s://e0f2da96.databases.neo4j.io:7687', 
    neo4j.auth.basic('neo4j', 'EpuuDtyOoXBM63LPUZ2r06PyIdTsQkuFqbN7F4EfBF4'),{
    disableLosslessIntegers: true, 
  });

function buildWhereClause(selectedLocation, cityField = 'apag.city', stateField = 'apag.state', zipField = 'apag.zipcode') {
  const { city = [], zip = [] , county} = selectedLocation;
  const whereClauses = [];
  whereClauses.push(`${stateField} = @state`);
  if (city.length > 0) {
    const cityParams = city.map((_, i) => `${cityField} = @city${i}`).join(' OR ');
    whereClauses.push(`(${cityParams})`);
  } else if (county) {
    whereClauses.push(`cty.county_name = @county`);
  }
  if (zip.length > 0) {
    const zipPlaceholders = zip.map((_, i) => `@zip${i}`).join(', ');
    whereClauses.push(`${zipField} IN (${zipPlaceholders})`);
  }
  return whereClauses.join(' AND ');
}

function chunkArray(arr, size) {
  var result = [];
  for (var i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function fetchTeamsByAgents(session, agentIds, chunkSize, concurrency) {
  chunkSize = chunkSize || 500;
  concurrency = concurrency || 3;
  const NEO4J_QUERY = `
  UNWIND $agentIds AS agId
  MATCH (a:Agent)
  WHERE toString(a.agId) = agId
  OPTIONAL MATCH (a)-[]-(t:Team)
  WHERE t IS NOT NULL 
    AND toLower(t.name) <> toLower("The Barbco Group")
  RETURN 
     toString(a.agId) AS agentId,
  [team IN collect(DISTINCT {
    teamId: toString(t.teamId),
    teamName: t.name
  }) WHERE team.teamId IS NOT NULL] AS teams
  `;

  var chunks = chunkArray(agentIds, chunkSize);
  var teamMap = {};
  var i = 0;

  async function worker() {
    while (i < chunks.length) {
      var currentIndex = i++;
      var chunk = chunks[currentIndex];

      var result = await session.run(NEO4J_QUERY, { agentIds: chunk });

      result.records.forEach(function (record) {
        var agentId = record.get("agentId");
        var teams = record.get("teams");
        teamMap[agentId] = teams;
      });
    }
  }

  var workers = [];
  for (var w = 0; w < concurrency; w++) {
    workers.push(worker());
  }

  await Promise.all(workers);

  return teamMap;
}

const GeoAreaAgentProdService = {};

// GeoAreaAgentProdService.getAgentGeoProduction = async (selectedLocation) => {
//   await poolConnect;
//   const whereClause = buildWhereClause(selectedLocation);
//   const request = pool.request();
//   request.input('state', mssql.VarChar, selectedLocation.stateCode);
//   (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
//   (selectedLocation.zip || []).forEach((zip, i) => request.input(`zip${i}`, mssql.VarChar, zip));
//   const query = `
//     WITH aggregated_data AS (
//       SELECT TOP 100
//         agentId, firstName, lastName, state, city, officeName, officeAddress1,
//         total_cur, dna, list, sell, persona,
//         SUM(part_total_curr) as part_total_curr,
//         SUM(part_total_before) as part_total_before,
//         CASE
//           WHEN total_cur >= 25 THEN 'Tier 1'
//           WHEN total_cur >= 13 AND total_cur <= 24 THEN 'Tier 2'
//           WHEN total_cur >= 7 AND total_cur <= 12 THEN 'Tier 3'
//           WHEN total_cur >= 1 AND total_cur <= 6 THEN 'Tier 4'
//           ELSE ''
//         END as tier,
//         total_before
//       FROM agp_prod_agent_geo
//       WHERE ${whereClause}
//       GROUP BY agentId, firstName, lastName, state, city, officeName, officeAddress1,
//         total_cur, dna, list, sell, persona, total_before
//     )
//     SELECT *,
//       CASE
//         WHEN total_before = 0 AND total_cur <> 0 THEN '+100%'
//         WHEN total_before <> 0 AND total_cur = 0 THEN '-100%'
//         WHEN total_before = 0 AND total_cur = 0 THEN '0%'
//         ELSE CONCAT(CAST(ROUND(((total_cur - total_before) * 100 / total_before), 2) AS VARCHAR), '%')
//       END AS agentSalesYoyInOutArea,
//       CASE
//         WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'
//         WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'
//         WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'
//         ELSE CONCAT(CAST(ROUND(((part_total_curr - part_total_before) * 100 / part_total_before), 2) AS VARCHAR), '%')
//       END AS agentSalesYoyInArea
//     FROM aggregated_data
//   `;
  
//   const res = await executeWithRetry(() => request.query(query));
//   if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);

//   // extraction of IDs
//   var agentIds = res.recordset.map(function (a) {
//     return String(a.agentId);
//   });

//   var session = driver.session();

//  var teamMap = {};

//   try {
//     teamMap = await fetchTeamsByAgents(session, agentIds, 500, 3);
//   } catch (err) {
//     console.error("Neo4j error:", err.message);
//     teamMap = {};  
//   } finally {
//     try {
//       await session.close();
//     } catch (e) {}
//   }

//   var enriched = res.recordset.map(function (agent) {
//   var teams = teamMap[String(agent.agentId)] || [];

//     return Object.assign({}, agent, {
//       teams: teams,
//       hasTeam: teams.length > 0
//     });
//   });

//   return enriched;
// };

GeoAreaAgentProdService.getAgentGeoProduction = async (selectedLocation) => {
  await poolConnect;

  //const whereClause = buildWhereClause(selectedLocation);
  const useCountyFilter =
  (!selectedLocation.city || selectedLocation.city.length === 0) &&
  selectedLocation.county;

  const whereClause = useCountyFilter
  ? 'apag.state = @state'
  : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) => {
    request.input(`city${i}`, mssql.VarChar, city);
  });

  (selectedLocation.zip || []).forEach((zip, i) => {
    request.input(`zip${i}`, mssql.VarChar, zip);
  });

  if (selectedLocation.county) {
  request.input('county', mssql.VarChar, selectedLocation.county);
}



  const query = `
        WITH
          ${useCountyFilter ? `
           county_cities AS
          (
              SELECT DISTINCT
                  cty.city
              FROM us_city cty
              WHERE cty.county_name = @county
                AND cty.state_code = @state
          ),
          ` : ''}
          aggregated_data AS (
              SELECT TOP 100
                  apag.agentId,
                  apag.firstName,
                  apag.lastName,
                  apag.state,
                  apag.officeName,
                  apag.officeAddress1,
                  apag.total_cur,
                  apag.dna,
                  apag.list,
                  apag.sell,
                  apag.persona,

                  SUM(apag.part_total_curr) AS part_total_curr,
                  SUM(apag.part_total_before) AS part_total_before,

                  CASE
                      WHEN apag.total_cur >= 25 THEN 'Tier 1'
                      WHEN apag.total_cur BETWEEN 13 AND 24 THEN 'Tier 2'
                      WHEN apag.total_cur BETWEEN 7 AND 12 THEN 'Tier 3'
                      WHEN apag.total_cur BETWEEN 1 AND 6 THEN 'Tier 4'
                      ELSE ''
                  END AS tier,

                  apag.total_before

              FROM agp_prod_agent_geo apag

              ${useCountyFilter ? `
              INNER JOIN county_cities cc
                  ON apag.city = cc.city
              ` : ''}

              WHERE ${whereClause}

              GROUP BY
                  apag.agentId,
                  apag.firstName,
                  apag.lastName,
                  apag.state,
                  apag.officeName,
                  apag.officeAddress1,
                  apag.total_cur,
                  apag.dna,
                  apag.list,
                  apag.sell,
                  apag.persona,
                  apag.total_before
          )

          SELECT
              ad.*,

              CASE
                  WHEN ad.total_before = 0 AND ad.total_cur <> 0 THEN '+100%'
                  WHEN ad.total_before <> 0 AND ad.total_cur = 0 THEN '-100%'
                  WHEN ad.total_before = 0 AND ad.total_cur = 0 THEN '0%'
                  ELSE CONCAT(
                      CAST(
                          ROUND(
                              ((ad.total_cur - ad.total_before) * 100.0 / ad.total_before),
                              2
                          ) AS VARCHAR(30)
                      ),
                      '%'
                  )
              END AS agentSalesYoyInOutArea,

              CASE
                  WHEN ad.part_total_before = 0 AND ad.part_total_curr <> 0 THEN '+100%'
                  WHEN ad.part_total_before <> 0 AND ad.part_total_curr = 0 THEN '-100%'
                  WHEN ad.part_total_before = 0 AND ad.part_total_curr = 0 THEN '0%'
                  ELSE CONCAT(
                      CAST(
                          ROUND(
                              ((ad.part_total_curr - ad.part_total_before) * 100.0 / ad.part_total_before),
                              2
                          ) AS VARCHAR(30)
                      ),
                      '%'
                  )
              END AS agentSalesYoyInArea,

              ISNULL(
                  (
                      SELECT
                          CONVERT(VARCHAR(60), tr.Team_Id) AS teamId,
                          tr.Team_Name AS teamName
                      FROM prod.agp_teams_agents_rels tr
                      WHERE tr.agentIdC = ad.agentId
                        AND tr.Team_Name IS NOT NULL
                        AND tr.Team_Name <> 'The Barbco Group'
                      FOR JSON PATH
                  ),
                  '[]'
              ) AS teams

          FROM aggregated_data ad
          `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  const enriched = res.recordset.map((agent) => {
    let teams = [];

    try {
      teams = JSON.parse(agent.teams || '[]');
    } catch (e) {
      teams = [];
    }

    return {
      ...agent,
      teams,
      hasTeam: teams.length > 0
    };
  });

  return enriched;
};

GeoAreaAgentProdService.searchAgents = async (selectedLocation, searchTerm) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  request.input('searchTerm', mssql.VarChar, `%${searchTerm}%`);

  const query = `
  WITH
    ${useCountyFilter ? `
     county_cities AS
    (
        SELECT DISTINCT cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT DISTINCT TOP 20
      apag.agentId,
      CONCAT(apag.firstName, ' ', apag.lastName) AS fullName

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
      AND CONCAT(apag.firstName, ' ', apag.lastName) LIKE @searchTerm

    ORDER BY fullName
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset;
};
// GeoAreaAgentProdService.getGeoProductionForAgent = async (selectedLocation, agentId) => {
//   await poolConnect;
//   const whereClause = buildWhereClause(selectedLocation);
//   const request = pool.request();
//   request.input('state', mssql.VarChar, selectedLocation.stateCode);
//   (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
//   (selectedLocation.zip || []).forEach((zip, i) => request.input(`zip${i}`, mssql.VarChar, zip));
//   request.input('agentId', mssql.VarChar, agentId);
//   const query = `
//     WITH aggregated_data AS (
//       SELECT agentId, firstName, lastName, state, city, officeName, officeAddress1,
//         total_cur, dna, list, sell, persona,
//         SUM(part_total_curr) as part_total_curr,
//         SUM(part_total_before) as part_total_before,
//         CASE
//           WHEN total_cur >= 25 THEN 'Tier 1'
//           WHEN total_cur >= 13 AND total_cur <= 24 THEN 'Tier 2'
//           WHEN total_cur >= 7 AND total_cur <= 12 THEN 'Tier 3'
//           WHEN total_cur >= 1 AND total_cur <= 6 THEN 'Tier 4'
//           ELSE ''
//         END as tier,
//         total_before
//       FROM agp_prod_agent_geo
//       WHERE ${whereClause} AND agentId = @agentId
//       GROUP BY agentId, firstName, lastName, state, city, officeName, officeAddress1,
//         total_cur, dna, list, sell, persona, total_before
//     )
//     SELECT *,
//       CASE
//         WHEN total_before = 0 AND total_cur <> 0 THEN '+100%'
//         WHEN total_before <> 0 AND total_cur = 0 THEN '-100%'
//         WHEN total_before = 0 AND total_cur = 0 THEN '0%'
//         ELSE CONCAT(CAST(ROUND(((total_cur - total_before) * 100 / total_before), 2) AS VARCHAR), '%')
//       END AS agentSalesYoyInOutArea,
//       CASE
//         WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'
//         WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'
//         WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'
//         ELSE CONCAT(CAST(ROUND(((part_total_curr - part_total_before) * 100 / part_total_before), 2) AS VARCHAR), '%')
//       END AS agentSalesYoyInArea
//     FROM aggregated_data
//   `;
//   const res = await executeWithRetry(() => request.query(query));
//   if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  
//    // extraction of IDs
//   var agentIds = res.recordset.map(function (a) {
//     return String(a.agentId);
//   });

//   var session = driver.session();

//  var teamMap = {};

//   try {
//     teamMap = await fetchTeamsByAgents(session, agentIds, 500, 3);
//   } catch (err) {
//     console.error("Neo4j error:", err.message);
//     teamMap = {};  
//   } finally {
//     try {
//       await session.close();
//     } catch (e) {}
//   }

//   var enriched = res.recordset.map(function (agent) {
//   var teams = teamMap[String(agent.agentId)] || [];

//     return Object.assign({}, agent, {
//       teams: teams,
//       hasTeam: teams.length > 0
//     });
//   });

//   return enriched;
// };
GeoAreaAgentProdService.getGeoProductionForAgent = async (
  selectedLocation,
  agentId
) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) => {
    request.input(`city${i}`, mssql.VarChar, city);
  });

  (selectedLocation.zip || []).forEach((zip, i) => {
    request.input(`zip${i}`, mssql.VarChar, zip);
  });

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  request.input('agentId', mssql.VarChar, agentId);

  const query = `
  WITH
    ${useCountyFilter ? `
     county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    ),
    ` : ''}

    aggregated_data AS (
      SELECT
        apag.agentId,
        apag.firstName,
        apag.lastName,
        apag.state,
        apag.officeName,
        apag.officeAddress1,
        apag.total_cur,
        apag.dna,
        apag.list,
        apag.sell,
        apag.persona,

        SUM(apag.part_total_curr) AS part_total_curr,
        SUM(apag.part_total_before) AS part_total_before,

        CASE
          WHEN apag.total_cur >= 25 THEN 'Tier 1'
          WHEN apag.total_cur BETWEEN 13 AND 24 THEN 'Tier 2'
          WHEN apag.total_cur BETWEEN 7 AND 12 THEN 'Tier 3'
          WHEN apag.total_cur BETWEEN 1 AND 6 THEN 'Tier 4'
          ELSE ''
        END AS tier,

        apag.total_before

      FROM agp_prod_agent_geo apag

      ${useCountyFilter ? `
      INNER JOIN county_cities cc
        ON apag.city = cc.city
      ` : ''}

      WHERE ${whereClause}
        AND apag.agentId = @agentId

      GROUP BY
        apag.agentId,
        apag.firstName,
        apag.lastName,
        apag.state,
        apag.officeName,
        apag.officeAddress1,
        apag.total_cur,
        apag.dna,
        apag.list,
        apag.sell,
        apag.persona,
        apag.total_before
    )

    SELECT
      ad.*,

      CASE
        WHEN ad.total_before = 0 AND ad.total_cur <> 0 THEN '+100%'
        WHEN ad.total_before <> 0 AND ad.total_cur = 0 THEN '-100%'
        WHEN ad.total_before = 0 AND ad.total_cur = 0 THEN '0%'
        ELSE CONCAT(
          CAST(
            ROUND(
              ((ad.total_cur - ad.total_before) * 100.0 / ad.total_before),
              2
            ) AS VARCHAR(30)
          ),
          '%'
        )
      END AS agentSalesYoyInOutArea,

      CASE
        WHEN ad.part_total_before = 0 AND ad.part_total_curr <> 0 THEN '+100%'
        WHEN ad.part_total_before <> 0 AND ad.part_total_curr = 0 THEN '-100%'
        WHEN ad.part_total_before = 0 AND ad.part_total_curr = 0 THEN '0%'
        ELSE CONCAT(
          CAST(
            ROUND(
              ((ad.part_total_curr - ad.part_total_before) * 100.0 / ad.part_total_before),
              2
            ) AS VARCHAR(30)
          ),
          '%'
        )
      END AS agentSalesYoyInArea,

      ISNULL(
        (
          SELECT
            CONVERT(VARCHAR(60), tr.Team_Id) AS teamId,
            tr.Team_Name AS teamName
          FROM prod.agp_teams_agents_rels tr
          WHERE tr.agentIdC = ad.agentId
            AND tr.Team_Name IS NOT NULL
            AND tr.Team_Name <> 'The Barbco Group'
          FOR JSON PATH
        ),
        '[]'
      ) AS teams

    FROM aggregated_data ad
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  const enriched = res.recordset.map((agent) => {
    let teams = [];

    try {
      teams = JSON.parse(agent.teams || '[]');
    } catch (e) {
      teams = [];
    }

    return {
      ...agent,
      teams,
      hasTeam: teams.length > 0
    };
  });

  return enriched;
};
GeoAreaAgentProdService.getNumberOfAgent = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
    ${useCountyFilter ? `
    WITH county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT COUNT(DISTINCT apag.agentId) AS totalAgents

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset[0].totalAgents;
};

GeoAreaAgentProdService.getAgentGeoProductionForExtraction = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
  WITH
    ${useCountyFilter ? `
     county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    ),
    ` : ''}

    aggregated_data AS (
      SELECT
        apag.firstName,
        apag.lastName,
        apag.state,
        apag.city,
        apag.officeName,
        apag.officeAddress1,
        apag.total_cur,
        apag.dna,
        apag.list,
        apag.sell,
        apag.persona,

        SUM(apag.part_total_curr) AS part_total_curr,
        SUM(apag.part_total_before) AS part_total_before,

        CASE
          WHEN apag.total_cur >= 25 THEN 'Tier 1'
          WHEN apag.total_cur BETWEEN 13 AND 24 THEN 'Tier 2'
          WHEN apag.total_cur BETWEEN 7 AND 12 THEN 'Tier 3'
          WHEN apag.total_cur BETWEEN 1 AND 6 THEN 'Tier 4'
          ELSE ''
        END AS tier,

        apag.total_before

      FROM agp_prod_agent_geo apag

      ${useCountyFilter ? `
      INNER JOIN county_cities cc
        ON apag.city = cc.city
      ` : ''}

      WHERE ${whereClause}

      GROUP BY
        apag.agentId,
        apag.firstName,
        apag.lastName,
        apag.state,
        apag.city,
        apag.officeName,
        apag.officeAddress1,
        apag.total_cur,
        apag.dna,
        apag.list,
        apag.sell,
        apag.persona,
        apag.total_before
    )

    SELECT
      *,

      CASE
        WHEN total_before = 0 AND total_cur <> 0 THEN '+100%'
        WHEN total_before <> 0 AND total_cur = 0 THEN '-100%'
        WHEN total_before = 0 AND total_cur = 0 THEN '0%'
        ELSE CONCAT(
          CAST(
            ROUND(
              ((total_cur - total_before) * 100.0 / total_before),
              2
            ) AS VARCHAR(30)
          ),
          '%'
        )
      END AS agentSalesYoyInOutArea,

      CASE
        WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'
        WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'
        WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'
        ELSE CONCAT(
          CAST(
            ROUND(
              ((part_total_curr - part_total_before) * 100.0 / part_total_before),
              2
            ) AS VARCHAR(30)
          ),
          '%'
        )
      END AS agentSalesYoyInArea

    FROM aggregated_data
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset;
};

GeoAreaAgentProdService.getTotalTransactionAgent = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
    ${useCountyFilter ? `
    WITH county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT
      SUM(apag.part_sold_curr) AS totalTransaction

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset[0].totalTransaction;
};

GeoAreaAgentProdService.getTotalListingsAgent = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
    ${useCountyFilter ? `
    WITH county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT
      SUM(apag.part_total_curr) AS totalListings

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset[0].totalListings;
};

// GeoAreaAgentProdService.getListingsGeoProduction = async (selectedLocation) => {
//   await poolConnect;
//   const whereClause = buildWhereClause(selectedLocation, 'cty.city_name', 'cty.state_code', 'pdg.zipcode');
//   const request = pool.request();
//   request.input('state', mssql.VarChar, selectedLocation.stateCode);
//   (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
//   (selectedLocation.zip || []).forEach((zip, i) => request.input(`zip${i}`, mssql.VarChar, zip));
//   const query = `
//     select zipcode, agentId, agentfirstname, agentlastname, [LIST] listings, [SELL] selling, [DNA] dna, 
//     [LIST] + [DNA] total
//     from ( 
//       select zipcode, agentId, agentfirstname, agentlastname, total, AgentPos 
//       from agp_ProdDataGeo pdg
//       inner join us_zips zip on pdg.zipcode = zip.zip
//       inner join us_city cty on zip.city_id = cty.city_id
//       where agentId<>0 and ${whereClause}
//     ) d 
//     pivot ( 
//       sum(total) for AgentPos in ([LIST],[SELL],[DNA]) 
//     ) piv
//     where COALESCE([SELL], 0) > 0
//     order by zipcode, agentId
//   `;
//   const res = await executeWithRetry(() => request.query(query));
//   if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
//   // extraction of IDs
//   var agentIds = res.recordset.map(function (a) {
//     return String(a.agentId);
//   });

//   var session = driver.session();

//  var teamMap = {};

//   try {
//     teamMap = await fetchTeamsByAgents(session, agentIds, 500, 3);
//   } catch (err) {
//     console.error("Neo4j error:", err.message);
//     teamMap = {};  
//   } finally {
//     try {
//       await session.close();
//     } catch (e) {}
//   }

//   var enriched = res.recordset.map(function (agent) {
//   var teams = teamMap[String(agent.agentId)] || [];

//     return Object.assign({}, agent, {
//       teams: teams,
//       hasTeam: teams.length > 0
//     });
//   });

//   return enriched;
// };
GeoAreaAgentProdService.getListingsGeoProduction = async (
  selectedLocation
) => {
  await poolConnect;

  const whereClause = buildWhereClause(
  selectedLocation,
  'cty.city_name',
  'cty.state_code',
  'z.zip'
);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) => {
    request.input(`city${i}`, mssql.VarChar, city);
  });

  (selectedLocation.zip || []).forEach((zip, i) => {
    request.input(`zip${i}`, mssql.VarChar, zip);
  });

  if (selectedLocation.county) {
  request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `      
          WITH county_zips AS
          (
              SELECT z.zip
              FROM us_zips z
              INNER JOIN us_city cty
                  ON z.city_id = cty.city_id
              WHERE ${whereClause}
          ),
          listing_data AS
          (
              SELECT
                  pdg.zipcode,
                  pdg.agentId,
                  pdg.agentfirstname,
                  pdg.agentlastname,

                  SUM(CASE WHEN pdg.AgentPos = 'LIST' THEN pdg.total ELSE 0 END) AS listings,
                  SUM(CASE WHEN pdg.AgentPos = 'SELL' THEN pdg.total ELSE 0 END) AS selling,
                  SUM(CASE WHEN pdg.AgentPos = 'DNA' THEN pdg.total ELSE 0 END) AS dna,

                  SUM(CASE WHEN pdg.AgentPos IN ('LIST', 'DNA')
                          THEN pdg.total ELSE 0 END) AS total

              FROM agp_ProdDataGeo pdg
              INNER JOIN county_zips cz
                  ON pdg.zipcode = cz.zip

              WHERE pdg.agentId <> 0

              GROUP BY
                  pdg.zipcode,
                  pdg.agentId,
                  pdg.agentfirstname,
                  pdg.agentlastname
          )

          SELECT
              ld.*,

              ISNULL(
                  (
                      SELECT
                          CONVERT(VARCHAR(60), tr.Team_Id) AS teamId,
                          tr.Team_Name AS teamName
                      FROM prod.agp_teams_agents_rels tr
                      WHERE tr.agentIdC = ld.agentId
                        AND tr.Team_Name IS NOT NULL
                        AND tr.Team_Name <> 'The Barbco Group'
                      FOR JSON PATH
                  ),
                  '[]'
              ) AS teams

          FROM listing_data ld

          WHERE ld.selling > 0

          ORDER BY
              ld.zipcode,
              ld.agentId;
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  const enriched = res.recordset.map((agent) => {
    let teams = [];

    try {
      teams = JSON.parse(agent.teams || '[]');
    } catch (e) {
      teams = [];
    }

    return {
      ...agent,
      teams,
      hasTeam: teams.length > 0
    };
  });

  return enriched;
};

GeoAreaAgentProdService.getTotalTransactionForListings = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
    ${useCountyFilter ? `
    WITH county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT
      SUM(apag.part_sold_curr) AS totalTransaction

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset[0].totalTransaction;
};

GeoAreaAgentProdService.getTotalAgentsListings = async (selectedLocation) => {
  await poolConnect;
  const whereClause = buildWhereClause(selectedLocation, 'cty.city_name', 'cty.state_code', 'pdg.zipcode');
  const request = pool.request();
  request.input('state', mssql.VarChar, selectedLocation.stateCode);
  (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
  (selectedLocation.zip || []).forEach((zip, i) => request.input(`zip${i}`, mssql.VarChar, zip));
  if (selectedLocation.county) {
  request.input('county', mssql.VarChar, selectedLocation.county);
  }
  const query = `
    select count(*) agents
    from ( 
      select zipcode, agentId, agentfirstname, agentlastname, total,AgentPos 
      from agp_ProdDataGeo pdg
      inner join us_zips zip on pdg.zipcode = zip.zip
      inner join us_city cty on zip.city_id = cty.city_id
      where agentId<>0 and ${whereClause}
    ) d 
    pivot ( 
      sum(total) for AgentPos in ([LIST],[SELL],[DNA]) 
    ) piv 
    where COALESCE([SELL], 0) > 0;
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};

GeoAreaAgentProdService.getTotalAgentForListing = async (selectedLocation) => {
  await poolConnect;

  const useCountyFilter =
    (!selectedLocation.city || selectedLocation.city.length === 0) &&
    selectedLocation.county;

  const whereClause = useCountyFilter
    ? 'apag.state = @state'
    : buildWhereClause(selectedLocation);

  const request = pool.request();

  request.input('state', mssql.VarChar, selectedLocation.stateCode);

  (selectedLocation.city || []).forEach((city, i) =>
    request.input(`city${i}`, mssql.VarChar, city)
  );

  (selectedLocation.zip || []).forEach((zip, i) =>
    request.input(`zip${i}`, mssql.VarChar, zip)
  );

  if (selectedLocation.county) {
    request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const query = `
    ${useCountyFilter ? `
    WITH county_cities AS
    (
        SELECT DISTINCT
            cty.city
        FROM us_city cty
        WHERE cty.county_name = @county
          AND cty.state_code = @state
    )
    ` : ''}

    SELECT
      COUNT(DISTINCT apag.agentId) AS totalAgents

    FROM agp_prod_agent_geo apag

    ${useCountyFilter ? `
    INNER JOIN county_cities cc
      ON apag.city = cc.city
    ` : ''}

    WHERE ${whereClause}
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    throw new AppError('No data found', 404);
  }

  return res.recordset[0].totalAgents;
};

GeoAreaAgentProdService.getZipsbyCityName = async (selectedLocation) => {
  await poolConnect;
  const cityParams = (selectedLocation.city || [])
    .map((_, i) => `city_name = @city${i}`).join(' OR ');
  const request = pool.request();
  (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
  request.input('County', mssql.VarChar, selectedLocation.county);
  const query = `
    SELECT zip_id, zip, lat, lng
    FROM us_zips
    WHERE county_name = @County AND (${cityParams})
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};

GeoAreaAgentProdService.fetchTransactionsGeoByAgent = async (agentId) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', agentId);
  const query = `
    SELECT enhanced_latitude lat, enhanced_longitude lng,
      count(listing_id) nbrlist, count(distinct list_Agent_Id) nbragt,
      max(primary_status + ' ' + street) street, max(zip_5 + '-' + zip_4) zip
    FROM agp_accuzip_enrichment alg
    WHERE list_Agent_Id = @agentId
      AND list_Agent_Id <> 0
      AND enhanced_latitude IS NOT NULL
      AND enhanced_longitude IS NOT NULL
    GROUP BY enhanced_latitude, enhanced_longitude
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};


GeoAreaAgentProdService.saveSearchHistory = async (userId, savedType, city, zips, state, county) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('city', city);
  request.input('zips', zips);
  request.input('state', state);
  request.input('county', county);
  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory
      WHERE UserId = @userId AND savedType = @savedType AND City = @city AND Zips = @zips AND State = @state AND County = @county
    )
    BEGIN
      IF (
        SELECT COUNT(*) FROM agp_searchHistory
        WHERE UserId = @userId AND savedType = @savedType
      ) >= 10
      BEGIN
        DELETE FROM agp_searchHistory
        WHERE id IN (
          SELECT TOP 1 id FROM agp_searchHistory
          WHERE UserId = @userId AND savedType = @savedType
          ORDER BY CreatedAt ASC
        )
      END
      INSERT INTO agp_searchHistory (UserId, savedType, City, Zips, State, County, IsFavorite)
      VALUES (@userId, @savedType, @city, @zips, @state, @county, 1)
    END
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res;
};

GeoAreaAgentProdService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, City as city, Zips as zips, State as state, County as county, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};

GeoAreaAgentProdService.toggleFavorite = async (userId, city, zips, state, county, isFavorite) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('city', city);
  request.input('zips', zips);
  request.input('state', state);
  request.input('county', county);
  request.input('isFavorite', isFavorite);
  const query = `
    UPDATE agp_searchHistory
    SET IsFavorite = @isFavorite
    WHERE UserId = @userId AND City = @city AND Zips = @zips AND State = @state AND County = @county
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res;
};

GeoAreaAgentProdService.toggleFavoriteTeam = async (userId, city, zips, state, county, isFavorite) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('city', city);
  request.input('zips', zips);
  request.input('state', state);
  request.input('county', county);
  request.input('isFavorite', isFavorite);
  const query = `
    UPDATE agp_searchHistory
    SET IsFavorite = @isFavorite
    WHERE UserId = @userId AND savedType = 'areaTeam' AND City = @city AND Zips = @zips AND State = @state AND County = @county
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res;
};

GeoAreaAgentProdService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, City as city, Zips as zips, State as state, County as county, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};

GeoAreaAgentProdService.deteteNonFavorite = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    DELETE FROM agp_searchHistory
    WHERE savedType = @savedType AND UserId = @userId AND IsFavorite = 1;
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res;
};
GeoAreaAgentProdService.getCitiesByCountyFips = async (countyFips) => {
  await poolConnect;
  const request = pool.request();
  request.input('countyFips', countyFips);
  const query = `
    SELECT city_ascii name, city_id code
    FROM us_city
    WHERE county_fips = @countyFips
    ORDER BY city_ascii
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};

GeoAreaAgentProdService.getAllCities = async () => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT city_ascii city, county_fips countyFips,county_name county, state_name state, state_code stateCode
    FROM us_city
    ORDER BY city_ascii
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};

GeoAreaAgentProdService.searchZip = async (term) => {
  if (!term || term.trim() === '') return [];

  await poolConnect;

  const request = pool.request();
  request.input('zip', mssql.VarChar, `${term}%`);

  const query = `
    SELECT TOP 10
      zip,
      city_name AS city,
      county_fips AS countyFips,
      county_name AS county,
      state_name AS state, 
      state_code AS stateCode
    FROM us_zips
    WHERE zip LIKE @zip
    ORDER BY zip
  `;

  const res = await executeWithRetry(() => request.query(query));

  if (!res || res.recordset.length === 0) {
    return [];
  }

  return res.recordset;
};
module.exports = GeoAreaAgentProdService;
