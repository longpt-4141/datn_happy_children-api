const express = require('express');
const cors = require('cors');
const app = express();
const ejs = require('ejs');
const configViewEngine = require('./config/viewEngine');
const connectDatabase = require('./database/connectDatabase');

const route = require('./routes');

var corsOptions = {
    origin: "http://localhost:8081"
    };

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config viewEngine
configViewEngine(app);

//connect database
connectDatabase();

app.get("/", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
    });

app.get('/register', (req, res, next) => {
    res.send({
        message : 'test123'
    })
})

route(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
