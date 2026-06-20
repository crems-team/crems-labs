const swaggerJSDoc = require('swagger-jsdoc');
const commonSchemas   = require('../Docs/common.schemas');
const commonResponses = require('../Docs/common.responses');
const agentSchemas = require('../Docs/agent.schemas');
const officeSchemas = require('../Docs/Office.schemas');
const teamSchemas = require('../Docs/team.schemas');
const geoareaSchemas = require('../Docs/geoarea.schemas');
const loanOfficerSchemas = require('../Docs/loanOfficer.schemas');
const searchToolSchemas = require('../Docs/searchTool.schemas');
const listingApiSchemas = require('../Docs/listingApi.schemas');
const teamInvestigationSchemas = require('../Docs/teamInvestigation.schemas');



const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'CREMS API',
    version: '1.0.0',
    description: 'Documentation of Agent Endpoints',
  },
    servers: [
      { url: process.env.API_PUBLIC_URL || 'http://localhost:3000', description: 'Local' },
      { url:  'http://dev.crems-labs.com', description: 'Staging' },
      { url:  'https://crems-labs.com', description: 'Production' },
    ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
       ...commonSchemas,
       ...agentSchemas,
       ...officeSchemas,
       ...teamSchemas,
       ...geoareaSchemas,
       ...loanOfficerSchemas,
       ...searchToolSchemas,
       ...listingApiSchemas,
       ...teamInvestigationSchemas
    },
    responses: {
        ...commonResponses,
    },
    },
    tags: [
      { name: 'Agents', description: 'Agents & Reports' },
      { name: 'Offices', description: 'Offices & Reports' },
      { name: 'Teams', description: 'Team graph and relationships' },
      { name: 'Area', description: 'Production metrics by geographic area' },
      { name: 'LoanOfficer', description: 'Loan officers & Reports' },
      { name: 'SearchTool', description: 'Searches the raw MLS query results' },
      { name: 'ListingAPI', description: 'Fetch listings from the external XML API into the local DB' },
      { name: 'Team Investigation', description: 'Team investigation graph, hierarchy and member relationships' },

    ],
  };
  
  const options = {
    definition: swaggerDefinition,
    apis: ['./src/Routes/**/*.js', './src/Controllers/**/*.js'],
  };
  
  const swaggerSpec = swaggerJSDoc(options);
  module.exports = { swaggerSpec };