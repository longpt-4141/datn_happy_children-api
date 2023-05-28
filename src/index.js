const express = require('express');
const cors = require('cors');
const app = express();
const { createServer } = require("http");
const {Server} = require("socket.io");
const ejs = require('ejs');
const configViewEngine = require('./config/viewEngine');
const connectDatabase = require('./database/connectDatabase');

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const {authJwt} = require('./middleware/index')
const SocketService = require('./services/SocketService')
const route = require('./routes');

var corsOptions = {
    origin: "http://localhost:8081"
    };

//connect database
connectDatabase();

// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use (
    session ({
        key: "userId",
        secret: "subscribe",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 60 * 60 * 24,
        },
    })
);

app.use(function(req, res, next) {
    const allowedOrigins = ['https://happy-children.vercel.app', 'http://localhost:3000', 'http://127.0.0.1:9000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Access-Control-Allow-Credentials0', true)
            res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS')
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token')
    }
    res.header('Access-Control-Allow-Credentials', true);
    // res.header('Access-Control-Allow-Origin', 'https://happy-children.vercel.app' );
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With,x-access-token');
    // allow preflight
    if (req.method === 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});

//cookie
app.use(cookieParser());

// config viewEngine
configViewEngine(app);

route(app);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://happy-children.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials : true,
  },
});
global._io = io

global._io.on('connection', SocketService.connection)

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports.io = io; 