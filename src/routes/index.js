const indexRouter = require('./index/index.route');
const loginRouter = require('./login/login.route');
const registerRouter = require('./register/register.route');
const centersRouter = require('./centers/centers.route');
const requestsRouter = require('./requests.routes');
const notificationsRouter = require('./notification.routes')
const reportsRouter = require('./report.routes');
const newsRouter = require('./news.routes');
const transactionRouter = require('./transaction.routes');
const {checkUserLogin, getRoleByToken} = require('../middleware/index');
const authRouter = require('./account.routes');
const masterSettingRouter = require('./master-setting.routes');
function route(app) {
    app.use('/login', loginRouter);
    app.use('/register', registerRouter);
    
    app.use('/account', 
        checkUserLogin.checkUserAccessToken ,
        authRouter
        );
    app.use('/notifications', 
            notificationsRouter
        );
    app.use( '/centers', 
        checkUserLogin.checkUserAccessToken , 
        checkUserLogin.checkAdminPermission,
        centersRouter
        );
    app.use( '/requests', 
        requestsRouter
        );
    app.use( '/reports', 
        reportsRouter
        );
    app.use( '/news', 
        newsRouter 
        );
    app.use( '/transaction', 
        transactionRouter
        );
    app.use('/master-setting',masterSettingRouter)
    app.use('/', indexRouter);
}

module.exports = route;