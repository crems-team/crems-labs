module.exports = {
    // ===== Common payloads =====
    OfficeIdPayload: {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string', example: '123456' } },
    },
    OfficeSearchSavePayload: {
      type: 'object',
      required: ['userId', 'savedType', 'officeName', 'officeId', 'officeState'],
      properties: {
        userId: { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string', example: 'office' },
        officeName: { type: 'string', example: 'KW Austin' },
        officeId: { type: 'string', example: '1239854' },
        officeState: { type: 'string', example: 'TX' },
      },
    },
    OfficeSearchQueryPayload: {
      type: 'object',
      required: ['userId', 'savedType'],
      properties: {
        userId: { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string', example: 'office' },
      },
    },
    OfficeToggleFavoritePayload: {
      type: 'object',
      required: ['userId', 'search'],
      properties: {
        userId: { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        search: {
          type: 'object',
          required: ['officeName', 'officeId', 'isFavorite'],
          properties: {
            officeName: { type: 'string', example: 'KW Austin' },
            officeId: { type: 'string', example: '123456' },
            isFavorite: { type: 'boolean', example: true },
          },
        },
      },
    },
  
    // ===== Responses / models =====
    // Autocomplete “city”
    OfficeCityItem: {
      type: 'object',
      properties: {
        value: { type: 'string', example: '127786' },
        label: { type: 'string', example: 'Austin' },
      },
    },
    OfficeCityArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeCityItem' } },
  
    // Office suggestions
    OfficeSuggestItem: {
      type: 'object',
      properties: {
        value: { type: 'string', example: '1239865' },
        label: { type: 'string', example: 'KW Austin' },
      },
    },
    OfficeSuggestArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeSuggestItem' } },
  
    // Get agents by office 
    AgentByOfficeRow: {
      type: 'object',
      properties: {
        officeId: { type: 'string', example: 'OFF-123' },
        officeName: { type: 'string', example: 'KW Austin' },
        officeCity: { type: 'string', example: 'Austin' },
        officeState: { type: 'string', example: 'TX' },
        nbrAgent: { type: 'number', example: 42 },
      },
    },
    AgentByOfficeArray: { type: 'array', items: { $ref: '#/components/schemas/AgentByOfficeRow' } },
  
    // Office infos
    OfficeRow: {
      type: 'object',
      properties: {
        officeName: { type: 'string' },
        officeAddress: { type: 'string' },
        officePhone: { type: 'string' },
        officeCity: { type: 'string' },
        officeState: { type: 'string' },
      },
    },
    OfficeArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeRow' } },
  
    // current, last metrics for office
    OfficeHistoRow: {
      description: 'Metrics [MonthName(string), lastYear(number), currentYear(number)]',
      type: 'array',
      items: {
        oneOf: [
            {
              type: 'string',
              example: 'Jan'
            },
            {
              'type': 'number',
              'nullable': true,
              'example': 10
            },
            {
              'type': 'number',
              'nullable': true,
              'example': 12
            }
          ]
        },
      minItems: 3,
      maxItems: 3,
    },
    OfficeHistoArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeHistoRow' } },
  
    OfficePastTotals: {
      type: 'object',
      properties: {
        current: { type: 'number', example: 83 },
        last: { type: 'number', example: 76 },
      },
    },
  
    OfficePresentRow: {
      type: 'object',
      properties: {
        MonthName: { type: 'string', example: 'Jan' },
        dateOrd: { type: 'string', format: 'date-time', example: '2025-01-01T00:00:00.000Z' },
        LIST: { type: 'number', example: 5 },
        SELL: { type: 'number', example: 7 },
        DNA: { type: 'number', example: 2 },
      },
    },
    OfficePresentArray: { type: 'array', items: { $ref: '#/components/schemas/OfficePresentRow' } },
  
    OfficePresentMetricsRow: {
      type: 'object',
      properties: {
        LIST: { type: 'number', example: 12 },
        SELL: { type: 'number', example: 9 },
        DNA: { type: 'number', example: 3 },
      },
    },
    OfficePresentMetricsArray: { type: 'array', items: { $ref: '#/components/schemas/OfficePresentMetricsRow' } },
  
    OfficeNbrAgents: { type: 'number', example: 57 },
  
    OfficeGeoTop10Percent: {
      type: 'number',
      example: 68,
      description: 'Percentage of production concentrated in the Top 10 ZIPs (0–100).',
    },
  
    OfficeGeoReportRow: {
      type: 'object',
      properties: {
        zipCode: { type: 'string', example: '78701' },
        total: { type: 'number', example: 15 },
      },
    },
    OfficeGeoReportArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeGeoReportRow' } },
  
    OfficeProdRow: {
      type: 'object',
      properties: {
        num_agents: { type: 'number', example: 42 },
        nombre: { type: 'number', example: 320 },
      },
    },
    OfficeProdArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeProdRow' } },
  
    OfficeRankingRow: {
      type: 'object',
      properties: {
        ranking: { type: 'number', example: 1 },
        agentId: { type: 'string', example: '123456' },
        firstName: { type: 'string', example: 'Bob' },
        lastName: { type: 'string', example: 'Brown' },
        nombre: { type: 'number', example: 120 },
        officeName: { type: 'string', example: 'KW Austin' },
      },
    },
    OfficeRankingArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeRankingRow' } },
  
    OfficeTopCityRow: {
      type: 'object',
      properties: {
        city: { type: 'string', example: 'Austin' },
        nombre: { type: 'number', example: 55 },
      },
    },
    OfficeTopCityArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeTopCityRow' } },
  
    // Search history
    OfficeSearchRow: {
      type: 'object',
      properties: {
        savedType: { type: 'string', example: 'office' },
        officeName: { type: 'string', example: 'KW Austin' },
        officeId: { type: 'string', example: '564123' },
        isFavorite: { type: 'boolean', example: true },
        state: { type: 'string', example: 'TX' },
      },
    },
    OfficeSearchArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeSearchRow' } },
  };
  