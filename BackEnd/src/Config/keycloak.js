require('dotenv').config();
const session = require('express-session');
const Keycloak = require('keycloak-connect');

const memoryStore = new session.MemoryStore();
const keycloak = new Keycloak({ store: memoryStore }, {
  realm: process.env.KEYCLOAK_REALM,
  'auth-server-url': process.env.KEYCLOAK_URL,
  resource: process.env.KEYCLOAK_CLIENT_ID,
  'bearer-only': true
});


module.exports = keycloak;