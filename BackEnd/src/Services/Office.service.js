const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');

const Item = require('../Models/Item.model');
const AgentByOfficeData = require('../Models/AgentByOfficeData');
const Office = require('../Models/Office.model');
const ProdDataPresentOffice = require('../Models/ProdDataPresentOffice.model');
const OfficePresentMetrics = require('../Models/OfficePresentMetrics.model');
const GeoDataReportOffice = require('../Models/GeoDataReportOffice.model');
const OfficeProd = require('../Models/OfficeProd.model');
const AgentRanking = require('../Models/AgentRanking.model');
const OfficeTopCities = require('../Models/OfficeTopCities');

const OfficeService = {};

OfficeService.getCity = async (item) => {
  await poolConnect;
  const request = pool.request();
  const query = "SELECT DISTINCT officeCity as officeCity FROM agp_officeref WHERE officeCity LIKE @city + '%'";
  request.input('city', mssql.VarChar, item);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No city found.', 404);
  return res.recordset.map(item => new Item('', item.officeCity));
};

OfficeService.getOfficeByCity = async (city, office) => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT officeName as label, officeId as value
    FROM agp_officeref
    WHERE officeCity = @city AND officeName LIKE @office + '%'
  `;
  request.input('city', mssql.VarChar, city);
  request.input('office', mssql.VarChar, office);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No office found for this city", 404);
  return res.recordset.map(item => new Item(item.value, item.label));
};

OfficeService.getAgentByOffice = async (officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', mssql.VarChar, officeId);
  const query = `
    SELECT officeId, officeName, officeCity, officeState,
      (SELECT COUNT(agentIdC) FROM agp_agentref WHERE officeId = CAST(a.officeId AS nvarchar)) nbrAgent
    FROM agp_officeref a
    WHERE officeId = @officeId
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No agent found for this office.", 404);
  return res.recordset.map(agent =>
    new AgentByOfficeData(agent.officeId, agent.officeName, agent.officeCity, agent.officeState, agent.nbrAgent)
  );
};

OfficeService.findOfficeById = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('id', mssql.VarChar, id);
  const query = `
    SELECT officeName, officeAddress1, officePhone, officeCity, officeState
    FROM agp_officeref
    WHERE officeId = @id
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No office found with this ID.', 404);
  return res.recordset.map(officeData =>
    new Office(officeData.officeName, officeData.officeAddress1, officeData.officePhone, officeData.officeCity, officeData.officeState)
  );
};

OfficeService.saveSearchHistory = async (userId, savedType, officeName, officeId, officeState) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('officeName', officeName);
  request.input('officeId', officeId);
  request.input('officeState', officeState);
  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory
      WHERE UserId = @userId AND OfficeName = @officeName AND state = @officeState
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
      INSERT INTO agp_searchHistory (UserId, savedType, OfficeName, OfficeId, State, IsFavorite)
      VALUES (@userId, @savedType, @officeName, @officeId, @officeState, 1)
    END
  `;
  return await executeWithRetry(() => request.query(query));
};

OfficeService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite, state
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No history found.", 404);
  return res.recordset;
};

OfficeService.toggleFavorite = async (userId, officeName, officeId, isFavorite) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('officeName', officeName);
  request.input('officeId', officeId);
  request.input('isFavorite', isFavorite);
  const query = `
    UPDATE agp_searchHistory
    SET IsFavorite = @isFavorite
    WHERE UserId = @userId AND OfficeName = @officeName AND OfficeId = @officeId
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (res.rowsAffected[0] === 0)
    throw new AppError("No line to update.", 404);
  return res;
};

OfficeService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite, state
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No favorite found", 404);
  return res.recordset;
};

OfficeService.deteteNonFavorite = async (userId, savedType) => {
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

OfficeService.get_total_past_Office = async (id) => {
  const historicalData = await OfficeService.get_histo_data(id);
  if (!historicalData)
    throw new AppError('No historical data found for this office.', 404);
  let totalCurrent = 0, totalLast = 0;
  for (let i = 0; i < 12; i++) {
    totalCurrent += historicalData[i][2] || 0;
    totalLast += historicalData[i][1] || 0;
  }
  return { current: totalCurrent, last: totalLast };
};

OfficeService.get_histo_data = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const year1 = new Date().getFullYear();
  const year2 = year1 - 1;
  const year3 = year2 - 1;
  request.input('year1', year1);
  request.input('year2', year2);
  request.input('year3', year3);
  const query = `
    WITH months(MonthNum) AS (SELECT 1 UNION ALL SELECT MonthNum+1 FROM months WHERE MonthNum < 12)
    SELECT Convert(char(3), DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS MonthName,
      CASE WHEN SIGN(MONTH(GETDATE())-MonthNum) >= 0 THEN DATEFROMPARTS(YEAR(GETDATE()), MonthNum, 1)
           ELSE DATEFROMPARTS(YEAR(GETDATE())-1, MonthNum, 1)
      END dateOrd, *
    FROM (
      SELECT LastUpdateYEAR, lastUpdateMonth, SUM(ISNULL(Nlistings,0)) Nlistings
      FROM agp_ProdDataConsolid
      WHERE officeId = @officeId AND StatusCode='S'
      GROUP BY LastUpdateYEAR, lastUpdateMonth
    ) AS sourceTable
    PIVOT (
      SUM(NListings)
      FOR LastUpdateYEAR IN ([${year3}], [${year2}], [${year1}])
    ) AS pivotTable
    RIGHT OUTER JOIN months m ON m.MonthNum = lastUpdateMonth
    ORDER BY 2
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No historical data found.', 404);

  let data = res.recordset.map(obj => Object.values(obj));
  const result= [];
  const year1Arr = [], year2Arr = [], year3Arr = [];
  const currentYear= [], lastYear= [];
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
  for (let i = 0; i < 12; i++) {
    result.push([data[i][3], lastYear[i], currentYear[i]]);
  }
  return result;
};

OfficeService.get_Office_Data_Present_Report = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    WITH months(MonthNum) AS (SELECT 1 UNION ALL SELECT MonthNum+1 FROM months WHERE MonthNum < 12)
    SELECT Convert(char(3), DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS MonthName,
      CASE WHEN SIGN(MONTH(GETDATE())-MonthNum) >= 0 THEN DATEFROMPARTS(YEAR(GETDATE()), MonthNum, 1)
           ELSE DATEFROMPARTS(YEAR(GETDATE())-1, MonthNum, 1)
      END dateOrd, LIST, SELL, DNA
    FROM (
      SELECT LastUpdateYear, LastUpdateMonth, SUM(ISNULL(Nlistings,0)) Nlistings, AgentPos
      FROM agp_ProdDataConsolid
      WHERE officeId = @officeId AND StatusCode='S'
        AND (
          (SIGN(MONTH(GETDATE())-LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
          OR (SIGN(MONTH(GETDATE())-LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE())-1)
        )
      GROUP BY AgentPos, LastUpdateYear, LastUpdateMonth
    ) AS sourceTable
    PIVOT (
      SUM(Nlistings) FOR AgentPos IN ([LIST], [SELL], [DNA])
    ) AS pivot_table
    RIGHT OUTER JOIN months m ON m.MonthNum = LastUpdateMonth
    ORDER BY 2
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No production report found.', 404);
  return res.recordset.map(data => new ProdDataPresentOffice(data.MonthName, data.dateOrd, data.LIST, data.SELL, data.DNA));
};

OfficeService.get_Office_Present_Metrics = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    SELECT * FROM (
      SELECT agentPos, SUM(ISNULL(Nlistings,0)) Nlistings
      FROM agp_ProdDataConsolid
      WHERE officeId = @officeId AND StatusCode='S'
        AND (
          (SIGN(MONTH(GETDATE())-LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
          OR (SIGN(MONTH(GETDATE())-LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE())-1)
        )
      GROUP BY agentPos
    ) AS datasource
    PIVOT (
      SUM(Nlistings) FOR AgentPos IN ([LIST], [SELL], [DNA])
    ) AS PivotTable
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No production metrics found.', 404);
  return res.recordset.map(data => new OfficePresentMetrics(data.LIST, data.SELL, data.DNA));
};

OfficeService.get_Office_NbrAgents = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    SELECT COUNT(*) nbrAgent FROM agp_agentref WHERE officeId=@officeId
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found in this office.', 404);
  return res.recordset[0].nbrAgent;
};

OfficeService.get_geo_data_tot = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    SELECT ISNULL(SUM(total),0) as total
    FROM agp_ProdDataGeo
    WHERE officeId = @officeId
      AND DATEDIFF(MONTH, datefromparts(listYear, listMonth, 1), GETDATE()) < 12
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No geographical data found.', 404);
  return res.recordset.map(data => data.total);
};

OfficeService.get_geo_data_tot10 = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    SELECT ISNULL(SUM(t.total),0) total
    FROM (
      SELECT TOP 10 SUM(total) as total
      FROM agp_ProdDataGeo
      WHERE officeId = @officeId
        AND DATEDIFF(MONTH, datefromparts(listYear, listMonth, 1), GETDATE()) < 12
      GROUP BY zipcode
      ORDER BY total DESC
    ) t
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No top zipcode data found.', 404);
  const sum_10 = res.recordset[0].total;
  const totalArr = await OfficeService.get_geo_data_tot(id);
  if (!totalArr)
    throw new AppError('No total data found for the office.', 404);
  const total = totalArr[0] || 0;
  let prct = 0;
  if (total > 0) prct = Math.round((sum_10 * 100) / total);
  return prct;
};

OfficeService.get_Office_Data_Geo_Report = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', id);
  const query = `
    SELECT TOP 10 zipCode, ISNULL(SUM(total),0) as total
    FROM agp_ProdDataGeo
    WHERE officeId = @officeId
      AND DATEDIFF(MONTH, datefromparts(listYear, listMonth, 1), GETDATE()) < 12
    GROUP BY zipcode
    ORDER BY total DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No geographical report found.', 404);
  return res.recordset.map(data => new GeoDataReportOffice(data.zipCode, data.total));
};

OfficeService.get_office_production = async (officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', officeId);
  const query = `
     select count(distinct agentIdC) as num_agents, sum(totalPrd) as nombre from agp_agent_persona per
      inner join agp_agentref agref on per.agentId = agref.agentId
      where agref.officeid = @officeId
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No production data found.', 404);
  return res.recordset.map(data => new OfficeProd(data.num_agents, data.nombre));
};

OfficeService.get_Office_Ranking_Report = async (officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', officeId);
  const query = `
    SELECT per.officeRank as ranking, ar.agentIdC as agentId, ar.firstName, ar.lastName, per.totalPrd as nombre, officeName
      FROM  agp_agent_persona per
	    inner join agp_agentref ar on per.agentId = ar.agentId
      WHERE officeid = @officeId AND per.officeRank <= 10
      ORDER BY per.officeRank ASC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No ranking found for this office', 404);
  return res.recordset.map(data =>
    new AgentRanking(data.ranking, data.agentId, data.firstName, data.lastName, data.nombre, data.officeName)
  );
};

OfficeService.get_Office_Top_Cities = async (officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officeId', officeId);
  const query = `
    SELECT TOP 2 city, COUNT(listingId) nombre
    FROM agp_listings2outref
    WHERE officeId = @officeId
    GROUP BY city
    ORDER BY 2 DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No top city found for this office.', 404);
  return res.recordset.map(data => new OfficeTopCities(data.city, data.nombre));
};

module.exports = OfficeService;
