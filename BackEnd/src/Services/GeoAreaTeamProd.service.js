
const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const neo4j = require('neo4j-driver');


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
    disableLosslessIntegers: true, 
  });

function buildWhereClause(
  selectedLocation,
  cityField = 'ag.city',
  stateField = 'ag.state',
  zipField = 'ag.zipcode'
) {
  const {
    city = [],
    zip = [],
    county
  } = selectedLocation;

  const whereClauses = [];

  whereClauses.push(`${stateField} = @state`);

  if (city.length > 0) {
    const cityParams = city
      .map((_, i) => `${cityField} = @city${i}`)
      .join(' OR ');

    whereClauses.push(`(${cityParams})`);
  } else if (county) {
    whereClauses.push(`cty.county_name = @county`);
  }

  if (zip.length > 0) {
    const zipPlaceholders = zip
      .map((_, i) => `@zip${i}`)
      .join(', ');

    whereClauses.push(`${zipField} IN (${zipPlaceholders})`);
  }

  return whereClauses.join(' AND ');
}

const GeoAreaTeamProdService = {};

GeoAreaTeamProdService.getTeamGeoProduction = async (selectedLocation) => {
  await poolConnect;
  const whereClause = buildWhereClause(selectedLocation);
  const request = pool.request();
  request.input('state', mssql.VarChar, selectedLocation.stateCode);
  (selectedLocation.city || []).forEach((city, i) => request.input(`city${i}`, mssql.VarChar, city));
  (selectedLocation.zip || []).forEach((zip, i) => request.input(`zip${i}`, mssql.VarChar, zip));

  if (selectedLocation.county) {
  request.input('county', mssql.VarChar, selectedLocation.county);
  }

  const useCountyFilter =
  (!selectedLocation.city || selectedLocation.city.length === 0) &&
  selectedLocation.county;

  const query = `
  SELECT DISTINCT
    tref.Team_Id as teamId,
    tref.Team_Name as teamName,
    tref.Team_size as teamSize,
    tref.Agents_on_Team as agentsOnTeam,
    tref.Brand as brand,
    tref.Office_name_Brokerage as OfficeNameBrokerage
  FROM agp_teams_refs tref
  WHERE EXISTS (
      SELECT 1
      FROM agp_teamRoleAssignment tr
      INNER JOIN agp_prod_agent_geo ag
          ON UPPER(LTRIM(RTRIM(tr.FullName))) =
             UPPER(LTRIM(RTRIM(ag.firstName + ' ' + ag.lastName)))

      ${
        useCountyFilter
          ? `INNER JOIN us_city cty
               ON ag.state = cty.state_code
              AND ag.city = cty.city`
          : ''
      }

      WHERE UPPER(LTRIM(RTRIM(tr.TeamKey))) =
            UPPER(LTRIM(RTRIM(tref.Team_Name)))
        AND tr.IsActive = 1
        AND ${whereClause}
  )
  ORDER BY tref.Team_Name;
`;

  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0) throw new AppError('No data found', 404);
  return res.recordset;
};

GeoAreaTeamProdService.getAgentTeamTable= async (teamId) => {
  const session = driver.session();
  let agentTeamTableResult = null;


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
    teamId: Number(teamId)
    };                                
  
  try {

      agentTeamTableResult = await session.run(queryAgentTeamTable,params);
      
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
              size: n(record.get('size')),
              countTx: n(record.get('countTx')),
            };
          });
    

    return agents;

  } finally {
    await session.close();
  }
};

module.exports = GeoAreaTeamProdService;
