const { pool, poolConnect,mssql } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');
const sql = require('mssql');








const SearchToolService = {};



SearchToolService.getAutoCompleteAgentId = (AgentId) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select TOP 10 listAgentIdC as label, listAgentIdC as value from agp_listing_historical where listAgentIdC LIKE '"+AgentId+"%' ";

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

  SearchToolService.getAutoCompleteOffice = (Office,agentId) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('agentId', agentId);
        var query = "select distinct TOP 10 officeName as label, officeId as value from agp_listing_historical where listAgentIdC =@agentId and officeName LIKE '"+Office+"%' ";

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

  SearchToolService.getAutoCompleteAddress = (Address,agentId) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('agentId', agentId);
        var query = "select distinct TOP 10 address as label, officeId as value from agp_listing_historical where listAgentIdC =@agentId and address LIKE '%"+Address+"%' ";

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

  SearchToolService.getAutoCompleteCity = (City,agentId) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('agentId', agentId);
        var query = "select distinct TOP 10  city as label, city as value from agp_listing_historical where listAgentIdC =@agentId and city LIKE '"+City+"%' ";

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

  SearchToolService.getSearchData = (agentId, office, address, city ) => {
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();
          request.input('agentId',sql.BigInt,agentId || null);
          request.input('office',sql.VarChar,office || null);
          request.input('address',sql.VarChar,address || null);
          request.input('city',sql.VarChar,city || null);

         
          // const query =
          //   "SELECT * FROM agp_listing_historical alh " +
          //   "WHERE alh.listAgentIdC = ISNULL(@agentId, alh.listAgentIdC) "+
          //   "AND alh.officeName = ISNULL(@office, alh.officeName) " +
          //   "AND alh.address = ISNULL(@address, alh.address) " +
          //   "AND alh.city = ISNULL(@city, alh.city)";
          // ${agentId ? "AND alh.listAgentIdC = ISNULL(@agentId, alh.listAgentIdC)" : ''} 

            const query =`
             SELECT * FROM agp_listing_historical alh 
             WHERE 1=1
             AND alh.listAgentIdC = @agentId
            ${office ? "AND alh.officeName = ISNULL(@office, alh.officeName)" : ''} 
            ${address ? "AND alh.address = ISNULL(@address, alh.address)" : ''}
            ${city ? "AND alh.city = ISNULL(@city, alh.city)" : ''} `
  
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
  
  //For saved search and favorite option
  SearchToolService.saveSearchHistory = (userId, savedType, agentId,officeName, address, city) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
          
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType',  savedType);
            request.input('agentId',  agentId);
            request.input('officeName',  officeName);
            request.input('address',  address);
            request.input('city',  city);

            console.log('res');
            const query = `
                IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND agentIdC = @agentId AND OfficeName = @officeName AND Address = @address AND City = @city)
                BEGIN
                    INSERT INTO agp_searchHistory (UserId,savedType, agentIdC, OfficeName, Address, City, IsFavorite)
                    VALUES (@userId, @savedType, @agentId, @officeName, @address, @city, 1)
                END
            `;
            request.query(query, (err, res) => {
              //console.log('res');
                if (err) {
                    reject(err);
                    console.log(err);
                    return;
                }
             
  
                resolve(res);
            });
        }).catch(err => {
            reject(err);
        });
    });
  };
  
  SearchToolService.getSearchHistory = (userId,savedType) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType', savedType);
            const query = `
                SELECT savedType, id as idHistory, agentIdC as agentId, OfficeName as officeName, Address as address, City as city, isFavorite
                FROM agp_searchHistory
                WHERE UserId    = @userId
                AND   savedType = @savedType
                ORDER BY CreatedAt DESC
            `;
            request.query(query, (err, res) => {
  
                if (err) {
                  console.log(err);
  
                    reject(err);
                    return;
                }
                resolve(res.recordset);
            });
        }).catch(err => {
            reject(err);
        });
    });
  };
  
  SearchToolService.toggleFavorite = (idHistory, isFavorite) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            const request = pool.request();
            request.input('idHistory',  idHistory);
            request.input('isFavorite',  isFavorite);
            const query = `
                UPDATE agp_searchHistory
                SET IsFavorite = @isFavorite
                WHERE id = @idHistory
            `;
            request.query(query, (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
        }).catch(err => {
            reject(err);
        });
    });
  };
  
  SearchToolService.getFavoriteHistory = (userId,savedType) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType',  savedType);
  
            const query = `
                SELECT savedType, agentIdC as agentId, OfficeName as officeName, Address as address, City as city, isFavorite
                FROM agp_searchHistory
                WHERE UserId = @userId
                AND   isFavorite = 0
                AND   savedType = @savedType
                ORDER BY CreatedAt DESC
            `;
            request.query(query, (err, res) => {
  
                if (err) {
                  console.log(err);
  
                    reject(err);
                    return;
                }
                resolve(res.recordset);
            });
        }).catch(err => {
            reject(err);
        });
    });
  }; 

  

module.exports = SearchToolService;