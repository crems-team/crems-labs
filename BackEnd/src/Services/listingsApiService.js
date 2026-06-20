const axios = require('axios');
const xml2js = require('xml2js');
const { pool, poolConnect, mssql } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');
const AppError = require('../Utils/AppError');
const { executeWithRetry } = require('../Utils/DbUtils');

const ListingsApiService = {};

// --- fetch API ---
ListingsApiService.fetchDataFromAPI = async (params) => {
  const url = 'http://apis.terradatum.com//firstam/firstam/listings-3.0.xml';
  try {
    const response = await axios.get(url, { params });
    const xmlData = response.data;
    const parser = new xml2js.Parser({ explicitArray: false });
    const result = await parser.parseStringPromise(xmlData);
    return result.results.ListingInfo;
  } catch (error) {
    throw new AppError('Error fetching data from external API', 502);
  }
};

// 
ListingsApiService.saveDataToDB = async (listings) => {
  let transaction;
  try {
    transaction = new mssql.Transaction(pool);
    await transaction.begin();

    await transaction.request().query('DELETE FROM api_raw_listings_data');

    const insertQuery = `
      INSERT INTO api_raw_listings_data (
        mlsSid, listAgentId, listAgentFirstName, listAgentLastName, listAgentPhone1, coListAgentId,
        coListAgentFirstName, coListAgentLastName, coListAgentPhone1, sellAgentId, sellAgentFirstName, sellAgentLastName,
        sellAgentPhone1, coSellAgentId, coSellAgentFirstName, coSellAgentLastName, coSellAgentPhone1, dom, city, dateList,
        listPrice, state, address, addressUnit, bank, statusCode, dateStatusChange, zipCode, listingId, listOfficeId,
        listOfficeName, listOfficeStreetName1, listOfficeCity, listOfficeZip, listOfficeState, sellOfficeId, sellOfficeName,
        sellOfficeStreetName1, sellOfficeCity, sellOfficeZip, sellOfficeState
      ) VALUES (
        @mlsSid, @listAgentId, @listAgentFirstName, @listAgentLastName, @listAgentPhone1, @coListAgentId,
        @coListAgentFirstName, @coListAgentLastName, @coListAgentPhone1, @sellAgentId, @sellAgentFirstName, @sellAgentLastName,
        @sellAgentPhone1, @coSellAgentId, @coSellAgentFirstName, @coSellAgentLastName, @coSellAgentPhone1, @dom, @city, @dateList,
        @listPrice, @state, @address, @addressUnit, @bank, @statusCode, @dateStatusChange, @zipCode, @listingId, @listOfficeId,
        @listOfficeName, @listOfficeStreetName1, @listOfficeCity, @listOfficeZip, @listOfficeState, @sellOfficeId, @sellOfficeName,
        @sellOfficeStreetName1, @sellOfficeCity, @sellOfficeZip, @sellOfficeState
      )`;

    for (const listing of listings) {
      const request = transaction.request();
      Object.entries(listing).forEach(([key, value]) => {
        request.input(key, mssql.VarChar, value);
      });
      await request.query(insertQuery);
    }
    await transaction.commit();
    return { success: true };
  } catch (err) {
    if (transaction) await transaction.rollback();
    throw new AppError(`Error saving data: ${err.message}`, 500);
  }
};

// 
ListingsApiService.getTotalRecords = async () => {
  await poolConnect;
  const request = pool.request();
  const query = 'SELECT COUNT(*) as total FROM api_raw_listings_data';
  const result = await executeWithRetry(() => request.query(query));
  return result.recordset[0].total;
};

ListingsApiService.getListings = async (offset, limit) => {
  await poolConnect;
  const request = pool.request();
  request.input('offset', mssql.Int, offset);
  request.input('limit', mssql.Int, limit);
  const query = `
    SELECT * FROM api_raw_listings_data
    ORDER BY dateList DESC
    OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY
  `;
  const result = await executeWithRetry(() => request.query(query));
  return result.recordset;
};

// --- Autocomplete ---
ListingsApiService.getAutoCompleteOffice = async (office) => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT DISTINCT TOP 10 listOfficeName AS label, listOfficeId AS value
    FROM api_raw_listings_data
    WHERE listOfficeName LIKE @office
  `;
  request.input('office', mssql.VarChar, `%${office}%`);
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset.map(item => new Item(item.value, item.label));
};

ListingsApiService.getAutoCompleteAddress = async (address) => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT DISTINCT TOP 10 address AS label, listOfficeId AS value
    FROM api_raw_listings_data
    WHERE address LIKE @address
  `;
  request.input('address', mssql.VarChar, `%${address}%`);
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset.map(item => new Item(item.value, item.label));
};

ListingsApiService.getAutoCompleteCity = async (city) => {
  await poolConnect;
  const request = pool.request();
  const query = `
    SELECT DISTINCT TOP 10 city AS label, city AS value
    FROM api_raw_listings_data
    WHERE city LIKE @city
  `;
  request.input('city', mssql.VarChar, `${city}%`);
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset.map(item => new Item(item.value, item.label));
};

// --- Search ---
ListingsApiService.getSearchData = async (office, address, city) => {
  await poolConnect;
  const request = pool.request();
  if (office)  request.input('office', mssql.VarChar, office);
  if (address) request.input('address', mssql.VarChar, address);
  if (city)    request.input('city', mssql.VarChar, city);

  let query = 'SELECT * FROM api_raw_listings_data WHERE 1=1';
  if (office)  query += ' AND listOfficeName = @office';
  if (address) query += ' AND address = @address';
  if (city)    query += ' AND city = @city';

  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};

// --- Top 1000 ---
ListingsApiService.getListingsTop1000 = async () => {
  await poolConnect;
  const request = pool.request();
  const query = 'SELECT TOP 1000 * FROM api_raw_listings_data';
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset;
};

//
ListingsApiService.getListingsCount = async () => {
  await poolConnect;
  const request = pool.request();
  const query = 'SELECT COUNT(*) as total FROM api_raw_listings_data';
  const res = await executeWithRetry(() => request.query(query));
  return res.recordset[0].total;
};

module.exports = ListingsApiService;