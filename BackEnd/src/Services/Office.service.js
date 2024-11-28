const { pool, poolConnect } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');
const AgentByOfficeData = require('../Models/AgentByOfficeData');
const Office = require('../Models/Office.model');
const ProdDataPresentOffice = require('../Models/ProdDataPresentOffice.model');
const OfficePresentMetrics = require('../Models/OfficePresentMetrics.model');
const GeoDataReportOffice = require('../Models/GeoDataReportOffice.model');
const OfficeProd = require('../Models/OfficeProd.model');
const AgentRanking = require('../Models/AgentRanking.model');



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
        var query = "select  officeId,officeName,officeCity,officeState,"+
                    "	(select count(agentIdC) from agp_agentref 		"+
                    "                 where officeId = CAST(a.officeId AS nvarchar) "+              
                    "                 group by officeId)nbrAgent        "+
                    "				 from agp_officeref a               "+
                    "where officeId =@officeId";
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
            return new AgentByOfficeData(agent.officeId,agent.officeName,agent.officeCity,agent.officeState,agent.nbrAgent);
          });

  
        resolve(agentByOfficeData);
        });
  
      }).catch(err => {
        reject(err);
      });
    });
    
  };

  OfficeService.findOfficeById = (id) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('id',id);
        var query = "select officeName ,officeAddress1 ,officePhone ,officeCity ,officeState  from agp_officeref "+
                    "where officeId = @id ";
        request.query(query, (err, res) => {

          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
          const office = res.recordset.map(officeData => {
              return new Office(officeData.officeName,officeData.officeAddress1,officeData.officePhone,officeData.officeCity,officeData.officeState);
            });

          resolve(office); 
        });
      }).catch(err => {
        reject(err);
      });
    });
    
  };

  //For saved search and favorite option
  OfficeService.saveSearchHistory = (userId, savedType, officeName, officeId, officeState) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        
          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          request.input('officeName',  officeName);
          request.input('officeId',  officeId);
          request.input('officeState',  officeState);
          console.log('res');
          const query = `
              IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND OfficeName = @officeName AND state = @officeState)
              BEGIN
                  INSERT INTO agp_searchHistory (UserId,savedType, OfficeName, OfficeId, State, IsFavorite)
                  VALUES (@userId, @savedType, @officeName, @officeId, @officeState, 1)
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
              SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite, state
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
              SELECT savedType, OfficeName as officeName, OfficeId as officeId, isFavorite, state
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

OfficeService.get_total_past_Office = (id) => {
  return new Promise((resolve, reject) => {
      try {
        OfficeService.get_histo_data(id) 
              .then(historicalData => {
                  if (!historicalData) {
                      resolve(null);
                      return;
                  }
                  var totalCurrent=0;
                  var totalLast=0;

                  for(i = 0; i < 12; i++) {
                      totalCurrent = totalCurrent + historicalData[i][2];
                      totalLast    = totalLast + historicalData[i][1];
                  } 
                  const totalPast =  JSON.stringify({"current": totalCurrent, "last": totalLast});

                  resolve(totalPast);
              })
              .catch(err => reject(err));
      } catch (err) {
          reject(err); 
      }
  });
};

OfficeService.get_histo_data = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      const year1 = new Date().getFullYear();
      
      
      console.log('year1'+year1);

      const year2 = year1 - 1;
      const year3 = year2 - 1;
      request.input('year1',year1);
      request.input('year2',year2);
      request.input('year3',year3);


      var query = " WITH months(MonthNum) AS			"+
      "        (                         "+
      "            SELECT 1              "+
      "            UNION ALL             "+
      "            SELECT MonthNum+1     "+
      "            FROM months           "+
      "            WHERE MonthNum < 12   "+
      "        ) "+
      "        SELECT   Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName',case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS(Year(GETDATE ()), MonthNum, 1)  "+
      "                                                                                                 when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(Year(GETDATE ())-1, MonthNum, 1) "+
      "                                                                                                 end dateOrd, *"+
      "        FROM                                                                            "+
      "        (                                                                               "+
      "           SELECT LastUpdateYEAR ,lastUpdateMonth,  sum(isnull(Nlistings,0)) Nlistings  "+
      "           FROM agp_ProdDataConsolid                                                    "+
      "            where officeId=@officeId                                                      "+
      "            and StatusCode='S'                                                          "+
      "            group by LastUpdateYEAR ,lastUpdateMonth                                    "+
      "        ) AS sourceTable                                                                "+
      "        PIVOT                                                                           "+
      "        (                                                                               "+
      "           sum(NListings)                                                               "+
      "           FOR LastUpdateYEAR IN (["+parseInt(2024)+"], ["+2023+"],["+2022+"])              "+
      "        ) AS pivotTable                                                                 "+
      "         right OUTER JOIN months m on m.MonthNum=LastUpdateMonth                        "+
      "        order by  2";
      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }
        
        let data = res.recordset.map(obj => Object.values(obj));
         
        const result= [];
        const year1Arr = [];
        const year2Arr =[];
        const year3Arr = [];
        const currentYear= [];
        const lastYear= [];

        const months = 12 - (new Date().getMonth() +1);

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
        for(i = 0; i < 12; i++) {
          result.push([data[i][3],lastYear[i],currentYear[i]]) ; 
          
      
        }
        //const resultJson = JSON.stringify(result);
        resolve(result);
      
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_Office_Data_Present_Report = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query ="WITH months(MonthNum) AS	"+	
      "              (                      "+
      "                  SELECT 1           "+
      "                  UNION ALL          "+
      "                  SELECT MonthNum+1  "+
      "                  FROM months        "+
      "                  WHERE MonthNum < 12 "+
      "              )                       "+
      "              SELECT Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName',case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS(Year(GETDATE ()), MonthNum, 1)          "+
      "                          when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(Year(GETDATE ())-1, MonthNum, 1)          "+
      "                          end dateOrd , LIST,SELL,DNA                                                                          "+
      "              FROM                                                                                                             "+
      "              ( select LastUpdateYear,                                                                                         "+
      "                      LastUpdateMonth,                                                                              "+
      "                       sum(isnull(Nlistings,0)) Nlistings,                                                                     "+
      "                      AgentPos                                                                                                 "+
      "                      from agp_ProdDataConsolid                                                                                "+
      "                      where officeId = @officeId                                                                                   "+
      "                      and StatusCode='S'                                                                                       "+
      "                      and (                                                                                                    "+
      "                           (sign(month(GETDATE())-LastUpdateMonth)>=0 and LastUpdateYear=YEAR(GETDATE())) or                   "+
      "                           (sign( month(GETDATE())-LastUpdateMonth)<0 and LastUpdateYear=YEAR(GETDATE())-1)                    "+
      "                          )                                                                                                    "+
      "                      group by AgentPos,LastUpdateYear,LastUpdateMonth                                                         "+
      "              ) as sourceTable                                                                                                 "+
      "                PIVOT(                                                                                                         "+
      "                          sum(Nlistings)                                                                                       "+
      "                          FOR AgentPos IN (                                                                                    "+
      "                              [LIST],                                                                                          "+
      "                              [SELL],                                                                                          "+
      "                              [DNA]                                                                                            "+
      "                              )                                                                                                "+
      "                      ) AS pivot_table                                                                                         "+
      "                      right OUTER JOIN months m on m.MonthNum=LastUpdateMonth                                                  "+
      "                       order by 2                                                                                              ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }

          const prodDataResult = res.recordset.map(data => {
            return new ProdDataPresentOffice(data.MonthName,data.dateOrd,data.LIST,data.SELL,data.DNA);
          });
      
          resolve(prodDataResult); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_Office_Present_Metrics = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query ="select * from ("+
      "        select agentPos,       "+
      "                     sum(isnull(Nlistings,0)) Nlistings "+
      "                     from agp_ProdDataConsolid "+
      "                    where officeId = @officeId  "+
      "                    and StatusCode='S' "+
      "                    and (      "+
      "                         (sign(month(GETDATE())-LastUpdateMonth)>=0 and LastUpdateYear=YEAR(GETDATE())) or "+ 
      "                         (sign( month(GETDATE())-LastUpdateMonth)<0 and LastUpdateYear=YEAR(GETDATE())-1)  "+
      "                        )      "+
      "                    group by agentPos "+
      "                    )          "+
      "                    AS datasource "+
      "    PIVOT (                    "+
      "        sum(Nlistings)         "+
      "        FOR AgentPos IN (      "+
      "                            [LIST], "+
      "                            [SELL], "+
      "                            [DNA]  "+
      "                            )  "+
      "    ) AS PivotTable ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
          const statDataResult = res.recordset.map(data => {
            return new OfficePresentMetrics(data.LIST,data.SELL,data.DNA);
          });
      
          resolve(statDataResult); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};


OfficeService.get_Office_NbrAgents = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query ="select count(*) nbrAgent from agp_agentref "+
                 "where officeId=@officeId ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }

          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
        
          resolve(res.recordset[0].nbrAgent); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_geo_data_tot = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query = "SELECT ISNULL(sum(total),0) as total	"+														
                  "FROM agp_ProdDataGeo "+    
                  "where officeId= @officeId "+
                  "and DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <12";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }

          const Result = res.recordset.map(data => {
            return data.total;
          });
      
          resolve(Result); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_geo_data_tot10 = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query = "select ISNULL(sum(t.total),0) total from															"+
      "       (SELECT top 10  sum(total) as total                                                "+
      "               FROM agp_ProdDataGeo                                                       "+
      "               where officeId= @officeId                                                    "+
      "                and DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <12   "+
      "               group by zipcode                                                           "+
      "               ORDER by total DESC) t                                                     ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }

           const Result = res.recordset.map(data => {
            return data.total; 
            });
          //
              try {
                OfficeService.get_geo_data_tot(id) 
                      .then(data => {
                          if (!data) {
                              resolve(null);
                              return;
                          }
                          
                          var total= data[0];

                          var sum_10= Result[0];
                          
                          var prct = Math.round((sum_10*100/total));
                          if(isNaN(prct)){
                            prct = 0;
                            
                          }
                        
                          resolve(prct); 

                      })
                      .catch(err => reject(err));
              } catch (err) {
                  reject(err); // Catch any errors that might occur during the process
              }
          

          
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_Office_Data_Geo_Report = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',id);
      
      var query ="SELECT top 10 zipCode ,ISNULL(sum(total),0) as total												"+
                  "FROM agp_ProdDataGeo                                                     "+  
                  " where officeId= @officeId                                                    "+
                  " and DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <12 "+     
                  " group by zipcode                                                        "+  
                  " ORDER by total DESC                                                     ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const geoDataReport = res.recordset.map(data => {
              return new GeoDataReportOffice(data.zipCode,data.total);
            });
            resolve(geoDataReport);       
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};


OfficeService.get_office_production = (officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',officeId);
      
      var query ="select  count(distinct agentIdC) num_agents,  sum(totPrd) nombre from agp_agentref "+
      "where officeid=@officeId";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const officeProd = res.recordset.map(data => {
              return new OfficeProd(data.num_agents,data.nombre);
            });
            resolve(officeProd);          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

OfficeService.get_Office_Ranking_Report = (officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',officeId);
      
      var query ="select  ar.officeRank as ranking,  ar.agentIdC agentId, ar.firstName, ar.lastName, ar.totPrd as nombre, officeName "+
      "from agp_agentref ar "+
      "where officeRank <= 20 and officeid=@officeId "+
      "order by officeRank asc ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const result = res.recordset.map(data => {
              return new AgentRanking(data.ranking, data.agentId,data.firstName,data.lastName,data.nombre,data.officeName);
            });
            resolve(result);       
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

module.exports = OfficeService;