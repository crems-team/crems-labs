const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');

const Item = require('../Models/Item.model');

const LoanOfficerService = {};

LoanOfficerService.findLoanOfficerById = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('id', mssql.VarChar, id);
  const query = "SELECT TOP 1 officer_name as officerName, officeName FROM agp_dna_mls_matching WHERE officer_nmls_id = @id";
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No officer found.', 404);
  return res.recordset[0];
};

LoanOfficerService.getNameLoanOfficer = async (item) => {
  await poolConnect;
  const request = pool.request();
  const query = "SELECT DISTINCT officer_name as label, officer_nmls_id as value FROM agp_dna_mls_matching WHERE officer_name LIKE @name + '%' AND officer_nmls_id IS NOT NULL";
  request.input('name', mssql.VarChar, item);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No data found.', 404);

  return res.recordset;
};

LoanOfficerService.getAgentByName = async (name) => {
  await poolConnect;
  const request = pool.request();
  request.input('name', mssql.VarChar, name);
  const query = "SELECT DISTINCT officer_nmls_id as officerNmlsId, officer_name as officerName, officeName FROM agp_dna_mls_matching WHERE officer_name = @name";
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found.', 404);
  return res.recordset;
};

LoanOfficerService.get_SankeyData = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', mssql.VarChar, id);
  const firstQuery = `
    SELECT TOP 15 listAgentId as agentId, listAgentFirstName+' '+listAgentLastName as Name, COUNT(DISTINCT listingId) total
    FROM agp_dna_mls_matching
    WHERE officer_nmls_id=@idAgent AND listAgentId IS NOT NULL AND listAgentId<>0
      AND DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
    GROUP BY listAgentId, listAgentFirstName+' '+listAgentLastName
    ORDER BY 2 DESC
  `;
  const firstRes = await executeWithRetry(() => request.query(firstQuery));
  if (!firstRes || firstRes.recordset.length === 0)
    throw new AppError('No sankey data found.', 404);
  const agentIds = firstRes.recordset.map(row => row.agentId);

  if (!agentIds.length)
    throw new AppError('No agent found for sankey data.', 404);

  const secondQuery = `
    SELECT agentId, agentFirstName + ' ' + agentLastName AS Name, SUM(ISNULL(Nlistings, 0)) AS Nlistings 
    FROM agp_ProdDataConsolid
    WHERE StatusCode = 'S'
      AND (
        (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
        OR (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
      )
      AND agentId IN (${agentIds.map(id => `'${id}'`).join(',')})
    GROUP BY agentId, agentFirstName + ' ' + agentLastName
  `;
  const secondRes = await executeWithRetry(() => request.query(secondQuery));
  // Join logique comme ton original
  const agentsWithCaptureRate = firstRes.recordset
    .map(agent => {
      const listingData = secondRes.recordset.find(listing => listing.agentId === parseInt(agent.agentId));
      if (!listingData) return null;
      const captureRate = ((agent.total / listingData.Nlistings) * 100).toFixed(2);
      return { ...listingData, total: agent.total, captureRate: parseFloat(captureRate) };
    })
    .filter(agent => agent !== null);
  return { listings: agentsWithCaptureRate };
};

LoanOfficerService.getTotalSalesAndCapRate = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', mssql.VarChar, id);
  const firstQuery = `
    SELECT SUM(total) total FROM (
      SELECT listAgentId, COUNT(DISTINCT listingId) total
      FROM agp_dna_mls_matching
      WHERE officer_nmls_id=@idAgent AND listAgentId IS NOT NULL AND listAgentId<>0
        AND DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
      GROUP BY listAgentId
    ) a
  `;
  const firstRes = await executeWithRetry(() => request.query(firstQuery));
  if (!firstRes || firstRes.recordset.length === 0)
    throw new AppError('No sales data found.', 404);
  const sales = firstRes.recordset[0].total;
  const secondQuery = `
    SELECT SUM(ISNULL(Nlistings, 0)) AS Nlistings 
    FROM agp_ProdDataConsolid
    WHERE StatusCode = 'S'
      AND (
        (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
        OR (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
      )
      AND agentId IN (
        SELECT DISTINCT listAgentId FROM agp_dna_mls_matching
        WHERE officer_nmls_id=@idAgent AND listAgentId IS NOT NULL AND listAgentId<>0
          AND DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
      )
  `;
  const secondRes = await executeWithRetry(() => request.query(secondQuery));
  const Nlistings = secondRes.recordset[0].Nlistings;
  const capRate = Nlistings > 0 ? (sales / Nlistings * 100).toFixed(2) : 0;
  return { sales, capRate };
};

LoanOfficerService.getTotalAgents = async (idAgent) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', mssql.VarChar, idAgent);
  const query = `
    SELECT COUNT(DISTINCT listAgentId) total FROM agp_dna_mls_matching
    WHERE officer_nmls_id=@idAgent AND listAgentId IS NOT NULL AND listAgentId<>0
      AND DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found for this officer.', 404);
  return res.recordset[0];
};

LoanOfficerService.saveSearchHistory = async (userId, savedType, name, officerId) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('name', name);
  request.input('officerId', officerId);
  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND OfficerId = @officerId AND OfficerName = @name
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
      INSERT INTO agp_searchHistory (UserId, savedType, OfficerId, OfficerName, IsFavorite)
      VALUES (@userId, @savedType, @officerId, @name, 1)
    END
  `;
  return await executeWithRetry(() => request.query(query));
};

LoanOfficerService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, id as idHistory, OfficerId as officerId, OfficerName as officerName, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No history found.", 404);
  return res.recordset;
};

LoanOfficerService.toggleFavorite = async (idHistory, isFavorite) => {
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

LoanOfficerService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, OfficerId as officerId, OfficerName as officerName, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError("No favorite found", 404);
  return res.recordset;
};

LoanOfficerService.deteteNonFavorite = async (userId, savedType) => {
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

LoanOfficerService.get_agent_ranking_LO = async (idOfficer, idAgent, officeId) => {
  await poolConnect;
  const request = pool.request();
  request.input('idOfficer', idOfficer);
  request.input('idAgent', idAgent);
  request.input('officeId', officeId);
  const query = `
    SELECT ar.officeRank as ranking, ar.agentIdC agentId, ar.firstName, ar.lastName, ar.totPrd as nombre, officeName,
      (SELECT COUNT(DISTINCT listingId) total
       FROM agp_dna_mls_matching
       WHERE officer_nmls_id=@idOfficer AND listAgentId=ar.agentIdC AND DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1 ) loTxs
    FROM agp_agentref ar
    WHERE (officeRank <= 10 OR agentIdC=@idAgent) AND officeid=@officeId AND ar.totPrd > 0
    ORDER BY officeRank asc
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No ranking found for this officer.', 404);
  const agentsWithPercentage = res.recordset.map(agent => {
    const capturePercentage = agent.nombre > 0
      ? Math.round((agent.loTxs / agent.nombre) * 10000) / 100
      : 0;
    return { ...agent, capturePercentage };
  });
  return agentsWithPercentage;
};

LoanOfficerService.getOfficeNamesLo = async (officerId) => {
  await poolConnect;
  const request = pool.request();
  request.input('officerId', officerId);
  const query = `
    SELECT DISTINCT dna_officeName as officeName FROM agp_dna_mls_matching dna
    WHERE dna.officer_nmls_id=@officerId AND dna.dna_officeName IS NOT NULL
  `;
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};

LoanOfficerService.getDataLOWorkedWithAgent = async (id) => {
  await poolConnect;
  const request = pool.request();
  request.input('idAgent', id);
  const firstQuery = `
    SELECT TOP 15 officer_name as officerName, officer_nmls_id as officerNmlsId, COUNT(DISTINCT listingId) total
    FROM agp_dna_mls_matching dna
    WHERE agentId=@idAgent AND officer_name IS NOT NULL AND officer_nmls_id IS NOT NULL
    GROUP BY officer_name, officer_nmls_id
    HAVING COUNT(DISTINCT listingId)>0
    ORDER BY 3 desc
  `;
  const firstRes = await executeWithRetry(() => request.query(firstQuery));
  if (!firstRes || firstRes.recordset.length === 0)
    throw new AppError('No data found.', 404);
  const secondQuery = `
    SELECT agentFirstName + ' ' + agentLastName AS AgentName, SUM(ISNULL(Nlistings, 0)) AS Nlistings
    FROM agp_ProdDataConsolid
    WHERE StatusCode = 'S' AND (
      (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
      OR (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
    ) AND agentId = @idAgent
    GROUP BY agentFirstName + ' ' + agentLastName
  `;
  const secondRes = await executeWithRetry(() => request.query(secondQuery));
  const Nlistings = secondRes.recordset[0].Nlistings;
  const agentName = secondRes.recordset[0].AgentName;
  const agentsWithCaptureRate = firstRes.recordset
    .map(agent => {
      const captureRate = ((agent.total / Nlistings) * 100).toFixed(2);
      return {
        ...agent,
        agentName,
        captureRate: parseFloat(captureRate)
      };
    })
    .filter(agent => agent !== null);
  return agentsWithCaptureRate;
};

module.exports = LoanOfficerService;
