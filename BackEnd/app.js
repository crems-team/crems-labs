var  express = require('express');
var  app = express();
var  bodyParser = require('body-parser');
var  morgan = require('morgan');
const { apiRouter } = require('./src/Routes/index');

const cors = require('cors');

const corsOptions = {
    origin: 'http://localhost:3001', // Replace with your client app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Use CORS middleware with options
app.use(cors(corsOptions));
//
app.use(morgan('dev'));
//body parse
// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ limit: '50mb',extended: true }))
// parse application/json
app.use(bodyParser.json({limit: '50mb', extended: true}))
app.use(function(req, res, next) {
    //res.header("Access-Control-Allow-Origin", "https://www.mnxdev.com");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Max-Age", "7200000");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Authtoken, multipart/form-data,Access-Control-Request-Method, Access-Control-Request-Headers');
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate, proxy-revalidate');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS'){
        res.header("Access-Control-Allow-Methods", 'PUT, POST, PATCH, GET, DELETE, OPTIONS');
        return res.status(200).json({})
    }
    next();
});


app.use('/app', apiRouter);


module.exports = app;