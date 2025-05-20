const axios = require('axios');
const xml2js = require('xml2js');
const { pool, poolConnect,mssql } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');


// const listingsApiService = {};
async function fetchDataFromAPI(params) {
    const url = 'http://apis.terradatum.com//firstam/firstam/listings-3.0.xml';
    try {
        const response = await axios.get(url, { params });
        const xmlData = response.data;

        // Convertir XML en JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const result = await parser.parseStringPromise(xmlData);
        return result.results.ListingInfo;
    } catch (error) {
        console.error('Error fetching data from API:', error);
        throw error;
    }
}

// Fonction pour sauvegarder les données dans la base de données (SQLite)
async function saveDataToDB(listings) {
    let transaction; // Declare transaction object

    try {

        // Begin a transaction
        transaction = new mssql.Transaction(pool);
        await transaction.begin();

        // Truncate the table (delete all rows)
        const truncateQuery = `DELETE FROM api_raw_listings_data`;
        await transaction.request().query(truncateQuery);
        // console.log('Table truncated.');

        // console.log('After delete');

        // Prepare the INSERT query
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

        // Insert each listing into the database
        for (const listing of listings) {
            const request = transaction.request();
            request
                .input('mlsSid', mssql.VarChar, listing.mlsSid)
                .input('listAgentId', mssql.VarChar, listing.listAgentId)
                .input('listAgentFirstName', mssql.VarChar, listing.listAgentFirstName)
                .input('listAgentLastName', mssql.VarChar, listing.listAgentLastName)
                .input('listAgentPhone1', mssql.VarChar, listing.listAgentPhone1)
                .input('coListAgentId', mssql.VarChar, listing.coListAgentId)
                .input('coListAgentFirstName', mssql.VarChar, listing.coListAgentFirstName)
                .input('coListAgentLastName', mssql.VarChar, listing.coListAgentLastName)
                .input('coListAgentPhone1', mssql.VarChar, listing.coListAgentPhone1)
                .input('sellAgentId', mssql.VarChar, listing.sellAgentId)
                .input('sellAgentFirstName', mssql.VarChar, listing.sellAgentFirstName)
                .input('sellAgentLastName', mssql.VarChar, listing.sellAgentLastName)
                .input('sellAgentPhone1', mssql.VarChar, listing.sellAgentPhone1)
                .input('coSellAgentId', mssql.VarChar, listing.coSellAgentId)
                .input('coSellAgentFirstName', mssql.VarChar, listing.coSellAgentFirstName)
                .input('coSellAgentLastName', mssql.VarChar, listing.coSellAgentLastName)
                .input('coSellAgentPhone1', mssql.VarChar, listing.coSellAgentPhone1)
                .input('dom', mssql.VarChar, listing.dom)
                .input('city', mssql.VarChar, listing.city)
                .input('dateList', mssql.VarChar, listing.dateList)
                .input('listPrice', mssql.VarChar, listing.listPrice)
                .input('state', mssql.VarChar, listing.state)
                .input('address', mssql.VarChar, listing.address)
                .input('addressUnit', mssql.VarChar, listing.addressUnit)
                .input('bank', mssql.VarChar, listing.bank)
                .input('statusCode', mssql.VarChar, listing.statusCode)
                .input('dateStatusChange', mssql.VarChar, listing.dateStatusChange)
                .input('zipCode', mssql.VarChar, listing.zipCode)
                .input('listingId', mssql.VarChar, listing.listingId)
                .input('listOfficeId', mssql.VarChar, listing.listOfficeId)
                .input('listOfficeName', mssql.VarChar, listing.listOfficeName)
                .input('listOfficeStreetName1', mssql.VarChar, listing.listOfficeStreetName1)
                .input('listOfficeCity', mssql.VarChar, listing.listOfficeCity)
                .input('listOfficeZip', mssql.VarChar, listing.listOfficeZip)
                .input('listOfficeState', mssql.VarChar, listing.listOfficeState)
                .input('sellOfficeId', mssql.VarChar, listing.sellOfficeId)
                .input('sellOfficeName', mssql.VarChar, listing.sellOfficeName)
                .input('sellOfficeStreetName1', mssql.VarChar, listing.sellOfficeStreetName1)
                .input('sellOfficeCity', mssql.VarChar, listing.sellOfficeCity)
                .input('sellOfficeZip', mssql.VarChar, listing.sellOfficeZip)
                .input('sellOfficeState', mssql.VarChar, listing.sellOfficeState);

            await request.query(insertQuery);
        }

        // Commit the transaction
        await transaction.commit();
        console.log('Data saved successfully!');
    } catch (err) {
        // Rollback the transaction in case of error
        if (transaction) {
            await transaction.rollback();
        }
        console.error('Error saving data:', err.message);
        throw err; // Re-throw the error for further handling
    } finally {
        // await pool.close();
    }
}
// async function searchListings(criteria) {
//     let query = 'SELECT * FROM listings WHERE 1=1';
//     const params = [];

//     if (criteria.listAgentId) {
//         query += ' AND listAgentId = ?';
//         params.push(criteria.listAgentId);
//     }
//     if (criteria.listOfficeName) {
//         query += ' AND listOfficeName LIKE ?';
//         params.push(`%${criteria.listOfficeName}%`);
//     }
//     if (criteria.city) {
//         query += ' AND city LIKE ?';
//         params.push(`%${criteria.city}%`);
//     }
//     if (criteria.address) {
//         query += ' AND address LIKE ?';
//         params.push(`%${criteria.address}%`);
//     }

//     return new Promise((resolve, reject) => {
//         db.all(query, params, (err, rows) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(rows);
//             }
//         });
//     });
// }
async function getTotalRecords() {
    try {
        await poolConnect;
        const request = pool.request();
        const query = 'SELECT COUNT(*) as total FROM api_raw_listings_data';
        const result = await request.query(query);
        return result.recordset[0].total;
    } catch (error) {
        console.error('Error fetching total records:', error);
        throw error;
    }
};

async function getListings(offset, limit) {
    try {
        await poolConnect;
        const request = pool.request();
        const query = `
            SELECT * FROM api_raw_listings_data
            ORDER BY dateList DESC
            OFFSET @offset ROWS
            FETCH NEXT @limit ROWS ONLY
        `;
        request.input('offset', mssql.Int, offset);
        request.input('limit', mssql.Int, limit);
        const result = await request.query(query);
        return result.recordset;
    } catch (error) {
        console.error('Error fetching listings:', error);
        throw error;
    }
};

async function getAutoCompleteOffice(Office) {

    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select distinct TOP 10 listOfficeName as label, listofficeId as value from api_raw_listings_data where listOfficeName LIKE '%"+Office+"%' ";

        request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
            resolve([]);
            return;
          }
          const itemObj = res.recordset.map(item => {
            return new Item(item.value, item.label );
          });
    
        //resolve(itemObj);

        resolve(itemObj);
        });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

async function getAutoCompleteAddress(Address) {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select distinct TOP 10 address as label, listofficeId as value from api_raw_listings_data where address LIKE '%"+Address+"%' ";

        request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
            resolve([]);
            return;
          }
          const itemObj = res.recordset.map(item => {
            return new Item(item.value, item.label );
          });
    
        
        resolve(itemObj);
        });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

async function getAutoCompleteCity(City) {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select distinct TOP 10  city as label, city as value from api_raw_listings_data where city LIKE '"+City+"%' ";

        request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
            resolve([]);
            return;
          }
          const itemObj = res.recordset.map(item => {
            return new Item(item.value, item.label );
          });
    
        resolve(itemObj);
        });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

async function getSearchData(office, address, city) {
    console.log(office);
    console.log(address);
    console.log(city);
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();

          request.input('office',mssql.VarChar,office || null);
          request.input('address',mssql.VarChar,address || null);
          request.input('city',mssql.VarChar,city || null);

            const query =`
             SELECT * FROM api_raw_listings_data alh 
             WHERE 1=1
            ${office ? "AND alh.listOfficeName = ISNULL(@office, alh.listOfficeName)" : ''} 
            ${address ? "AND alh.address = ISNULL(@address, alh.address)" : ''}
            ${city ? "AND alh.city = ISNULL(@city, alh.city)" : ''} `
  
          request.query(query, (err, res) => {
            if (err) {
              reject(err);
              return;
            }
            console.log(res.recordset);

            resolve(res.recordset);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

async function getListingsTop1000() {
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();

          const query =`SELECT TOP 1000 * FROM api_raw_listings_data alh`
  
          request.query(query, (err, res) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(res.recordset);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  async function getListingsCount() {
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();

          const query =`SELECT count(*) as total FROM api_raw_listings_data alh`
  
          request.query(query, (err, res) => {
            if (err) {
              reject(err);
              return;
            }

            resolve(res.recordset);
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };




module.exports = {
    fetchDataFromAPI,
    saveDataToDB,
    getTotalRecords,
    getListings,
    getAutoCompleteOffice,
    getAutoCompleteAddress,
    getAutoCompleteCity,
    getSearchData,
    getListingsTop1000,
    getListingsCount
};