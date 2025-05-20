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








const LoanOfficerService = {};

LoanOfficerService.findLoanOfficerById = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('id',id);
      var query = "select top 1 officer_name as officerName, officeName from agp_dna_mls_matching where officer_nmls_id = @id";
      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }
      
    
        resolve(res.recordset[0]); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

LoanOfficerService.getNameLoanOfficer = (item) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        var query ="select distinct officer_name as label, officer_nmls_id as value from agp_dna_mls_matching where officer_name like '"+item+"%' and officer_nmls_id is not null";
        request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
            resolve([]);
            return;
          }
          // const itemObj = res.recordset.map(item => {
          //   return new Item(item.value, item.label );
          // });
    
        //resolve(itemObj);

       

        resolve(res.recordset);
        });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

 
  LoanOfficerService.getAgentByName = (name) => {
    return new Promise((resolve, reject) => {
      poolConnect.then(() => {
        const request = pool.request();
        request.input('name',name);
        
        var query = "select distinct officer_nmls_id as officerNmlsId, officer_name as officerName , officeName from agp_dna_mls_matching where officer_name = @name";
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
            // const agent = res.recordset.map(agentData => {
            //   return new Agent(agentData.agentIdC, agentData.agentfirstName, agentData.agentlastName,agentData.officeName, 
            //       agentData.officeCity, agentData.officeState, agentData.officeId, agentData.agentPhone,agentData.agentEmail ,
            //        agentData.officeAddress1, agentData.officePhone );
            // });
        
            resolve(res.recordset); 
          });

      }).catch(err => {
        reject(err);
      });
    });
    
  };

  LoanOfficerService.get_SankeyData = (id) => {
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();
          request.input('idAgent', id);

          // First query: Get top 10 agentIds
          const firstQuery = `           
            select TOP 15 listAgentId as agentId,listAgentFirstName+' '+listAgentLastName as Name, count(distinct listingId) total  from [prod].[agp_dna_mls_matching]
            where officer_nmls_id=@idAgent and listAgentId is not null and listAgentId<>0
            and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
            group by listAgentId, listAgentFirstName+' '+listAgentLastName
            order by 2 desc
          `;

          request.query(firstQuery, (err, res) => {
            if (err) {
              reject(err);
              return;
            }

            if (res.recordset.length === 0) {
              resolve(null); // No data found
              return;
            }
            // console.log(res.recordset);

            // Extract agentIds from the first query
            const agentIds = res.recordset.map((row) => row.agentId);

            // Second query: Get Nlistings for the agentIds
            const secondQuery = `
              SELECT 
                agentId, 
                agentFirstName + ' ' + agentLastName AS Name, 
                SUM(ISNULL(Nlistings, 0)) AS Nlistings 
              FROM [prod].[agp_ProdDataConsolid]
              WHERE StatusCode = 'S' 
                AND (
                  (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
                  OR 
                  (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
                )
                AND agentId IN (${agentIds.map((id) => `'${id}'`).join(',')})
              GROUP BY agentId, agentFirstName + ' ' + agentLastName;
            `;

            // Execute the second query
            request.query(secondQuery, (err, secondRes) => {
              if (err) {
                reject(err);
                return;
              }
              // console.log(secondRes.recordset);

              // Combine results from both queries
              // const result = {
              //   agents: res.recordset, 
              //   listings: secondRes.recordset, 
              // };



              //
                // Calculate capture rate for each agent
                const agentsWithCaptureRate = res.recordset
                .map((agent) => {
                  const listingData = secondRes.recordset.find(
                    (listing) => listing.agentId === parseInt(agent.agentId)
                  );
              
                  if (!listingData) {
                    return null;
                  }
              
                  const captureRate = ((agent.total / listingData.Nlistings) * 100).toFixed(2);
                  const total = agent.total;
              
                  return {
                    ...listingData,
                    total,
                    captureRate: parseFloat(captureRate), 
                  };
                })
                .filter(agent => agent !== null); 

              // Sort agents by capture rate (lowest to highest)
              // const sortedAgents = agentsWithCaptureRate.sort(
              //   (a, b) => a.captureRate - b.captureRate
              // );

              // console.log(agentsWithCaptureRate);
              // console.log(sortedAgents);
              resolve({
                listings: agentsWithCaptureRate
              });
              // resolve(result);
            });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
    
  };
  //
  // LoanOfficerService.getTotalSalesAndCapRate= async(id) => {
  //   try {
  //     const agentsList = await LoanOfficerService.get_SankeyData(id);
  //     // console.log(agentsList);
  //     const { totalSum, nListingsSum } = agentsList.listings.reduce((acc, agent) => {
  //       acc.totalSum += agent.total;
  //       acc.nListingsSum += agent.Nlistings;
  //       return acc;
  //     }, { totalSum: 0, nListingsSum: 0 });

  //     const capRate = nListingsSum > 0 
  //     ? (totalSum / nListingsSum * 100).toFixed(2) 
  //     : 0;
  
  //     return {"sales": totalSum,"capRate": capRate };
  
  //   } catch (error) {
  //     console.error('Error TotalSalesAndCapRate:', error);
  //     throw error;
  //   }
  
    
  // };
  //
  LoanOfficerService.getTotalSalesAndCapRate = (id) => {
    return new Promise((resolve, reject) => {
      poolConnect
        .then(() => {
          const request = pool.request();
          request.input('idAgent', id);

          // First query: Get top 10 agentIds
          const firstQuery = `           
            select sum(total)total from (
            select listAgentId,count(distinct listingId) total  from [prod].[agp_dna_mls_matching]
                        where officer_nmls_id=@idAgent and listAgentId is not null and listAgentId<>0
                        and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
                        group by listAgentId
                  )a
          `;

          request.query(firstQuery, (err, res) => {
            if (err) {
              reject(err);
              return;
            }

            if (res.recordset.length === 0) {
              resolve(null); // No data found
              return;
            }
            // console.log(res.recordset);

            // Extract agentIds from the first query
            const agentIds = res.recordset.map((row) => row.agentId);

            // Second query: Get Nlistings for the agentIds
            const secondQuery = `
              SELECT   SUM(ISNULL(Nlistings, 0)) AS Nlistings 
              FROM [prod].[agp_ProdDataConsolid]
              WHERE StatusCode = 'S' 
                AND (
                  (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
                  OR 
                  (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
                )
                AND agentId IN (select  distinct listAgentId  from [prod].[agp_dna_mls_matching]
                where officer_nmls_id=@idAgent and listAgentId is not null and listAgentId<>0
                and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1 )
            `;

            // Execute the second query
            request.query(secondQuery, (err, secondRes) => {
              if (err) {
                reject(err);
                return;
              }
              // console.log(secondRes.recordset);

              // Combine results from both queries
              // const result = {
              //   agents: res.recordset, 
              //   listings: secondRes.recordset, 
              // };

              const sales     = res.recordset[0].total;
              const Nlistings = secondRes.recordset[0].Nlistings;

              //
              const capRate = Nlistings > 0 
                  ? (sales / Nlistings * 100).toFixed(2) 
                  : 0;
              
                  // return {"sales": sales,"capRate": capRate };
              resolve({
                "sales": sales,"capRate": capRate 
              });
              // resolve(result);
            });
          });
        })
        .catch((err) => {
          reject(err);
        });
    });
    
  };
//
  LoanOfficerService.getTotalAgents = (idAgent) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            const request = pool.request();
            request.input('idAgent',  idAgent);
            const query = `
               select  count(distinct listAgentId) total  from [prod].[agp_dna_mls_matching]
                where officer_nmls_id=@idAgent and listAgentId is not null and listAgentId<>0
                and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
            `;
            request.query(query, (err, res) => {
              //console.log('res');
                if (err) {
                    reject(err);
                    console.log(err);
                    return;
                }
             
  
                resolve(res.recordset[0]);
            });
        }).catch(err => {
            reject(err);
        });
    });
  };
  
// //For saved search and favorite option
LoanOfficerService.saveSearchHistory = (userId, savedType, name, officerId) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          request.input('name',  name);
          request.input('officerId',  officerId);
          const query = `
              IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND OfficerId = @officerId AND OfficerName = @name)
              BEGIN
                  INSERT INTO agp_searchHistory (UserId,savedType, OfficerId, OfficerName, IsFavorite)
                  VALUES (@userId, @savedType, @officerId, @name, 1)
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

LoanOfficerService.getSearchHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);

          const query = `
              SELECT savedType,id as idHistory, OfficerId as officerId, OfficerName as officerName, isFavorite
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

LoanOfficerService.toggleFavorite = (idHistory, isFavorite) => {
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

LoanOfficerService.getFavoriteHistory = (userId,savedType) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('userId',  userId);
          request.input('savedType',  savedType);
          const query = `
              SELECT savedType, OfficerId as officerId, OfficerName as officerName, isFavorite
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

// LoanOfficerService.get_captureRateForRankingAgent = (paramIds) => {
//   return new Promise((resolve, reject) => {
//     poolConnect
//       .then(() => {
//         const request = pool.request();
//         // request.input('idAgent', id);

//         // First query: Get top 10 agentIds
//         const firstQuery = `           
//           select TOP 15 listAgentId as agentId,listAgentFirstName+' '+listAgentLastName as Name, count(distinct listingId) total  from [prod].[agp_dna_mls_matching]
//           where listAgentId in (`+ decodeURIComponent(paramIds) + `) and listAgentId is not null and listAgentId<>0
//           and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1
//           group by listAgentId, listAgentFirstName+' '+listAgentLastName
//           order by 2 desc
//         `;

//         request.query(firstQuery, (err, res) => {
//           if (err) {
//             reject(err);
//             return;
//           }

//           if (res.recordset.length === 0) {
//             resolve(null); // No data found
//             return;
//           }
//           // console.log(res.recordset);

//           // Extract agentIds from the first query
//           // const agentIds = res.recordset.map((row) => row.agentId);

//           // Second query: Get Nlistings for the agentIds
//           const secondQuery = `
//             SELECT 
//               agentId, 
//               agentFirstName + ' ' + agentLastName AS Name, 
//               SUM(ISNULL(Nlistings, 0)) AS Nlistings 
//             FROM [prod].[agp_ProdDataConsolid]
//             WHERE StatusCode = 'S' 
//               AND (
//                 (SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
//                 OR 
//                 (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)
//               )
//               AND agentId in (`+ decodeURIComponent(paramIds) + `)
//             GROUP BY agentId, agentFirstName + ' ' + agentLastName;
//           `;

//           // Execute the second query
//           request.query(secondQuery, (err, secondRes) => {
//             if (err) {
//               reject(err);
//               return;
//             }
//             // console.log(secondRes.recordset);

//             // Combine results from both queries
//             // const result = {
//             //   agents: res.recordset, 
//             //   listings: secondRes.recordset, 
//             // };



//             //
//               // Calculate capture rate for each agent
//               const agentsWithCaptureRate = res.recordset
//               .map((agent) => {
//                 const listingData = secondRes.recordset.find(
//                   (listing) => listing.agentId === parseInt(agent.agentId)
//                 );
            
//                 if (!listingData) {
//                   return null;
//                 }
            
//                 const captureRate = ((agent.total / listingData.Nlistings) * 100).toFixed(2);
//                 const total = agent.total;
            
//                 return {
//                   ...listingData,
//                   total,
//                   captureRate: parseFloat(captureRate), 
//                 };
//               })
//               .filter(agent => agent !== null); 

//             // Sort agents by capture rate (lowest to highest)
//             // const sortedAgents = agentsWithCaptureRate.sort(
//             //   (a, b) => a.captureRate - b.captureRate
//             // );

//             // console.log(agentsWithCaptureRate);
//             // console.log(sortedAgents);
//             resolve({
//               result: agentsWithCaptureRate
//             });
//             // resolve(result);
//           });
//         });
//       })
//       .catch((err) => {
//         reject(err);
//       });
//   });
  
// };

LoanOfficerService.get_agent_ranking_LO = (idOfficer,idAgent,officeId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      const request = pool.request();
      request.input('idOfficer',idOfficer);
      request.input('idAgent',idAgent);
      request.input('officeId',officeId);
      
      var query ="select  ar.officeRank as ranking,  ar.agentIdC agentId, ar.firstName, ar.lastName, ar.totPrd as nombre, officeName ,					"+
                  "(select count(distinct listingId) total  from [prod].[agp_dna_mls_matching]                                                            "+                
                  "where officer_nmls_id=@idOfficer and listAgentId=ar.agentIdC and DATEDIFF(year, GETDATE(),CONVERT(date,RecordingDate,112))<=1 ) loTxs   "+
                  "from prod.agp_agentref ar                                        "+
                  "where (officeRank <= 10 or agentIdC=@idAgent) and officeid=@officeId and ar.totPrd > 0 "+
                  "order by officeRank asc";
      request.query(query, (err, res) => {
          if (err) {
              reject(err);
              return;
          }
          if (res.recordset.length === 0) {
              resolve(null);
              return;
            }

            const agentsWithPercentage = res.recordset.map(agent => {
              const capturePercentage = agent.nombre > 0 
                ? Math.round((agent.loTxs / agent.nombre) * 100 *100) / 100 
                : 0;
    
              return {
                ...agent,
                capturePercentage: capturePercentage
              };
            });
    
            resolve(agentsWithPercentage);
          
          });

    }).catch(err => {
      reject(err);
    });
  });
  
};

LoanOfficerService.getOfficeNamesLo = (officerId) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const request = pool.request();
          request.input('officerId',  officerId);
          const query = `
             select distinct dna_officeName as officeName from [prod].[agp_dna_mls_matching] dna
             where dna.officer_nmls_id=@officerId
             and   dna.dna_officeName is not null
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

LoanOfficerService.getDataLOWorkedWithAgent = (id) => {
  return new Promise((resolve, reject) => {
    poolConnect
      .then(() => {
        const request = pool.request();
        request.input('idAgent', id);

        // First query: Get top 15 officer_nmls_id
        const firstQuery = `           
          select TOP 15 officer_name as officerName,officer_nmls_id as officerNmlsId,count(distinct listingId) total
          from  [prod].[agp_dna_mls_matching] dna
          where agentId=@idAgent
          and    officer_name is not null 
          and    officer_nmls_id is not null 
          group by officer_name,officer_nmls_id
           having count(distinct listingId)>0 
           order by 3 desc`;

        request.query(firstQuery, (err, res) => {
          if (err) {
            reject(err);
            return;
          }

          if (res.recordset.length === 0) {
            resolve(null); // No data found
            return;
          }
          
          // Second query: Get Nlistings for the agentId
          const secondQuery = `
            SELECT agentFirstName + ' ' + agentLastName AS AgentName ,SUM(ISNULL(Nlistings, 0)) AS Nlistings FROM [prod].[agp_ProdDataConsolid]
            WHERE StatusCode = 'S' AND ((SIGN(MONTH(GETDATE()) - LastUpdateMonth) >= 0 AND LastUpdateYear = YEAR(GETDATE()))
            OR (SIGN(MONTH(GETDATE()) - LastUpdateMonth) < 0 AND LastUpdateYear = YEAR(GETDATE()) - 1)) AND agentId = @idAgent
            group by agentFirstName + ' ' + agentLastName
          `;

          // Execute the second query
          request.query(secondQuery, (err, secondRes) => {
            if (err) {
              reject(err);
              return;
            }
            // console.log(secondRes.recordset);

            // Combine results from both queries
            // const result = {
            //   agents: res.recordset, 
            //   listings: secondRes.recordset, 
            // };
            const Nlistings = secondRes.recordset[0].Nlistings;
            const agentName = secondRes.recordset[0].AgentName;
            //
            const agentsWithCaptureRate = res.recordset
                .map((agent) => {
              
                  const captureRate = ((agent.total / Nlistings) * 100).toFixed(2);              
                  return {
                    ...agent,
                    agentName,
                    captureRate: parseFloat(captureRate), 
                  };
                })
                .filter(agent => agent !== null); 
            
                // return {"sales": sales,"capRate": capRate };
            resolve(agentsWithCaptureRate);
            // resolve(result);
          });
        });
      })
      .catch((err) => {
        reject(err);
      });
  });
  
};

module.exports = LoanOfficerService;