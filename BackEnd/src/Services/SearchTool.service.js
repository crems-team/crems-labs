const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const { executeWithRetry } = require('../Utils/DbUtils');
const AppError = require('../Utils/AppError');
const Item = require('../Models/Item.model');

// ---------------------------------------------

const SearchToolService = {};

SearchToolService.getAutoCompleteAgentId = async (AgentId) => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT TOP 10 listAgentIdC as label, listAgentIdC as value 
    FROM agp_listing_historical 
    WHERE listAgentIdC LIKE @agentId + '%'
  `;
  request.input('agentId', mssql.VarChar, AgentId);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No agent found.', 404);
  return res.recordset.map(item => new Item(item.value, item.label));
};

SearchToolService.getAutoCompleteOffice = async (Office, agentId) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', mssql.VarChar, agentId);
  const query = `
    SELECT DISTINCT TOP 10 officeName as label, officeId as value 
    FROM agp_listing_historical 
    WHERE listAgentIdC = @agentId AND officeName LIKE @office + '%'
  `;
  request.input('office', mssql.VarChar, Office);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No office found.', 404);
  return res.recordset.map(item => new Item(item.value, item.label));
};

SearchToolService.getAutoCompleteAddress = async (Address, agentId) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', mssql.VarChar, agentId);
  const query = `
    SELECT DISTINCT TOP 10 address as label, officeId as value 
    FROM agp_listing_historical 
    WHERE listAgentIdC = @agentId AND address LIKE '%' + @address + '%'
  `;
  request.input('address', mssql.VarChar, Address);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No address found.', 404);
  return res.recordset.map(item => new Item(item.value, item.label));
};

SearchToolService.getAutoCompleteCity = async (City, agentId) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', mssql.VarChar, agentId);
  const query = `
    SELECT DISTINCT TOP 10 city as label, city as value 
    FROM agp_listing_historical 
    WHERE listAgentIdC = @agentId AND city LIKE @city + '%'
  `;
  request.input('city', mssql.VarChar, City);
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No city found.', 404);
  return res.recordset.map(item => new Item(item.value, item.label));
};

SearchToolService.getSearchData = async (agentId, office, address, city) => {
  await poolConnect;
  const request = pool.request();
  request.input('agentId', mssql.BigInt, agentId || null);
  request.input('office', mssql.VarChar, office || null);
  request.input('address', mssql.VarChar, address || null);
  request.input('city', mssql.VarChar, city || null);

  const query = `
    SELECT * FROM agp_listing_historical alh 
    WHERE 1=1
    AND alh.listAgentIdC = @agentId
    ${office ? "AND alh.officeName = ISNULL(@office, alh.officeName)" : ''} 
    ${address ? "AND alh.address = ISNULL(@address, alh.address)" : ''}
    ${city ? "AND alh.city = ISNULL(@city, alh.city)" : ''}
  `;

  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No data found for your search.', 404);
  return res.recordset;
};

// --- Search history & favorite ---

SearchToolService.saveSearchHistory = async (userId, savedType, agentId, officeName, address, city) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  request.input('agentId', agentId);
  request.input('officeName', officeName);
  request.input('address', address);
  request.input('city', city);

  const query = `
    IF NOT EXISTS (
      SELECT 1 FROM agp_searchHistory
      WHERE UserId = @userId AND agentIdC = @agentId AND OfficeName = @officeName AND Address = @address AND City = @city
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
      INSERT INTO agp_searchHistory (UserId, savedType, agentIdC, OfficeName, Address, City, IsFavorite)
      VALUES (@userId, @savedType, @agentId, @officeName, @address, @city, 1)
    END
  `;
  return await executeWithRetry(() => request.query(query));
};

SearchToolService.getSearchHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);

  const query = `
    SELECT savedType, id as idHistory, agentIdC as agentId, OfficeName as officeName, Address as address, City as city, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No search history found.', 404);
  return res.recordset;
};

SearchToolService.toggleFavorite = async (idHistory, isFavorite) => {
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
    throw new AppError('No search history to update.', 404);
  return res;
};

SearchToolService.getFavoriteHistory = async (userId, savedType) => {
  await poolConnect;
  const request = pool.request();
  request.input('userId', userId);
  request.input('savedType', savedType);
  const query = `
    SELECT savedType, agentIdC as agentId, OfficeName as officeName, Address as address, City as city, isFavorite
    FROM agp_searchHistory
    WHERE UserId = @userId AND isFavorite = 0 AND savedType = @savedType
    ORDER BY CreatedAt DESC
  `;
  const res = await executeWithRetry(() => request.query(query));
  if (!res || res.recordset.length === 0)
    throw new AppError('No favorite found.', 404);
  return res.recordset;
};

SearchToolService.deteteNonFavorite = async (userId, savedType) => {
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
    throw new AppError('No non-favorite entry to delete.', 404);
  return res;
};

module.exports = SearchToolService;
