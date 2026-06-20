module.exports = {
// Reusable: item {label, value}
    'Item': {
      type: 'object',
      properties: {
        label: { type: 'string', example: '123456789' },
        value: { type: 'string', example: '123456789' }
      }
    },
  
    // ---- Autocomplete request bodies
    'AgentIdAutoBody': {
      type: 'object',
      required: ['agentId'],
      properties: {
        agentId: { type: 'string', example: '123' }
      }
    },
    'OfficeAutoBody': {
      type: 'object',
      required: ['office', 'agentId'],
      properties: {
        office:  { type: 'string', example: 'eXp Realty' },
        agentId: { type: 'string', example: '987654' }
      }
    },
    'AddressAutoBody': {
      type: 'object',
      required: ['address', 'agentId'],
      properties: {
        address: { type: 'string', example: '123 Main' },
        agentId: { type: 'string', example: '987654' }
      }
    },
    'CityAutoBody': {
      type: 'object',
      required: ['city', 'agentId'],
      properties: {
        city:    { type: 'string', example: 'Austin' },
        agentId: { type: 'string', example: '987654' }
      }
    },
  
    'SearchDataBody': {
      type: 'object',
      required: ['agentId'],
      properties: {
        agentId: { type: 'string', example: '987654' },
        office:  { type: 'string', example: 'eXp Realty' },
        address: { type: 'string', example: '123 Main St' },
        city:    { type: 'string', example: 'Austin' }
      }
    },
  
// ---- Search data response (
    'ListingHistorical': {
      type: 'object',
      additionalProperties: true,
      properties: {
        listAgentIdC: { type: 'string', example: '987654' },
        officeId:     { type: 'string', example: 'TX-DFW-01' },
        officeName:   { type: 'string', example: 'eXp Realty - Dallas' },
        address:      { type: 'string', example: '123 Main St' },
        city:         { type: 'string', example: 'Dallas' }
      }
    },
  
    'SaveSearchBodySearchTool': {
      type: 'object',
      required: ['userId', 'savedType', 'agentId'],
      properties: {
        userId:    { type: 'integer', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string',  example: 'SEARCH' },
        agentId:   { type: 'string',  example: '987654' },
        officeName:{ type: 'string',  example: 'eXp Realty - Dallas' },
        address:   { type: 'string',  example: '123 Main St' },
        city:      { type: 'string',  example: 'Dallas' }
      }
    },
  
    'SavedTypeBody': {
      type: 'object',
      required: ['userId', 'savedType'],
      properties: {
        userId:    { type: 'integer', example: 'fe394ec1-ac90-8752-9d67-12334094a3' },
        savedType: { type: 'string',  example: 'SEARCH' }
      }
    },
  
    'ToggleFavoriteBody': {
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
  
    'HistoryItemSearchTool': {
      type: 'object',
      properties: {
        idHistory:  { type: 'integer', example: 101 },
        savedType:  { type: 'string',  example: 'SEARCH' },
        agentId:    { type: 'string',  example: '987654' },
        officeName: { type: 'string',  example: 'eXp Realty - Dallas' },
        address:    { type: 'string',  example: '123 Main St' },
        city:       { type: 'string',  example: 'Dallas' },
        isFavorite: { type: 'integer', example: 1 }
      }
    },
  
    'FavoriteItemSearchTool': {
      type: 'object',
      properties: {
        savedType:  { type: 'string', example: 'SEARCH' },
        agentId:    { type: 'string', example: '987654' },
        officeName: { type: 'string', example: 'eXp Realty - Dallas' },
        address:    { type: 'string', example: '123 Main St' },
        city:       { type: 'string', example: 'Dallas' },
        isFavorite: { type: 'integer', example: 0 }
      }
    }
  };
  