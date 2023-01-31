// const indexRouter = require('./index/index.route');
const loginRouter = require('./login/login.route');
const registerRouter = require('./register/register.route');

function route(app) {
    app.use('/login', loginRouter);
    
    app.use('/register', registerRouter);
    // app.use('/', indexRouter);
}

module.exports = route;