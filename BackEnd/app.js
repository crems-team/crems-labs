require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const session = require('express-session');
const { keycloak, memoryStore } = require('./src/Config/keycloak');
const AppError = require('./src/Utils/AppError');
const globalErrorHandler = require('./src/Controllers/ErrorController');
const { apiRouter } = require('./src/Routes/index');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./src/Config/swagger');
const basicAuth = require('express-basic-auth');

const app = express();

app.set('trust proxy', 'loopback');

const corsOptions = {
    origin: 'http://localhost:3001',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 7200
};

app.use(cors(corsOptions));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,             // 15 min
  max: 500,                              // 500 req/IP/15min
  standardHeaders: true,                 // RateLimit-* headers
  legacyHeaders: false,                  
  skip: (req) => req.method === 'OPTIONS',
  handler: (req, res, next) =>
    next(new AppError('Too many requests, please try again later.', 429))
});

app.use(globalLimiter); 

app.use(morgan('dev'));

app.use(bodyParser.json({limit: '50mb', extended: true})); 


app.use(session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
      cookie: {
        secure: false, // change to true if use HTTPS
        maxAge: 24 * 60 * 60 * 1000
      }
    }));

const docsBasicAuth = basicAuth({
  users: { [process.env.DOCS_USER]: process.env.DOCS_PASS },
  challenge: true,                
  unauthorizedResponse: 'Unauthorized'
});    
app.use('/api-docs', docsBasicAuth, swaggerUi.serve, swaggerUi.setup(swaggerSpec , {
  swaggerOptions: {
    // Hide the entire Schemas / Models section
    defaultModelsExpandDepth: -1,
    // Do not expand endpoints by default
    docExpansion: 'none',
    // collapse individual models
    defaultModelExpandDepth: 0,
  },
}));

app.use(keycloak.middleware());

app.use('/app',keycloak.protect(), apiRouter);
 
// global Error Handler
app.use(globalErrorHandler);



module.exports = app;
