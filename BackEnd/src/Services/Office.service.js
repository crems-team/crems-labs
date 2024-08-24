const { pool, poolConnect } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');
const AgentByOfficeData = require('../Models/AgentByOfficeData');

const OfficeService = {};

OfficeService.getCity = (item) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select distinct officeCity as officeCity  from agp_officeref where officeCity like '"+item+"%' ";
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
            return new Item('',item.officeCity);
          });

  
        resolve(itemObj);
        });
  
      }).catch(err => {
        reject(err);
      });
    });
    
  };

  OfficeService.getOfficeByCity = (city,office) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "select  officeName as label, officeId as value from agp_officeref where officeCity = '"+city+"' and officeName like '"+office+"%'";
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
            return new Item(item.value,item.label);
          });
  
        resolve(itemObj);
        });
  
      }).catch(err => {
        reject(err);
      });
    });
    
  };

  OfficeService.getAgentByOffice = (officeId) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('officeId',officeId);
        var query = "with LIST_SELL as (																												           "+																													
        "            select * from (                                                                                                                   "+
        "                    select agentPos,agentId,                                                                                                  "+
        "                     sum(isnull(Nlistings,0)) Nlistings                                                                                       "+
        "                     from agp_ProdDataConsolid                                                                                                "+
        "                    where  StatusCode='S'                                                                                                     "+
        "                    and (                                                                                                                     "+
        "                         (sign(month(GETDATE())-LastUpdateMonth)>=0 and LastUpdateYear=YEAR(GETDATE())) or                                    "+
        "                         (sign( month(GETDATE())-LastUpdateMonth)<0 and LastUpdateYear=YEAR(GETDATE())-1)                                     "+
        "                        )                                                                                                                     "+
        "                    group by agentPos,agentId                                                                                                 "+
        "                                )                                                                                                             "+
        "                                AS datasource                                                                                                 "+
        "                PIVOT (                                                                                                                       "+
        "                    sum(Nlistings)                                                                                                            "+
        "                    FOR AgentPos IN (                                                                                                         "+
        "                                        [LIST],                                                                                               "+
        "                                        [SELL]                                                                                                "+
        "                                        )                                                                                                     "+
        "                ) AS PivotTable		                                                                                                       "+
        "            )                                                                                                                                 "+
        "            SELECT agentIdC as agentIdC, firstName as agentfirstName ,lastName as agentlastName,officeName,officeCity,                        "+
        "					officeId,agentPhone1 as agentPhone,agentEmail,officeRank,isnull(LIST,0) as list,isnull(SELL,0) as sell FROM agp_agentref a "+
        "            left join LIST_SELL b on a.agentIdC = b.agentId                                                                                   "+
        "            where officeId=@officeId order by officeRank,lastName, firstName desc                                                                            ";
        request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
            resolve([]);
            return;
          }

          const agentByOfficeData = res.recordset.map(agent => {
            return new AgentByOfficeData(agent.agentIdC,agent.agentfirstName,agent.agentlastName,agent.officeName,agent.officeCity,agent.officeId,agent.agentPhone,agent.agentEmail,
              agent.officeRank,agent.list,agent.sell);
          });

  
        resolve(agentByOfficeData);
        });
  
      }).catch(err => {
        reject(err);
      });
    });
    
  };

  //For saved search and favorite option
  OfficeService.saveSearchHistory = (userId, savedType, officeName, officeId) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        
          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          request.input('officeName',  officeName);
          request.input('officeId',  officeId);

          console.log('res');
          const query = `
              IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND OfficeName = @officeName)
              BEGIN
                  INSERT INTO agp_searchHistory (UserId,savedType, OfficeName, OfficeId, IsFavorite)
                  VALUES (@userId, @savedType, @officeName, @officeId, 1)
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

OfficeService.getSearchHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType', savedType);
          const query = `
              SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite
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

OfficeService.toggleFavorite = (userId, officeName, officeId, isFavorite) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
          const request = pool.request();
          request.input('userId',  userId);
          request.input('officeName',  officeName);
          request.input('officeId',  officeId);
          request.input('isFavorite',  isFavorite);
          const query = `
              UPDATE agp_searchHistory
              SET IsFavorite = @isFavorite
              WHERE UserId = @userId AND OfficeName = @officeName AND OfficeId = @officeId
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

OfficeService.getFavoriteHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);

          const query = `
              SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite
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


module.exports = OfficeService;