module.exports = {

  // ---- Payloads ----

  TeamInvestigation_TeamId_Payload: {
    type: 'object',
    required: ['teamId'],
    properties: {
      teamId: {
        type: 'integer',
        example: 1001
      }
    }
  },

  TeamInvestigation_SearchTeamByName_Payload: {
    type: 'object',
    required: ['term'],
    properties: {
        term: {
        type: 'string',
        example: 'Austin'
        }
    }
    },

    TeamInvestigation_GraphFilterPayload: {
  type: 'object',
  required: ['data', 'filterCriteria'],
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
    },
    filterCriteria: {
      type: 'object',
      properties: {
        office: {
          type: 'boolean',
          example: false
        },
        tiers: {
          type: 'object',
          properties: {
            T0: { type: 'boolean', example: false },
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

    TeamInvestigation_SaveSearch_Payload: {
        type: 'object',
        required: ['userId', 'savedType', 'teamName', 'teamId'],
        properties: {
            userId: {
            type: 'string',
            example: 'fe394ec1-ac90-8752-9d67-12334094a3'
            },
            savedType: {
            type: 'string',
            example: 'teamInvestigation'
            },
            teamName: {
            type: 'string',
            example: 'Austin Elite Team'
            },
            teamId: {
            type: 'integer',
            example: 1001
            }
        }
        },
    TeamInvestigation_SearchQuery_Payload: {
        type: 'object',
        required: ['userId', 'savedType'],
        properties: {
            userId: {
            type: 'string',
            example: 'fe394ec1-ac90-8752-9d67-12334094a3'
            },
            savedType: {
            type: 'string',
            example: 'teamInvestigation'
            }
        }
        },

    TeamInvestigation_ToggleFavorite_Payload: {
        type: 'object',
        required: ['search'],
        properties: {
            search: {
            type: 'object',
            required: ['idHistory', 'isFavorite'],
            properties: {
                idHistory: {
                type: 'integer',
                example: 15
                },
                isFavorite: {
                type: 'boolean',
                example: true
                }
            }
            }
        }
        },

  // ---- Responses ----

  TeamInvestigation_NodeRow: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: 't1001'
      },
      name: {
        type: 'string',
        example: 'Austin Elite Team'
      },
      office: {
        type: 'string',
        example: 'Austin Downtown Office'
      },
      size: {
        type: 'number',
        example: 9
      },
      color: {
        type: 'string',
        example: '#379ffaff'
      }
    }
  },

  TeamInvestigation_LinkRow: {
    type: 'object',
    properties: {
      source: {
        type: 'string',
        example: 't1001'
      },
      target: {
        type: 'string',
        example: 'a123456'
      },
      size: {
        type: 'number',
        example: 5
      },
      role: {
        type: 'string',
        example: 'Leader'
      }
    }
  },

  TeamInvestigation_GetTeam_Response: {
    type: 'object',
    properties: {
      nodes: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/TeamInvestigation_NodeRow'
        }
      },
      links: {
        type: 'array',
        items: {
          $ref: '#/components/schemas/TeamInvestigation_LinkRow'
        }
      }
    }
  },

TeamInvestigation_SearchTeamRow: {
  type: 'object',
  properties: {
    value: {
      type: 'string',
      example: '1001'
    },
    label: {
      type: 'string',
      example: 'Austin Elite Team'
    }
  }
},

TeamInvestigation_SearchTeamArray: {
  type: 'array',
  items: {
    $ref: '#/components/schemas/TeamInvestigation_SearchTeamRow'
  }
},
TeamInvestigation_AgentRow: {
  type: 'object',
  properties: {
    agId: {
      type: 'integer',
      example: 123456
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
      example: '#00AA55'
    },
    size: {
      type: 'number',
      example: 7
    },
    countTx: {
      type: 'number',
      example: 124
    }
  }
},

TeamInvestigation_AgentArray: {
  type: 'array',
  items: {
    $ref: '#/components/schemas/TeamInvestigation_AgentRow'
  }
},

TeamInvestigation_SearchHistoryRow: {
  type: 'object',
  properties: {
    savedType: {
      type: 'string',
      example: 'teamInvestigation'
    },
    idHistory: {
      type: 'integer',
      example: 15
    },
    teamName: {
      type: 'string',
      example: 'Austin Elite Team'
    },
    teamId: {
      type: 'integer',
      example: 1001
    },
    isFavorite: {
      type: 'boolean',
      example: true
    }
  }
},

TeamInvestigation_SearchHistoryArray: {
  type: 'array',
  items: {
    $ref: '#/components/schemas/TeamInvestigation_SearchHistoryRow'
  }
},
TeamInvestigation_FavoriteHistoryRow: {
  type: 'object',
  properties: {
    savedType: {
      type: 'string',
      example: 'teamInvestigation'
    },
    teamName: {
      type: 'string',
      example: 'Austin Elite Team'
    },
    teamId: {
      type: 'integer',
      example: 1001
    },
    isFavorite: {
      type: 'boolean',
      example: false
    }
  }
},

TeamInvestigation_FavoriteHistoryArray: {
  type: 'array',
  items: {
    $ref: '#/components/schemas/TeamInvestigation_FavoriteHistoryRow'
  }
},
TeamInvestigation_TeamInfo: {
  type: 'object',
  properties: {
    teamName: {
      type: 'string',
      example: 'Austin Elite Team'
    },
    teamSize: {
      type: 'string',
      example: '12'
    },
    agentsOnteam: {
      type: 'string',
      example: '10'
    },
    brand: {
      type: 'string',
      example: 'Coldwell Banker'
    },
    officeNameBrokerage: {
      type: 'string',
      example: 'Austin Downtown Office'
    },
    teamWebsite: {
      type: 'string',
      example: 'https://www.austineliteteam.com'
    },
    teamId: {
      type: 'integer',
      example: 1001
    }
  }
},

};