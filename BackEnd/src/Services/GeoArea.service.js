const { pool, poolConnect } = require('../Config/DbConfig');
const Item = require('../Models/Item.model');
const AgentByOfficeData = require('../Models/AgentByOfficeData');

const GeoAreaService = {};

GeoAreaService.getStates = () => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            const query = `
            select DISTINCT  state_code code, state_name name
            from us_county
            where state_code in('CA','FL')
            order by state_code
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

  GeoAreaService.getCounties = (stateCode) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('stateCode',  stateCode);
            const query = `
            SELECT  county_ascii name ,county_id code
            FROM us_county
            where state_code =@stateCode
            order by county_ascii
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

  GeoAreaService.getCities = (county) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('county',  county);
            const query = `
            SELECT  city_ascii name ,city_id code
            FROM us_city
            where county_id =@county
            order by city_ascii
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

  GeoAreaService.getZips = (city) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('city',  city);
            const query = `select  zip_id, zip, lat, lng from us_zips  WHERE city_id=@city`;
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

  GeoAreaService.getZipByCode = (code) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            //request.input('code',  code);
            const query = `select  zip_id, zip, lat, lng from us_zips  WHERE zip in (` + code + `)`;
            request.query(query, (err, res) => {
  
                if (err) {
                  console.log(err);
  
                    reject(err);
                    return;
                }
                console.log(res.recordset);
                resolve(res.recordset);
            });
        }).catch(err => {
            reject(err);
        });
    });
  };
  GeoAreaService.getCityById = (code) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('code',  code);
            const query = 'select  city_id, city_ascii,lat, lng from us_city  WHERE city_id = @code';
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

  GeoAreaService.getZipByCity = (city) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('city',  city);
            const query = 'select  zip_id, zip, lat, lng from us_zips  WHERE city_id=@city';
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

  GeoAreaService.fetchTransactions = (zips,nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('nbrMonth',  nbrMonth);
            const query = `select zipcode, agentId, agentfirstname, agentlastname,[LIST] listings,[SELL] selling,[DNA] dna, 
            [LIST] + [DNA] total
        from 
        ( 
        select zipcode, agentId, agentfirstname, agentlastname, total,AgentPos 
        from [prod].[agp_ProdDataGeo] 
        where DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <= @nbrMonth
        and agentId<>0 
        and zipcode in (`+ decodeURIComponent(zips) + `) 
        ) d 
        pivot 
        ( 
        sum(total) 
        for AgentPos in ([LIST],[SELL],[DNA]) 
        ) piv
        where 
        COALESCE([SELL], 0) > 0
        order by zipcode, agentId;`;
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

  GeoAreaService.fetchTransactionsGeo = (decodedparam, nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            //decodedparam = 32086,32091
            const request = pool.request();
            request.input('nbrMonth',  nbrMonth);
            const query = `select enhanced_latitude lat,enhanced_longitude lng, count(listing_id) nbrlist,count(distinct list_Agent_Id) nbragt,
            max(primary_status +' '+street)  street,max(zip_5+'-'+zip_4) zip 
            from prod.agp_listings_geo alg
            where zip_5  in ('`+ decodedparam+ `') and DATEDIFF(MONTH, creation_date,getDATE())<=@nbrMonth
            group by enhanced_latitude,enhanced_longitude`;
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

  //For saved search and favorite option
  GeoAreaService.saveSearchHistory = (userId, savedType, city, zips,state,county,nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
          
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType',  savedType);
            request.input('city',  city);
            request.input('zips',  zips);
            request.input('state',  state);
            request.input('county',  county);
            request.input('nbrMonth',  nbrMonth);
  
            const query = `
                IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND City = @city AND Zips = @zips AND State = @state AND County = @county AND NbrMonth = @nbrMonth)
                BEGIN
                    INSERT INTO agp_searchHistory (UserId,savedType, City, Zips,State,County,NbrMonth, IsFavorite)
                    VALUES (@userId, @savedType, @city, @zips,@state,@county,@nbrMonth, 1)
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
  
  GeoAreaService.getSearchHistory = (userId,savedType) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType', savedType);
            const query = `
                SELECT savedType, City as city, Zips as zips,State as state,County as county,cast(NbrMonth as int) as nbrMonth, isFavorite
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
  
  GeoAreaService.toggleFavorite = (userId, city, zips,state,county,nbrMonth, isFavorite) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            const request = pool.request();
            request.input('userId',  userId);
            request.input('city',  city);
            request.input('zips',  zips);
            request.input('state',  state);
            request.input('county',  county);
            request.input('nbrMonth',  nbrMonth);
            request.input('isFavorite',  isFavorite);
            console.log('hici');
            const query = `
                UPDATE agp_searchHistory
                SET IsFavorite = @isFavorite
                WHERE UserId = @userId AND City = @city AND Zips = @zips AND State = @state AND County = @county AND NbrMonth = @nbrMonth
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
  
  GeoAreaService.getFavoriteHistory = (userId,savedType) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType',  savedType);
  
            const query = `
                SELECT savedType, City as city, Zips as zips,State as state,County as county,NbrMonth as nbrMonth, isFavorite
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

  GeoAreaService.fetchTransactionsGeoByAgent = (agentId, nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            //decodedparam = 32086,32091
            const request = pool.request();
            request.input('nbrMonth',  nbrMonth);
            request.input('agentId',  agentId);
            const query = `select enhanced_latitude lat,enhanced_longitude lng, count(listing_id) nbrlist,count(distinct list_Agent_Id) nbragt,
            max(primary_status +' '+street)  street,max(zip_5+'-'+zip_4) zip 
            from prod.agp_listings_geo alg 
            where list_Agent_Id=@agentId and DATEDIFF(MONTH, creation_date,getDATE())<=@nbrMonth
            and  list_Agent_Id<>0
            and enhanced_latitude is not null 
            and enhanced_longitude is not null 
            group by enhanced_latitude,enhanced_longitude`;
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

  GeoAreaService.GetTotalTransactions = (zips,nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('nbrMonth',  nbrMonth);
            const query = `select SUM(total) transactions
            from [prod].[agp_ProdDataGeo] 
            where DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <= @nbrMonth
            and agentId<>0 
            and AgentPos in ('SELL','DNA')
            and zipcode in (`+ decodeURIComponent(zips) + `);`;
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

  GeoAreaService.GetTotalAgents = (zips,nbrMonth) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
  
            const request = pool.request();
            request.input('nbrMonth',  nbrMonth);
            const query = `select count(*) agents
            from 
            ( 
            select zipcode, agentId, agentfirstname, agentlastname, total,AgentPos 
            from [prod].[agp_ProdDataGeo] 
            where DATEDIFF(MONTH, datefromparts(listYear,listMonth,1) ,getDATE()) <= @nbrMonth
            and agentId<>0 
            and zipcode in (`+ decodeURIComponent(zips) + `) 
            ) d 
            pivot 
            ( 
            sum(total) 
            for AgentPos in ([LIST],[SELL],[DNA]) 
            ) piv 
            where 
        COALESCE([SELL], 0) > 0;`;
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

  

module.exports = GeoAreaService;