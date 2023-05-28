const {authJwt} = require('./index')
const jwt = require('jsonwebtoken');
const config = require("../config/auth.config");

checkUserAccessToken = (req, res, next) => {
    let token = req.body.token;
    console.log('cho tao cai token',token, req.body);
    if( token ) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log('>>> loi',{err});
                return res.status(401).send({
                    EC: 'ERR_NOT_LOGGED-IN',
                    EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng dịch vụ"
                });
            }
            req.user = decoded
            req.token = token
            console.log({decoded});
            next();
        });
    } else {
        return res.status(200).send({
            EC: 'ERR_NOT_LOGGED-IN',
            EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng dịch vụ"
        })
    }
}

checkUserLoginWithCookie = (req, res, next) => {
    let cookiesRequest = req.cookies;
    if( cookiesRequest && cookiesRequest.jwt) {
        let token = cookiesRequest.jwt;
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                console.log('>>> loi',{err});
                return res.status(401).send({
                    EC: 'ERR_NOT_LOGGED-IN',
                    EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng dịch vụ"
                });
            }
            req.user = decoded
            req.token = token
            console.log({decoded});
            // req.userId = decoded.id;
            next();
          });
    } else {
        console.log('>>> loi2', req.cookies);
        return res.status(200).send({
            EC: 'ERR_NOT_LOGGED-IN',
            EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng dịch vụ"
        })
    }
}

checkAdminPermission = (req, res, next) => {
    if (req.user) {
        console.log('vao admin roi')
        let role = req.user.role;
        if( role.name === 'admin') {
            next();
        }else {
            return res.status(403).send({
                EC: 'ERR_NOT_HAVE_PERMISSION',
                EM: "Bạn không có quyền hạn trong trang web này, vui lòng quay trở lại trang web của bạn"
            })
        }

    }else{
        return res.status(401).send({
            EC: 'ERR_NOT_LOGGED-IN',
            EM: "Bạn chưa đăng nhập, vui lòng đăng nhập để sử dụng dịch vụ"
        })
    }
}


const checkUserLogin = {
    checkUserLoginWithCookie: checkUserLoginWithCookie,
//   isModeratorOrAdmin: isModeratorOrAdmin,
    checkAdminPermission,
    checkUserAccessToken
};
module.exports = checkUserLogin;