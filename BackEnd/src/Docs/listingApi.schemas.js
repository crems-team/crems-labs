module.exports = {
    'Item': {
      type: 'object',
      properties: {
        label: { type: 'string', example: 'eXp Realty - Dallas' },
        value: { type: 'string', example: '232346' }
      }
    },
  
    // -------- Update (fetch & save) --------
    'ListingsApiUpdateCriteria': {
      type: 'object',
      properties: {
        authToken: { type: 'string', example: 'ABCDEFGHIJKLMNOP' },
        mlsSid:    { type: 'string', example: 'NTREIS' },
        status:    { type: 'string', example: 'All' },
        searchStr: { type: 'string', example: 'All' },
        searchBy:  { type: 'string', example: 'office' },
        fromDate:  { type: 'string', format: 'date', example: '2024-01-01' },
        toDate:    { type: 'string', format: 'date', example: '2024-12-31' },
        recLimit:  { type: 'integer', example: 5000 }
      }
    },
    'ListingsApiUpdateBody': {
      type: 'object',
      properties: {
        criteria: { $ref: '#/components/schemas/ListingsApiUpdateCriteria' }
      }
    },
    'ListingsApiUpdateResponse': {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Data updated successfully from API' }
      }
    },
  
    // -------- search --------
    'SearchListingsCriteria': {
      type: 'object',
      properties: {
        first: { type: 'integer', example: 0, description: 'Offset' },
        rows:  { type: 'integer', example: 10, description: 'Limit' }
      }
    },
    'SearchListingsBody': {
      type: 'object',
      properties: {
        criteria: { $ref: '#/components/schemas/SearchListingsCriteria' }
      }
    },
  
    // -------- Autocomplete bodies --------
    'LAutoOfficeBody': {
      type: 'object',
      required: ['office'],
      properties: {
        office: { type: 'string', example: 'eXp' }
      }
    },
    'LAutoAddressBody': {
      type: 'object',
      required: ['address'],
      properties: {
        address: { type: 'string', example: 'Main' }
      }
    },
    'LAutoCityBody': {
      type: 'object',
      required: ['city'],
      properties: {
        city: { type: 'string', example: 'Dallas' }
      }
    },
  
    // -------- Free search body --------
    'ListingFreeSearchBody': {
      type: 'object',
      properties: {
        office:  { type: 'string', example: 'eXp Realty - Dallas' },
        address: { type: 'string', example: '123 Main St' },
        city:    { type: 'string', example: 'Dallas' }
      }
    },
  
    // -------- Listing record--------
    'ListingRecord': {
      type: 'object',
      additionalProperties: true,
      properties: {
        mlsSid:              { type: 'string', example: 'NTREIS' },
        listAgentId:         { type: 'string', example: '123456' },
        listAgentFirstName:  { type: 'string', example: 'John' },
        listAgentLastName:   { type: 'string', example: 'Doe' },
        coListAgentId:       { type: 'string', example: '789012' },
        sellAgentId:         { type: 'string', example: '654321' },
        dom:                 { type: 'string', example: '42' },
        city:                { type: 'string', example: 'Dallas' },
        state:               { type: 'string', example: 'TX' },
        zipCode:             { type: 'string', example: '75201' },
        address:             { type: 'string', example: '123 Main St' },
        addressUnit:         { type: 'string', example: 'Apt 5' },
        dateList:            { type: 'string', example: '2024-06-03' },
        listPrice:           { type: 'string', example: '525000' },
        statusCode:          { type: 'string', example: 'S' },
        dateStatusChange:    { type: 'string', example: '2024-06-20' },
        listingId:           { type: 'string', example: 'MLS-ABC-001' },
        listOfficeId:        { type: 'string', example: 'TX-DFW-01' },
        listOfficeName:      { type: 'string', example: 'eXp Realty - Dallas' },
        sellOfficeId:        { type: 'string', example: 'TX-DFW-02' },
        sellOfficeName:      { type: 'string', example: 'Compass Dallas' }
      }
    },
  
    // -------- Responses --------
    'SearchListingsResponse': {
      type: 'object',
      properties: {
        listings: {
          type: 'array',
          items: { $ref: '#/components/schemas/ListingRecord' }
        },
        totalRecords: { type: 'integer', example: 12345 }
      }
    },
    'ListingsTop1000Response': {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: '1000 records have been recovered from API and 50234 records have been loaded'
        },
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ListingRecord' }
        }
      }
    }
  };
  