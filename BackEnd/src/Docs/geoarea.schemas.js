module.exports = {
    // ---- Generic inputs ----
    SelectedLocation: {
      type: 'object',
      required: ['stateCode'],
      properties: {
        stateCode: { type: 'string', example: 'TX' },
        city: { type: 'array', items: { type: 'string' }, example: ['Austin', 'Round Rock'] },
        zip:  { type: 'array', items: { type: 'string' }, example: ['78701', '78702'] },
        county: { type: 'string', example: 'Travis' }
      }
    },
  
    // ---- Payloads ----
    GeoArea_AgentGeoProduction_Payload: {
      type: 'object',
      required: ['selectedLocation'],
      properties: { selectedLocation: { $ref: '#/components/schemas/SelectedLocation' } }
    },
  
    GeoArea_SearchAgents_Payload: {
      type: 'object',
      required: ['selectedLocation', 'searchTerm'],
      properties: {
        selectedLocation: { $ref: '#/components/schemas/SelectedLocation' },
        searchTerm: { type: 'string', example: 'Alice' }
      }
    },
  
    GeoArea_GeoProductionForAgent_Payload: {
      type: 'object',
      required: ['selectedLocation', 'agentId'],
      properties: {
        selectedLocation: { $ref: '#/components/schemas/SelectedLocation' },
        agentId: { type: 'integer', example: 123456 }
      }
    },
  
    GeoArea_AgentId_Payload: {
      type: 'object',
      required: ['agentId'],
      properties: { agentId: { type: 'integer', example: 123456 } }
    },
  
    GeoArea_SaveSearch_Payload: {
      type: 'object',
      required: ['userId','savedType','city','zips','state','county'],
      properties: {
        userId:    { type: 'string',  example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string',  example: 'geoarea' },
        city:      { type: 'string',  example: 'Austin' },
        zips:      { type: 'string',  example: '78701,78702' },
        state:     { type: 'string',  example: 'TX' },
        county:    { type: 'string',  example: 'Travis' }
      }
    },
  
    GeoArea_SearchQuery_Payload: {
      type: 'object',
      required: ['userId','savedType'],
      properties: {
        userId:    { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string', example: 'geoarea' }
      }
    },
  
    GeoArea_ToggleFavorite_Payload: {
      type: 'object',
      required: ['userId','search'],
      properties: {
        userId: { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        search: {
          type: 'object',
          required: ['city','zips','state','county','isFavorite'],
          properties: {
            city:       { type: 'string',  example: 'Austin' },
            zips:       { type: 'string',  example: '78701,78702' },
            state:      { type: 'string',  example: 'TX' },
            county:     { type: 'string',  example: 'Travis' },
            isFavorite: { type: 'boolean', example: true }
          }
        }
      }
    },
  
    GeoArea_ToggleFavoriteTeam_Payload: {
      type: 'object',
      required: ['userId','search'],
      properties: {
        userId: { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        search: {
          type: 'object',
          required: ['city','zips','state','county','isFavorite'],
          properties: {
            city:       { type: 'string',  example: 'Austin' },
            zips:       { type: 'string',  example: '78701,78702' },
            state:      { type: 'string',  example: 'TX' },
            county:     { type: 'string',  example: 'Travis' },
            isFavorite: { type: 'boolean', example: true }
          }
        }
      }
    },

    GeoArea_CountyFips_Payload: {
      type: 'object',
      required: ['countyFips'],
      properties: { countyFips: { type: 'string', example: '48453' } }
    },

    GeoArea_SearchZip_Payload: {
      type: 'object',
      required: ['term'],
      properties: {
        term: {
          type: 'string',
          example: '787'
        }
      }
    },

    GeoArea_TeamId_Payload: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          required: ['teamId'],
          properties: {
            teamId: {
              type: 'integer',
              example: 1001
            }
          }
        }
      }
    },
  
    // ---- Reponses ----
    GeoArea_AgentSearchRow: {
      type: 'object',
      properties: {
        agentId:  { type: 'integer', example: 123456 },
        fullName: { type: 'string',  example: 'Alice Smith' }
      }
    },
    GeoArea_AgentSearchArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_AgentSearchRow' } },
  
    GeoArea_AgentGeoProdRow: {
      type: 'object',
      properties: {
        agentId:        { type: 'integer', example: 123456 },
        firstName:      { type: 'string' },
        lastName:       { type: 'string' },
        state:          { type: 'string', example: 'TX' },
        city:           { type: 'string', example: 'Austin' },
        officeName:     { type: 'string' },
        officeAddress1: { type: 'string' },
        total_cur:      { type: 'number' },
        total_before:   { type: 'number' },
        dna:            { type: 'number' },
        list:           { type: 'number' },
        sell:           { type: 'number' },
        persona:        { type: 'string' },
        tier:           { type: 'string', example: 'Tier 2' },
        part_total_curr:{ type: 'number' },
        part_total_before:{ type: 'number' },
        agentSalesYoyInOutArea: { type: 'string', example: '20%' },
        agentSalesYoyInArea:    { type: 'string', example: '15%' }
      }
    },
    GeoArea_AgentGeoProdArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_AgentGeoProdRow' } },
  
    GeoArea_ExtractionRow: {
      type: 'object',
      properties: {
        firstName: { type: 'string' }, lastName: { type: 'string' },
        state: { type: 'string' }, city: { type: 'string' },
        officeName: { type: 'string' }, officeAddress1: { type: 'string' },
        total_cur: { type: 'number' }, total_before: { type: 'number' },
        dna: { type: 'number' }, list: { type: 'number' }, sell: { type: 'number' },
        persona: { type: 'string' }, tier: { type: 'string' },
        part_total_curr: { type: 'number' }, part_total_before: { type: 'number' },
        agentSalesYoyInOutArea: { type: 'string' }, agentSalesYoyInArea: { type: 'string' }
      }
    },
    GeoArea_ExtractionArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_ExtractionRow' } },
  
    GeoArea_ListingsGeoProdRow: {
      type: 'object',
      properties: {
        zipcode:        { type: 'string',  example: '78701' },
        agentId:        { type: 'integer', example: 123456 },
        agentfirstname:{ type: 'string'  },
        agentlastname: { type: 'string'  },
        listings:      { type: 'number'  },
        selling:       { type: 'number'  },
        dna:           { type: 'number'  },
        total:         { type: 'number'  }
      }
    },
    GeoArea_ListingsGeoProdArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_ListingsGeoProdRow' } },
  
    GeoArea_ZipByCityRow: {
      type: 'object',
      properties: {
        zip_id: { type: 'integer', example: 10101 },
        zip:    { type: 'string',  example: '78701' },
        lat:    { type: 'number',  example: 30.2711 },
        lng:    { type: 'number',  example: -97.7437 }
      }
    },
    GeoArea_ZipByCityArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_ZipByCityRow' } },
  
    GeoArea_TxnGeoByAgentRow: {
      type: 'object',
      properties: {
        lat:     { type: 'number', example: 30.2711 },
        lng:     { type: 'number', example: -97.7437 },
        nbrlist: { type: 'number', example: 5 },
        nbragt:  { type: 'number', example: 1 },
        street:  { type: 'string', example: 'SOLD 100 Main St' },
        zip:     { type: 'string', example: '78701-1234' }
      }
    },
    GeoArea_TxnGeoByAgentArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_TxnGeoByAgentRow' } },
  
    GeoArea_SearchRow: {
      type: 'object',
      properties: {
        savedType:  { type: 'string', example: 'geoarea' },
        city:       { type: 'string', example: 'Austin' },
        zips:       { type: 'string', example: '78701,78702' },
        state:      { type: 'string', example: 'TX' },
        county:     { type: 'string', example: 'Travis' },
        isFavorite: { type: 'boolean', example: true }
      }
    },
    GeoArea_SearchArray: { type: 'array', items: { $ref: '#/components/schemas/GeoArea_SearchRow' } },

    GeoArea_CityRow: {
        type: 'object',
        properties: {
          city: {
            type: 'string',
            example: 'Austin'
          },
          countyFips: {
            type: 'string',
            example: '48453'
          },
          county: {
            type: 'string',
            example: 'Travis'
          },
          state: {
            type: 'string',
            example: 'Texas'
          },
          stateCode: {
            type: 'string',
            example: 'TX'
          }
        }
      },

      GeoArea_CityArray: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GeoArea_CityRow'
        }
      },
      GeoArea_SearchZipRow: {
        type: 'object',
        properties: {
          zip: {
            type: 'string',
            example: '78701'
          },
          city: {
            type: 'string',
            example: 'Austin'
          },
          countyFips: {
            type: 'string',
            example: '48453'
          },
          county: {
            type: 'string',
            example: 'Travis'
          },
          state: {
            type: 'string',
            example: 'Texas'
          },
          stateCode: {
            type: 'string',
            example: 'TX'
          }
        }
      },

      GeoArea_SearchZipArray: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GeoArea_SearchZipRow'
        }
      },

      GeoArea_TeamGeoProductionRow: {
        type: 'object',
        properties: {
          teamId: {
            type: 'integer',
            example: 1001
          },
          teamName: {
            type: 'string',
            example: 'Austin Elite Team'
          },
          teamSize: {
            type: 'integer',
            example: 12
          },
          agentsOnTeam: {
            type: 'integer',
            example: 10
          },
          brand: {
            type: 'string',
            example: 'Coldwell Banker'
          },
          OfficeNameBrokerage: {
            type: 'string',
            example: 'Austin Downtown Office'
          }
        }
      },

      GeoArea_TeamGeoProductionArray: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GeoArea_TeamGeoProductionRow'
        }
      },

      GeoArea_AgentTeamTableRow: {
        type: 'object',
        properties: {
          agId: {
            type: 'string',
            example: '123456'
          },
          name: {
            type: 'string',
            example: 'John Smith'
          },
          office: {
            type: 'string',
            example: 'Austin Downtown Office'
          },
          officeId: {
            type: 'string',
            example: '789'
          },
          tier: {
            type: 'string',
            example: 'Tier 2'
          },
          persona: {
            type: 'string',
            example: 'Top Producer'
          },
          phone: {
            type: 'string',
            example: '(512) 555-1234'
          },
          email: {
            type: 'string',
            example: 'john.smith@email.com'
          },
          color: {
            type: 'string',
            example: '#1E88E5'
          },
          size: {
            type: 'number',
            example: 15
          },
          countTx: {
            type: 'number',
            example: 124
          }
        }
      },

      GeoArea_AgentTeamTableArray: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/GeoArea_AgentTeamTableRow'
        }
      },
  };
  