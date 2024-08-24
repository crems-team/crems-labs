const { pool, poolConnect,mssql } = require('../Config/DbConfig');
const Agent = require('../Models/Agent.model');
const Item = require('../Models/Item.model');
const AgentHistoData = require('../Models/AgentHistoData.model');
const StatData = require('../Models/StatData.model');
const ProdData = require('../Models/ProdData.model');
const FutureMetrics = require('../Models/FutureMetrics.model');
const ProdDataFuture = require('../Models/ProdDataFuture.model');
const GeoDataTot = require('../Models/GeoDataTot.model');
const GeoDataReport = require('../Models/GeoDataReport.model');
const AgentRanking = require('../Models/AgentRanking.model');
const OfficeProd = require('../Models/OfficeProd.model');
const TeamAgentsData = require('../Models/TeamAgentsData.model');
const AgentTierPersona = require('../Models/AgentTierPersona.model');








const AgentService = {};

AgentService.findAgentById = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('id',id);
      var query = "SELECT top 1 agentIdC as agentIdC, firstName as agentfirstName ,lastName as agentlastName,officeName,"+
      " officeCity,officeState,officeId,agentPhone1 as agentPhone,agentEmail,officeAddress1 as officeAddress,officePhone"+
      " FROM agp_agentref where agentIdC=@id";
      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }
        console.log(res.recordset[0]);
        const agent = res.recordset.map(agentData => {
            return new Agent(agentData.agentIdC, agentData.agentfirstName, agentData.agentlastName,agentData.officeName, 
                agentData.officeCity, agentData.officeState, agentData.officeId, agentData.agentPhone,agentData.agentEmail ,
                 agentData.officeAddress, agentData.officePhone );
          });
    
        resolve(agent); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.getLastName = (item) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query = "SELECT distinct lastName as label, min(agentIdC) as value FROM agp_agentref where lastName LIKE '"+item+"%' group by lastName order by lastName"
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

  AgentService.getFirstName = (lastName,firstName) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('lastName',lastName);
        var query = "SELECT distinct firstName as label, agentIdC as value FROM agp_agentref where lastName = '"+lastName+"' and firstName LIKE '"+firstName+"%' order by firstName";
        request.query(query, (err, res) => {
            if (err) {
                reject(err);
                return;
            }
            if (res.recordset.length === 0) {
                resolve(null);
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
  AgentService.getAgentByName = (lastName,firstName) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('lastName',lastName);
        request.input('firstName',firstName);
        
        var query = "SELECT top 1 agentIdC as agentIdC, firstName as agentfirstName ,lastName as agentlastName,officeName,officeCity,officeId,agentPhone1 as agentPhone,agentEmail   FROM agp_agentref where lastName = @lastName and firstName = @firstName";
        request.query(query, (err, res) => {
            console.log(res.recordset);
            if (err) {
                reject(err);
                return;
            }
            if (res.recordset.length === 0) {
                resolve(null);
                return;
              }
            const agent = res.recordset.map(agentData => {
              return new Agent(agentData.agentIdC, agentData.agentfirstName, agentData.agentlastName,agentData.officeName, 
                  agentData.officeCity, agentData.officeState, agentData.officeId, agentData.agentPhone,agentData.agentEmail ,
                   agentData.officeAddress1, agentData.officePhone );
            });
        
            resolve(agent); 
          });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

  AgentService.get_histo_data = (id) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('idAgent',id);
        const year1 = new Date().getFullYear();
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
        "            where agentId=@idAgent                                                      "+
        "            and StatusCode='S'                                                          "+
        "            group by LastUpdateYEAR ,lastUpdateMonth                                    "+
        "        ) AS sourceTable                                                                "+
        "        PIVOT                                                                           "+
        "        (                                                                               "+
        "           sum(NListings)                                                               "+
        "           FOR LastUpdateYEAR IN (["+parseInt(year3)+"], ["+year2+"],["+year1+"])              "+
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

  AgentService.get_total_past = (id) => {
    return new Promise((resolve, reject) => {
        try {
            AgentService.get_histo_data(id) 
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
            reject(err); // Catch any errors that might occur during the process
        }
    });
};

AgentService.get_total_present = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query ="select * from ("+
      "        select agentPos,       "+
      "                     sum(isnull(Nlistings,0)) Nlistings "+
      "                     from agp_ProdDataConsolid "+
      "                    where agentId = @idAgent  "+
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
            return new StatData(data.LIST,data.SELL,data.DNA);
          });
      
          resolve(statDataResult); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_Data_Present_Report = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
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
      "                      where agentId = @idAgent                                                                                   "+
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
            return new ProdData(data.MonthName,data.dateOrd,data.LIST,data.SELL,data.DNA);
          });
      
          resolve(prodDataResult); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_total_future = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query ="SELECT  ISNULL(sum(newListings),0) newListings,  ISNULL(sum(existListing),0) existListing, ISNULL(sum(pendingListings),0) pendingListings "+
      "FROM agp_ProdDataConsolidFuture "+
      "where agentId = @idAgent "+
      "and LastUpdateYear = YEAR(GETDATE()) "+
      "and LastUpdateMonth = MONTH(GETDATE()) ";
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
            return new FutureMetrics(data.newListings,data.existListing,data.pendingListings);
          });

          console.log(Result);
      
          resolve(Result); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_Data_Future_Report = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query ="WITH months(MonthNum) AS																		"+
      "        (                                                                                        "+
      "            SELECT 1                                                                             "+
      "            UNION ALL                                                                            "+
      "            SELECT MonthNum+1                                                                    "+
      "            FROM months                                                                          "+
      "            WHERE MonthNum < 12                                                                  "+
      "        )                                                                                        "+
      "        SELECT   Convert(char(3),  DATEADD(MONTH, MonthNum, '2000-12-01'), 0) AS 'MonthName', *  "+
      "        FROM                                                                                     "+
      "        (                                                                                        "+
      "           SELECT lastUpdateYEAR ,lastUpdateMonth, newListings,existListing,pendingListings      "+
      "           FROM agp_ProdDataConsolidFuture                                                       "+
      "            where agentId = @idAgent "+
      "            and DATEDIFF(MONTH, datefromparts(LastUpdateYear,LastUpdateMonth,1),getDATE() ) <12  "+
      "        ) AS sourceTable "+
      "        right OUTER JOIN months m on m.MonthNum=LastUpdateMonth "+
      "         order by  case when sign(month(GETDATE())-MonthNum)>=0 then DATEFROMPARTS( COALESCE(lastUpdateYEAR,Year(GETDATE ())), MonthNum, 1) "+
      "                                                                                                 when sign( month(GETDATE())-MonthNum)<0 then DATEFROMPARTS(COALESCE(lastUpdateYEAR,Year(GETDATE ())-1), MonthNum, 1)  "+
      "                                                                                                 end ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const prodDataFutureRes = res.recordset.map(data => {
              return new ProdDataFuture(data.MonthName,data.lastUpdateYEAR,data.lastUpdateMonth,data.newListings,data.existListing,
                                        data.pendingListings,data.MonthNum);
            });
            resolve(prodDataFutureRes);         
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_geo_data_tot = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query = "SELECT ISNULL(sum(total),0) as total															"+
      "        FROM agp_ProdDataGeo                                                       "+
      "         where agentId=@idAgent                                                    "+
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

AgentService.get_geo_data_tot10 = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query = "select ISNULL(sum(t.total),0) total from															"+
      "       (SELECT top 10  sum(total) as total                                                "+
      "               FROM agp_ProdDataGeo                                                       "+
      "               where agentId= @idAgent                                                    "+
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
                  AgentService.get_geo_data_tot(id) 
                      .then(data => {
                          if (!data) {
                              resolve(null);
                              return;
                          }
                          
                          var total= data[0];

                          var sum_10= Result[0];
                          
                          var prct = Math.round((sum_10*100/total));
                          console.log(prct);
                          if(isNaN(prct)){
                            prct = 0;
                            
                          }
                          const geoDataTot =  new GeoDataTot(prct);
                        
                          resolve(geoDataTot); 

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

AgentService.get_Data_Geo_Report = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query ="SELECT top 10 zipCode ,sum(total) as total											"+
      "        FROM agp_ProdDataGeo                                                       "+
      "         where agentId=@idAgent                                                      "+
      "         and DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <12      "+
      "         group by zipcode                                                          "+
      "         ORDER by total DESC                                                       ";
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
              return new GeoDataReport(data.zipCode,data.total);
            });
            resolve(geoDataReport);       
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_agent_ranking = (id,officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      request.input('officeId',officeId);
      
      var query ="select  ar.officeRank as ranking,  ar.agentIdC agentId, ar.firstName, ar.lastName, ar.totPrd as nombre "+
      "from agp_agentref ar                                                                                   "+
      "where agentIdC =@idAgent and officeid=@officeId                                                        "+
      "order by officeRank asc                                                                                ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const agentRanking = new AgentRanking(res.recordset[0].ranking, res.recordset[0].agentId,res.recordset[0].firstName,res.recordset[0].lastName,res.recordset[0].nombre);
            
            resolve(agentRanking);       
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_office_production = (id,officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('officeId',officeId);
      
      var query ="select  count(distinct agentIdC) num_agents,  sum(totPrd) nombre from agp_agentref "+
      "where officeid=@officeId                                                           ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
            
            const officeProd =  new OfficeProd(res.recordset[0].num_agents,res.recordset[0].nombre);
            //console.log(officeProd);

            try {
              AgentService.get_agent_ranking(id,officeId) 
                  .then(data => {
                      if (!data) {
                          resolve(null);
                          return;
                      }
                      
                      const agentRanking = data;

                      var prctProdOff =  Math.round((agentRanking.nombre / officeProd.nombre) * 100);                          

                      const result = JSON.stringify({"ranking": agentRanking.ranking, "numAgents": officeProd.num_agents, "officeProd": prctProdOff});

                    
                      resolve(result); 

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
  
AgentService.get_Office_Ranking_Report = (id,officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      request.input('officeId',officeId);
      
      var query ="select  ar.officeRank as ranking,  ar.agentIdC agentId, ar.firstName, ar.lastName, ar.totPrd as nombre, officeName "+
      "from agp_agentref ar                                                                                   "+
      "where (agentIdC =@idAgent or officeRank <= 10) and officeid=@officeId                                  "+
      "order by officeRank asc                                                                                ";
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

AgentService.get_team_count_members = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query = "select isnull((																	"+
      "            select count(distinct listAgentId) as nombre from prod.agp_agent_teams "+
      "            where coListAgentId=@idAgent and listAgentId is not null),0) +        "+
      "            isnull((select count(distinct colistAgentId) from prod.agp_agent_teams "+
      "            where listAgentId=@idAgent and colistAgentId is not null ),0) as total ";
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

AgentService.get_team_agent_totlisting = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query = "select sum(isnull(countTxs,0)) as totlisting from prod.agp_agent_teams "+
      "        where listAgentId=@idAgent                                             ";
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
            return data.totlisting;
          });
      
          resolve(Result); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_team_agent_totcolisting = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',id);
      
      var query = "select sum(isnull(countTxs,0)) as totcolisting from prod.agp_agent_teams "+
      "        where colistAgentId=@idAgent                     ";
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
            return data.totcolisting;
          });
      
          resolve(Result); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_team_data= async(id) => {
  try {
    const [count,totalListing, totalCoListing] = await Promise.all([
      AgentService.get_team_count_members(id),
      AgentService.get_team_agent_totlisting(id),
      AgentService.get_team_agent_totcolisting(id)
    ]);    

    console.log(JSON.stringify({"count": count[0], "Listings": totalListing[0], "CoListings": totalCoListing[0],"Transactions":parseInt(totalListing) + parseInt(totalCoListing) }))

    return JSON.stringify({"count": count[0], "Listings": totalListing[0], "CoListings": totalCoListing[0],"Transactions":parseInt(totalListing[0]) + parseInt(totalCoListing[0]) });

  } catch (error) {
    console.error('Error calculating total listings:', error);
    throw error;
  }

  
};

AgentService.get_team_agents_table = (idAgent) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',idAgent);
      
      var query = "with team_agents as (																																													"+
      "select colistagentid as agentid, coListAgentFirstName as firstName,coListAgentLastName as lastName,listAgentOfficeName as OfficeName, countTxs colistings, 0 listings from agp_agent_teams "+
      "where listagentid=@idAgent                                                                                                                                                                   "+
      "union                                                                                                                                                                                      "+
      "select listagentid as agentid,ListAgentFirstName as firstName,ListAgentLastName as lastName,colistAgentOfficeName as OfficeName,0 colistings ,countTxs listings from agp_agent_teams       "+
      "where colistagentid=@idAgent                                                                                                                                                                 "+
      ")                                                                                                                                                                                          "+
      "select agentid,firstName,lastName,OfficeName,sum(colistings) as 'colistings',sum(listings) as 'listings', sum(colistings)+sum(listings) as total from team_agents                          "+
      "group by agentid, firstName,lastName,OfficeName                                                                                                                                            ";
      request.query(query, (err, res) => {
          console.log(res.recordset);
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
          const team = res.recordset.map(teamData => {
            return new TeamAgentsData(teamData.agentid,teamData.firstName,teamData.lastName,teamData.OfficeName,teamData.colistings,
                                      teamData.listings,teamData.total );
          });
      
          resolve(team); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};

AgentService.get_agent_tier_persona = (idAgent) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idAgent',idAgent);
      
      var query = "select * from agp_agent_persona "+
                  "where agentId=@idAgent ";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }
          const agentTierPersona = res.recordset.map(data => {
            return new AgentTierPersona(data.agentId,data.total,data.dna,data.list,data.sell,data.persona);
          });
      
          resolve(agentTierPersona); 
        });

    }).catch(err => {
      reject(err);
    });
  });
  
};
//For saved search and favorite option
AgentService.saveSearchHistory = (userId, savedType, firstName, lastName, agentIdC) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        
          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          request.input('firstName',  firstName);
          request.input('lastName',  lastName);
          request.input('agentIdC',  agentIdC);

          console.log('res');
          const query = `
              IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND FirstName = @firstName AND LastName = @lastName)
              BEGIN
                  INSERT INTO agp_searchHistory (UserId,savedType, FirstName, LastName, IsFavorite,agentIdC)
                  VALUES (@userId, @savedType, @firstName, @lastName, 1, @agentIdC)
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

AgentService.getSearchHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);

          const query = `
              SELECT savedType, FirstName as firstName, LastName as lastName, isFavorite,agentIdC
              FROM agp_searchHistory
              WHERE UserId = @userId
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

AgentService.toggleFavorite = (userId, firstName, lastName, isFavorite) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
          const request = pool.request();
          request.input('userId',  userId);
          request.input('firstName',  firstName);
          request.input('lastName',  lastName);
          request.input('isFavorite',  isFavorite);
          const query = `
              UPDATE agp_searchHistory
              SET IsFavorite = @isFavorite
              WHERE UserId = @userId AND FirstName = @firstName AND LastName = @lastName
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

AgentService.getFavoriteHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          const query = `
              SELECT savedType, FirstName as firstName, LastName as lastName, isFavorite,agentIdC
              FROM agp_searchHistory
              WHERE UserId = @userId
              and   isFavorite = 0
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

  

module.exports = AgentService;