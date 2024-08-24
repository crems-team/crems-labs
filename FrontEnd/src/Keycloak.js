import Keycloak from "keycloak-js";


const url = process.env.REACT_APP_KEYCLOAK_URL;
const realm = process.env.REACT_APP_KEYCLOAK_REALM;
const clientId = process.env.REACT_APP_KEYCLOAK_CLIENTID;


console.log(` url: ${url}`);
console.log(` realm: ${realm}`);
console.log(` clientid: ${clientId}`);

const keycloak = new Keycloak({
 url: `${url}`,
 realm: `${realm}`,
 clientId: `${clientId}`
});

export default keycloak;
