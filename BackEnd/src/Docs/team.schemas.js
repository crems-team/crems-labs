module.exports = {
    // ===== Payloads =====
    TeamIdPayload: {
      type: 'object',
      required: ['id'],
      properties: {
        id: { type: 'string', example: '123456' }
      }
    },
  
    TeamGraphFilterPayload: {
      type: 'object',
      required: ['data', 'filterCriteria'],
      properties: {
        data: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', example: '123456' }
          }
        },
        filterCriteria: {
          type: 'object',
          properties: {
            office: { type: 'boolean', example: false },
            officeName: { type: 'string', nullable: true, example: 'KW Austin' },
            tiers: {
              type: 'object',
              properties: {
                T1: { type: 'boolean', example: false },
                T2: { type: 'boolean', example: false },
                T3: { type: 'boolean', example: false },
                T4: { type: 'boolean', example: false }
              }
            }
          }
        }
      }
    },
  
    TeamTableFilterPayload: {
      type: 'object',
      required: ['data', 'filterCriteria'],
      properties: {
        data: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string', example: '123456' }
          }
        },
        filterCriteria: {
          type: 'object',
          required: ['typeTable'],
          properties: {
            typeTable: {
              type: 'string',
              enum: ['level1', 'level2'],
              example: 'level1'
            },
            office: { type: 'boolean', example: false },
            tiers: {
              type: 'object',
              properties: {
                T1: { type: 'boolean', example: false },
                T2: { type: 'boolean', example: false },
                T3: { type: 'boolean', example: false },
                T4: { type: 'boolean', example: false }
              }
            }
          }
        }
      }
    },
  
    // ===== Réponses / modèles =====
    TeamNode: {
      type: 'object',
      properties: {
        id:          { type: 'string', example: '123456' },
        agentname:   { type: 'string', example: 'Alice Smith' },
        agentoffice: { type: 'string', example: 'KW Austin' },
        size:        { type: 'number', example: 7 },
        color:       { type: 'string', example: '#00AA88' }
      }
    },
    TeamNodeArray: { type: 'array', items: { $ref: '#/components/schemas/TeamNode' } },
  
    TeamLink: {
      type: 'object',
      properties: {
        source: { type: 'string', example: '123456' },
        target: { type: 'string', example: '789012' },
        size:   { type: 'number', example: 6 },
        count:  { type: 'number', example: 12 },
        sell:   { type: 'number', example: 7 },
        colist: { type: 'number', example: 5 }
      }
    },
    TeamLinkArray: { type: 'array', items: { $ref: '#/components/schemas/TeamLink' } },
  
    TeamGraph: {
      type: 'object',
      properties: {
        nodes: { $ref: '#/components/schemas/TeamNodeArray' },
        links: { $ref: '#/components/schemas/TeamLinkArray' }
      }
    },
  
    TeamTableRow: {
      type: 'object',
      properties: {
        source: { type: 'string', example: 'Alice Smith' },
        target: { type: 'string', example: 'Bob Brown' },
        office: { type: 'string', example: 'KW Austin' },
        size:   { type: 'number', example: 6 },
        count:  { type: 'number', example: 12 },
        sell:   { type: 'number', example: 7 },
        colist: { type: 'number', example: 5 }
      }
    },
    TeamTableList: { type: 'array', items: { $ref: '#/components/schemas/TeamTableRow' } },
  
    TeamTableResponse: {
      type: 'object',
      properties: {
        firstSecondLevelList: { $ref: '#/components/schemas/TeamTableList' }
      }
    }
  };
  