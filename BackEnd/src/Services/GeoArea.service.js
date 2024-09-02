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
        ) piv  order by zipcode, agentId;`;
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
            const query = `select elatitude lat,elongitude lng, count(listingid) nbrlist,count(listAgentId) nbragt,  max(primary_ +' '+street_)  street,max(zip5+'-'+zip4) zip from prod.agp_listGeo
            where zip5  in ('`+ decodedparam+ `') and DATEDIFF(MONTH, creationDate,getDATE())<=@nbrMonth
            group by elatitude,elongitude`;
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
  GeoAreaService.saveSearchHistory = (userId, savedType, city, zips) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
          
            const request = pool.request();
            request.input('userId',  userId);
            request.input('savedType',  savedType);
            request.input('city',  city);
            request.input('zips',  zips);
  
            const query = `
                IF NOT EXISTS (SELECT 1 FROM agp_searchHistory WHERE UserId = @userId AND City = @city AND Zips = @zips)
                BEGIN
                    INSERT INTO agp_searchHistory (UserId,savedType, City, Zips, IsFavorite)
                    VALUES (@userId, @savedType, @city, @zips, 1)
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
                SELECT savedType, City as city, Zips as zips, isFavorite
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
  
  GeoAreaService.toggleFavorite = (userId, city, zips, isFavorite) => {
    return new Promise((resolve, reject) => {
        poolConnect.then(() => {
            const request = pool.request();
            request.input('userId',  userId);
            request.input('city',  city);
            request.input('zips',  zips);
            request.input('isFavorite',  isFavorite);
            const query = `
                UPDATE agp_searchHistory
                SET IsFavorite = @isFavorite
                WHERE UserId = @userId AND City = @city AND Zips = @zips
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
                SELECT savedType, City as city, Zips as zips, isFavorite
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
            const query = `select elatitude lat,elongitude lng, count(listingid) nbrlist,count(listAgentId) nbragt,  max(primary_ +' '+street_)  street,max(zip5+'-'+zip4) zip from prod.agp_listGeo
            where listAgentId=@agentId and DATEDIFF(MONTH, creationDate,getDATE())<=@nbrMonth
            and  listAgentId<>0
            and elatitude is not null 
			and elongitude is not null 
            group by elatitude,elongitude`;
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