const { pool, poolConnect,mssql } = require('../Config/DbConfig');


const GeoAreaAgentProdService = {};

GeoAreaAgentProdService.getAgentGeoProduction = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             WITH aggregated_data AS (
              SELECT TOP 100
                agentId,
                zipcode,
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                SUM(part_total_curr) as part_total_curr,
                SUM(part_total_before) as part_total_before,
                CASE
                  WHEN total_global >= 25 THEN 'Tier 1'
                  WHEN total_global >= 13 AND total_global <= 24 THEN 'Tier 2'
                  WHEN total_global >= 7 AND total_global <= 12 THEN 'Tier 3'
                  WHEN total_global >= 1 AND total_global <= 6 THEN 'Tier 4'
                  ELSE ''
                END as tier,
                total_before
              FROM prod.agp_prod_agent_geo
              WHERE ${whereClause}
              GROUP BY 
                agentId,
                zipcode,
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                total_before
            )
            SELECT 
              *,
              CASE
              WHEN total_before = 0 AND total_global <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN total_before <> 0 AND total_global = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN total_before = 0 AND total_global = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((total_global - total_before) * 100 / total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInOutArea,
                    CASE
              WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((part_total_curr - part_total_before) * 100 / part_total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInArea	
              FROM aggregated_data
          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

      
        resolve(res.recordset); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.searchAgents = (selectedLocation, searchTerm) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {
      console.log(selectedLocation);
      console.log(searchTerm);
      const cityParams = selectedLocation.city
        .map((_, i) => `city = @city${i}`)
        .join(' OR ');
      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
        SELECT DISTINCT TOP 20 agentId, CONCAT(firstName, ' ', lastName) as fullName 
        FROM prod.agp_prod_agent_geo
        WHERE ${whereClause}
        AND CONCAT(firstName, ' ', lastName) LIKE @searchTerm
      `;

      request.input('state', mssql.VarChar, selectedLocation.stateCode);
      
      selectedLocation.city.forEach((city, index) => {
        request.input(`city${index}`, mssql.VarChar, city);
      });
      request.input('searchTerm', mssql.VarChar, `%${searchTerm}%`);

      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        selectedLocation.zip.forEach((zip, index) => {
          request.input(`zip${index}`, mssql.VarChar, zip);
        });
      }

      console.log(query);
      
      request.query(query, (err, res) => {
        if (err) reject(err);
        resolve(res.recordset);
      });
    }).catch(reject);
  });
};

GeoAreaAgentProdService.getGeoProductionForAgent = (selectedLocation, agentId) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        'agentId = @agentId',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             WITH aggregated_data AS (
              SELECT
                agentId,
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                SUM(part_total_curr) as part_total_curr,
                SUM(part_total_before) as part_total_before,
                CASE
                  WHEN total_global >= 25 THEN 'Tier 1'
                  WHEN total_global >= 13 AND total_global <= 24 THEN 'Tier 2'
                  WHEN total_global >= 7 AND total_global <= 12 THEN 'Tier 3'
                  WHEN total_global >= 1 AND total_global <= 6 THEN 'Tier 4'
                  ELSE ''
                END as tier,
                total_before
              FROM prod.agp_prod_agent_geo
              WHERE ${whereClause}
                AND agentId = @agentId
              GROUP BY 
                agentId,
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                total_before
            )
            SELECT 
              *,
              CASE
              WHEN total_before = 0 AND total_global <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN total_before <> 0 AND total_global = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN total_before = 0 AND total_global = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((total_global - total_before) * 100 / total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInOutArea,
                    CASE
              WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((part_total_curr - part_total_before) * 100 / part_total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInArea	
              FROM aggregated_data
          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          request.input('agentId', mssql.BigInt, agentId);

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }
      
        resolve(res.recordset); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getZipsbyCityName = (selectedLocation) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {

          const cityParams = selectedLocation.city
          .map((_, i) => `city_name = @city${i}`)
          .join(' OR ');

          const request = pool.request();
          const query = `select  zip_id, zip, lat, lng from us_zips  WHERE county_name = @County AND (${cityParams})`;

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });
          request.input('County', mssql.VarChar, selectedLocation.county);

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

GeoAreaAgentProdService.fetchTransactionsGeoByAgent = (agentId) => {
  return new Promise((resolve, reject) => {
      poolConnect.then(() => {
          //decodedparam = 32086,32091
          const request = pool.request();
          request.input('agentId',  agentId);
          const query = `select enhanced_latitude lat,enhanced_longitude lng, count(listing_id) nbrlist,count(distinct list_Agent_Id) nbragt,
          max(primary_status +' '+street)  street,max(zip_5+'-'+zip_4) zip 
          from prod.agp_listings_geo alg 
          where list_Agent_Id=@agentId
          and  list_Agent_Id<>0
          and enhanced_latitude is not null 
          and enhanced_longitude is not null 
          group by enhanced_latitude,enhanced_longitude`;
          request.query(query, (err, res) => {

              if (err) {                      
                  reject(err);
                  return;
              }
              if (res.recordset.length === 0) {
                resolve(null);
                return;
              }
              resolve(res.recordset);
          });
      }).catch(err => {
          reject(err);
      });
  });
};

GeoAreaAgentProdService.getNumberOfAgent = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             select count(distinct agentId) as totalAgents from prod.agp_prod_agent_geo
             WHERE ${whereClause}

          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

        resolve(res.recordset[0].totalAgents); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getAgentGeoProductionForExtraction = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             WITH aggregated_data AS (
              SELECT
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                SUM(part_total_curr) as part_total_curr,
                SUM(part_total_before) as part_total_before,
                CASE
                  WHEN total_global >= 25 THEN 'Tier 1'
                  WHEN total_global >= 13 AND total_global <= 24 THEN 'Tier 2'
                  WHEN total_global >= 7 AND total_global <= 12 THEN 'Tier 3'
                  WHEN total_global >= 1 AND total_global <= 6 THEN 'Tier 4'
                  ELSE ''
                END as tier,
                total_before
              FROM prod.agp_prod_agent_geo
              WHERE ${whereClause}
              GROUP BY 
                agentId,
                zipcode,
                firstName,
                lastName,
                state,
                city,
                officeName,
                officeAddress1,
                total_global,
                dna,
                list,
                sell,
                persona,
                total_before
            )
            SELECT 
              *,
              CASE
              WHEN total_before = 0 AND total_global <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN total_before <> 0 AND total_global = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN total_before = 0 AND total_global = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((total_global - total_before) * 100 / total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInOutArea,
                    CASE
              WHEN part_total_before = 0 AND part_total_curr <> 0 THEN '+100%'        -- +100 when a is 0 and b is not 0
                      WHEN part_total_before <> 0 AND part_total_curr = 0 THEN '-100%'        -- -100 when a is not 0 and b is 0
                      WHEN part_total_before = 0 AND part_total_curr = 0 THEN '0%'           -- no change
                      ELSE CONCAT(CAST(ROUND(((part_total_curr - part_total_before) * 100 / part_total_before), 2) AS VARCHAR), '%')        -- standard formula
              END AS agentSalesYoyInArea	
              FROM aggregated_data
          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

      
        resolve(res.recordset); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getTotalTransaction = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             select sum(total_global) as totalTransaction from prod.agp_prod_agent_geo
             WHERE ${whereClause}

          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

        resolve(res.recordset[0].totalTransaction); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getTotalListings = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `city = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'state = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
             select sum(list) as totalListings from prod.agp_prod_agent_geo
             WHERE ${whereClause}

          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

        resolve(res.recordset[0].totalListings); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getListingsGeoProduction = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `cty.city_name = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'cty.state_code = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`pdg.zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `
            select zipcode, agentId, agentfirstname, agentlastname,[LIST] listings,[SELL] selling,[DNA] dna, 
            [LIST] + [DNA] total
            from 
            ( 
            select zipcode, agentId, agentfirstname, agentlastname, total, AgentPos 
            from [prod].[agp_ProdDataGeo] pdg inner join us_zips zip on pdg.zipcode = zip.zip inner join us_city cty on zip.city_id = cty.city_id
            where agentId<>0 
            and ${whereClause}
            ) d 
            pivot 
            ( 
            sum(total) 
            for AgentPos in ([LIST],[SELL],[DNA]) 
            ) piv
            where 
            COALESCE([SELL], 0) > 0
            order by zipcode, agentId
          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }
          console.log(query);
      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

      
        resolve(res.recordset); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getTotalTransactionsListings = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `cty.city_name = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'cty.state_code = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`pdg.zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `select SUM(total) transactions
            from [prod].[agp_ProdDataGeo] pdg inner join us_zips zip on pdg.zipcode = zip.zip inner join us_city cty on zip.city_id = cty.city_id
            where agentId<>0 
            and AgentPos in ('SELL','DNA')
            and ${whereClause}

          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }
          console.log(query);
      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

        resolve(res.recordset[0].transactions); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

GeoAreaAgentProdService.getTotalAgentsListings = (selectedLocation) => {
  return new Promise((resolve, reject) => {
    poolConnect.then(() => {

      const cityParams = selectedLocation.city
      .map((_, i) => `cty.city_name = @city${i}`)
      .join(' OR ');

      // Dynamic WHERE clause
      const whereClauses = [
        'cty.state_code = @state',
        `(${cityParams})`
      ];
      // Add zip condition if necessary
      if (selectedLocation.zip && selectedLocation.zip.length > 0) {
        const zipPlaceholders = selectedLocation.zip
          .map((_, i) => `@zip${i}`)
          .join(', ');
        whereClauses.push(`pdg.zipcode IN (${zipPlaceholders})`);
      }

      const whereClause = whereClauses.join(' AND ');

      const request = pool.request();
      const query = `select count(*) agents
            from 
            ( 
            select zipcode, agentId, agentfirstname, agentlastname, total,AgentPos 
            from [prod].[agp_ProdDataGeo] pdg inner join us_zips zip on pdg.zipcode = zip.zip inner join us_city cty on zip.city_id = cty.city_id
            where agentId<>0 
            and ${whereClause}
            ) d 
            pivot 
            ( 
            sum(total) 
            for AgentPos in ([LIST],[SELL],[DNA]) 
            ) piv 
            where 
        COALESCE([SELL], 0) > 0;

          `;      
          request.input('state', mssql.VarChar, selectedLocation.stateCode);

          selectedLocation.city.forEach((city, index) => {
            request.input(`city${index}`, mssql.VarChar, city);
          });

          if (selectedLocation.zip && selectedLocation.zip.length > 0) {
            selectedLocation.zip.forEach((zip, index) => {
              request.input(`zip${index}`, mssql.VarChar, zip);
            });
          }

      request.query(query, (err, res) => {
        if (err) {
            reject(err);
            return;
        }
        if (res.recordset.length === 0) {
            resolve(null);
            return;
          }

        resolve(res.recordset); 
      });
    }).catch(err => {
      reject(err);
    });
  });
  
};

module.exports = GeoAreaAgentProdService;