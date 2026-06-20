module.exports = {

     // ====== Payloads ======
     AgentIdPayload: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number', example: '123456' } },
      },
      TermPayload: {
        type: 'object',
        required: ['term'],
        properties: { term: { type: 'string', example: 'John Doe' } },
      },
      OfficeCtxPayload: {
        type: 'object',
        required: ['id', 'officeId'],
        properties: {
          id: { type: 'string', example: '123456' },
          officeId: { type: 'string', example: '123456' },
        },
      },
      SaveSearchPayload: {
        type: 'object',
        required: ['userId', 'savedType', 'fullName', 'agentIdC', 'state'],
        properties: {
          userId: { type: 'string', example: 'fe394ec1-ac37-0897-9d67-12334094a3eb' },
          savedType: { type: 'string', example: 'agent' },
          fullName: { type: 'string', example: 'John Doe' },
          agentIdC: { type: 'string', example: '123456' },
          state: { type: 'string', example: 'CA' },
        },
      },
      SearchQueryPayload: {
        type: 'object',
        required: ['userId', 'savedType'],
        properties: {
          userId: { type: 'string', example: 'fe394ec1-ac37-0897-9d67-12334094a3eb' },
          savedType: { type: 'string', example: 'agent' },
        },
      },
      ToggleFavoritePayload: {
        type: 'object',
        required: ['search'],
        properties: {
          search: {
            type: 'object',
            required: ['agentId', 'isFavorite'],
            properties: {
              agentId: { type: 'string', example: 'fe394ec1-ac37-0897-9d67-12334094a3eb' },
              isFavorite: { type: 'boolean', example: true },
            },
          },
        },
      },

      // ====== Models / Responses ======
      Agent: {
        type: 'object',
        properties: {
          agentIdC: { type: 'string', example: 'A-123456' },
          agentfirstName: { type: 'string', example: 'Alice' },
          agentlastName: { type: 'string', example: 'Smith' },
          officeName: { type: 'string', example: 'Keller Williams' },
          officeCity: { type: 'string', example: 'Austin' },
          officeState: { type: 'string', example: 'TX' },
          officeId: { type: 'string', example: 'OFF-987' },
          agentPhone: { type: 'string', example: '+1 555 123456' },
          agentEmail: { type: 'string', example: 'alice@example.com' },
          officeAddress: { type: 'string', example: '123 Main St' },
          officePhone: { type: 'string', example: '+1 555 654321' },
        },
      },
      AgentArray: { type: 'array', items: { $ref: '#/components/schemas/Agent' } },

      AgentNameRow: {
        type: 'object',
        properties: {
          agentIdC: { type: 'string' },
          agentfirstName: { type: 'string' },
          agentlastName: { type: 'string' },
          officeName: { type: 'string' },
          officeState: { type: 'string' },
        },
      },
      AgentNameArray: { type: 'array', items: { $ref: '#/components/schemas/AgentNameRow' } },

      HistoRow: {
        description: "A single historical record for a given month.",
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
                'example': 5
              },
              {
                'type': 'number',
                'nullable': true,
                'example': 7
              }
            ]
          },
          minItems: 3,
          maxItems: 3
      },
      HistoArray: { type: 'array', items: { $ref: '#/components/schemas/HistoRow' } },

      PastTotals: {
        type: 'object',
        properties: {
          current: { type: 'number', example: 83 },
          last: { type: 'number', example: 76 },
        },
      },

      PresentRow: {
          type: 'object',
          properties: {
            MonthName: { type: 'string', example: 'Jan' },
            dateOrd: { type: 'string', format: 'date-time', example: '2024-01-01T00:00:00.000Z' },
            LIST: { type: 'number', example: 2 },
            SELL: { type: 'number', example: 4 },
            DNA: { type: 'number', example: 1 },
          },
        },
      PresentArray: { type: 'array', items: { $ref: '#/components/schemas/PresentRow' } },

      StatData: {
        type: 'object',
        properties: {
          LIST: { type: 'number', example: 12 },
          SELL: { type: 'number', example: 9 },
          DNA: { type: 'number', example: 3 },
        },
      },
      StatDataArray: { type: 'array', items: { $ref: '#/components/schemas/StatData' } },

      

      FutureTotals: {
        type: 'object',
        properties: {
          newListings: { type: 'number', example: 3 },
          existListing: { type: 'number', example: 5 },
          pendingListings: { type: 'number', example: 2 },
        },
      },
      FutureTotalsArray: { type: 'array', items: { $ref: '#/components/schemas/FutureTotals' } },

      FutureRow: {
        type: 'object',
        properties: {
          MonthName: { type: 'string', example: 'Jan' },
          lastUpdateYEAR: { type: 'number', example: 2025 },
          lastUpdateMonth: { type: 'number', example: 1 },
          newListings: { type: 'number', example: 2 },
          existListing: { type: 'number', example: 4 },
          pendingListings: { type: 'number', example: 1 },
          MonthNum: { type: 'number', example: 1 },
        },
      },
      FutureArray: { type: 'array', items: { $ref: '#/components/schemas/FutureRow' } },

      GeoTop10Percent: {
        type: 'object',
        properties: { total: { type: 'number', example: 67 } },
      },

      GeoReportRow: {
        type: 'object',
        properties: {
          zipCode: { type: 'string', example: '78701' },
          total: { type: 'number', example: 15 },
        },
      },
      GeoReportArray: { type: 'array', items: { $ref: '#/components/schemas/GeoReportRow' } },

      OfficeProdSummary: {
        type: 'object',
        properties: {
          ranking: { type: 'number', example: 3 },
          numAgents: { type: 'number', example: 42 },
          officeProd: { type: 'number',  example: 18 },
        },
      },

      OfficeRankingRow: {
        type: 'object',
        properties: {
          ranking: { type: 'number', example: 1 },
          agentId: { type: 'string', example: 'A-555' },
          firstName: { type: 'string', example: 'Bob' },
          lastName: { type: 'string', example: 'Brown' },
          nombre: { type: 'number', example: 120 },
          officeName: { type: 'string', example: 'KW Austin' },
        },
      },
      OfficeRankingArray: { type: 'array', items: { $ref: '#/components/schemas/OfficeRankingRow' } },

      TeamCounts: {
        type: 'object',
        properties: {
          count: { type: 'number', example: 8 },
          Transactions: { type: 'number', example: 24 },
        },
      },

      TeamAgentRow: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '15687' },
          firstName: { type: 'string', example: 'Jane' },
          lastName: { type: 'string', example: 'Doe' },
          officeName: { type: 'string', example: 'RE/MAX' },
          colist: { type: 'number', example: 2 },
          cosell: { type: 'number', example: 1 },
          sell: { type: 'number', example: 3 },
          total: { type: 'number', example: 6 },
        },
      },
      TeamAgentArray: { type: 'array', items: { $ref: '#/components/schemas/TeamAgentRow' } },

      TierPersonaRow: {
        type: 'object',
        properties: {
          agentId: { type: 'string' ,example: '15687'},
          total: { type: 'number' },
          dna: { type: 'number' },
          list: { type: 'number' },
          sell: { type: 'number' },
          persona: { type: 'string', example: 'T1' },
        },
      },
      TierPersonaArray: { type: 'array', items: { $ref: '#/components/schemas/TierPersonaRow' } },

      SearchRow: {
        type: 'object',
        properties: {
          savedType: { type: 'string', example: 'agent' },
          fullName: { type: 'string', example: 'Alice Smith' },
          isFavorite: { type: 'boolean', example: true },
          agentIdC: { type: 'string', example: '123456' },
          state: { type: 'string', example: 'TX' },
        },
      },
      SearchArray: { type: 'array', items: { $ref: '#/components/schemas/SearchRow' } },

      
      
};