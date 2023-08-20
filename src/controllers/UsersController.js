const db = require('../models/index');

class UsersController {
    index = (req, res, next) => {
        db.centers.findAll({
            include: {
                all: true,
                nested: true
            }
        })
            .then((roles) => {
                res.send(roles)
            })
            .catch((err) => {
                console.error('loi lay cac user :' ,err)
            })
    }

    changeUserAvatar = (req, res) => {
        const avatar = req.body.change_avatar_request_data.avatar
        const email = req.body.change_avatar_request_data.email
        db.users.update({avatar}, 
            {
                where : {
                    email : email
                }
            }
        ).then(() => {
            res.status(200).json({
				EM: "Bạn đã cập nhật ảnh đại diện thành công, vui lòng tải lại trang để xem lại",
				EC: "SUCCESS_CHANGE_AVATAR",
			});
        }).catch(err => {
            console.log(err);
        })
    }
 }

module.exports = new UsersController