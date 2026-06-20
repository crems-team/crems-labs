module.exports = {
    'LoanOfficer': {
      type: 'object',
      properties: {
        officerName: { type: 'string', example: 'Jane Doe' },
        officeName:  { type: 'string', example: 'Prime Lending - Austin' }
      }
    },
  
    'LoanOfficerSearchItem': {
      type: 'object',
      properties: {
        label: { type: 'string', example: 'Jane Doe' },
        value: { type: 'string', example: '123456' } 
      }
    },
  
    'LoanOfficerList': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          officerNmlsId: { type: 'string', example: '123456' },
          officerName:   { type: 'string', example: 'Jane Doe' },
          officeName:    { type: 'string', example: 'Prime Lending - Austin' }
        }
      }
    },
  
    'SankeyItem': {
      type: 'object',
      properties: {
        agentId:     { type: 'integer', example: 98765 },
        Name:        { type: 'string',  example: 'John Smith' },
        Nlistings:   { type: 'integer', example: 120 },
        total:       { type: 'integer', example: 30 },
        captureRate: { type: 'number',  format: 'float', example: 25.0 }
      }
    },
  
    'SankeyResponse': {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: { $ref: '#/components/schemas/SankeyItem' }
        }
      }
    },
  
    'TotalAgents': {
      type: 'object',
      properties: { total: { type: 'integer', example: 42 } }
    },
  
    'SalesCapRate': {
      type: 'object',
      properties: {
        sales:   { type: 'integer', example: 250 },
        capRate: { type: 'number',  format: 'float', example: 18.75 }
      }
    },
  
    'HistoryItemLO': {
      type: 'object',
      properties: {
        idHistory:   { type: 'integer', example: 101 },
        officerId:   { type: 'string',  example: '123456' },
        officerName: { type: 'string',  example: 'Jane Doe' },
        savedType:   { type: 'string',  example: 'LO' },
        isFavorite:  { type: 'integer', example: 1 }
      }
    },
  
    'FavoriteItemLO': {
      type: 'object',
      properties: {
        officerId:   { type: 'string', example: '123456' },
        officerName: { type: 'string', example: 'Jane Doe' },
        savedType:   { type: 'string', example: 'LO' },
        isFavorite:  { type: 'integer', example: 0 }
      }
    },
  
    'RankingItemLO': {
      type: 'object',
      properties: {
        ranking:           { type: 'integer', example: 3 },
        agentId:           { type: 'string',  example: '998877' },
        firstName:         { type: 'string',  example: 'John' },
        lastName:          { type: 'string',  example: 'Smith' },
        nombre:            { type: 'integer', example: 145 },
        officeName:        { type: 'string',  example: 'eXp Realty - Dallas' },
        loTxs:             { type: 'integer', example: 27 },
        capturePercentage: { type: 'number',  format: 'float', example: 18.62 }
      }
    },
  
    'OfficeName': {
      type: 'object',
      properties: {
        officeName: { type: 'string', example: 'Guild Mortgage - Phoenix' }
      }
    },
  
    'WorkedWithAgentItem': {
      type: 'object',
      properties: {
        officerName:  { type: 'string',  example: 'Jane Doe' },
        officerNmlsId:{ type: 'string',  example: '123456' },
        total:        { type: 'integer', example: 9 },
        agentName:    { type: 'string',  example: 'John Smith' },
        captureRate:  { type: 'number',  format: 'float', example: 12.5 }
      }
    },
  
    // ----- Common request bodies -----
    'IdBody': {
      type: 'object',
      required: ['id'],
      properties: { id: { type: 'string', example: '123456' } }  
    },
  
    'OfficerIdBody': {
      type: 'object',
      required: ['officerId'],
      properties: { officerId: { type: 'string', example: '123456' } }
    },
  
    'NameBody': {
      type: 'object',
      required: ['name'],
      properties: { name: { type: 'string', example: 'Jane Doe' } }
    },
  
    'TermBody': {
      type: 'object',
      required: ['term'],
      properties: { term: { type: 'string', example: 'Ja' } }
    },
  
    'SaveSearchBodyLO': {
      type: 'object',
      required: ['userId', 'savedType', 'officerName', 'officerId'],
      properties: {
        userId:      { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType:   { type: 'string',  example: 'LO' },
        officerName: { type: 'string',  example: 'Jane Doe' },
        officerId:   { type: 'string',  example: '123456' }
      }
    },
  
    'SavedTypeBody': {
      type: 'object',
      required: ['userId', 'savedType'],
      properties: {
        userId:    { type: 'string', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string',  example: 'LO' }
      }
    },
  
    'ToggleFavoriteBodyLO': {
      type: 'object',
      required: ['search'],
      properties: {
        search: {
          type: 'object',
          required: ['idHistory', 'isFavorite'],
          properties: {
            idHistory:  { type: 'integer', example: 101 },
            isFavorite: { type: 'integer', example: 0 }
          }
        }
      }
    },
  
    'RankingLOBody': {
      type: 'object',
      required: ['idOfficer', 'idAgent', 'officeId'],
      properties: {
        idOfficer: { type: 'string',  example: '123456' },
        idAgent:   { type: 'string',  example: '998877' },
        officeId:  { type: 'string',  example: '18675' }
      }
    },
  
    'AgentIdBody': {
      type: 'object',
      required: ['idAgent'],
      properties: { idAgent: { type: 'string', example: '998877' } }
    }
  };
  