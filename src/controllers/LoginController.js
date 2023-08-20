const db = require("../models/index");
const bcrypt = require("bcryptjs");
const { checkEmailExist } = require("../services/loginRegisterService");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");
const { hashUserPassword } = require("../services/CRUDService");
class LoginController {
	index = (req, res, next) => {
		res.render("pages/login");
	};

	loginAuth = async (req, res) => {
		const formData = req.body.userData;
		console.log({ formData });
		const userEmail = formData.email;
		let isEmailExist = await checkEmailExist(userEmail);
		console.log({ isEmailExist });
		if (isEmailExist === false) {
			res.status(200).json({
				EM: "Email không tồn tại, vui lòng thử lại!",
				EC: "ERR_EMAIL_NOT_EXISTED",
			});
		} else
			db.users
				.findOne({
					where: {
						email: formData.email,
					},
					include: {
						model: db.roles,
					},
				})
				.then((user) => {
					bcrypt.compare(
						formData.password,
						user.password,
						(err, response) => {
							if (response) {
								console.log("dung");
								let token = jwt.sign(
									{
										id: user.id,
										id: user.id,
										email: user.email,
										role: user.role,
										username: user.username,
									},
									config.secret,
									{
										expiresIn: 864000,
									}
								);
								res.cookie("jwt", token, {
									httpOnly: true,
								});
								if (user.role.id === 2) {
									db.centers
										.findOne({
											where: {
												userId: user.id,
											},
										})
										.then((center) => {
											let newToken = jwt.sign(
												{
													id: user.id,
													id: user.id,
													email: user.email,
													role: user.role,
													centerId: center.id,
													username: user.username,
												},
												config.secret,
												{
													expiresIn: 864000,
												}
											);
											console.log(
												"get center from userId",
												center
											);
											res.status(200).send({
												EM: "Đăng nhập thành công",
												EC: "LOGIN_SUCCESS",
												DT: {
													id: user.id,
													email: user.email,
													role: user.role,
													accessToken: newToken,
													centerId: center.id,
													username: user.username,
													avatar: user.avatar,
												},
											});
										});
								} else if (user.role.id === 1) {
									res.status(200).send({
										EM: "Đăng nhập thành công",
										EC: "LOGIN_SUCCESS",
										DT: {
											id: user.id,
											email: user.email,
											role: user.role,
											accessToken: token,
											username: user.username,
											avatar: user.avatar,
										},
									});
								}
							} else {
								res.send({
									EM: "Sai mật khẩu, vui lòng nhập mật khẩu chính xác",
									EC: "ERR_PASSWORD_WRONG",
								});
							}
						}
					);
				})
				.catch((err) => {
					console.log(err);
				});
	};

	changePassword = async (req, res) => {
		const newPassword = req.new_password;
		const email = req.email;
		console.log(newPassword, email);
		let hashPasswordFromBcrypt = await hashUserPassword(newPassword);
		db.users.update(
			{ password: hashPasswordFromBcrypt },
			{
				where: {
					email: email,
				},
			}
		).then(() => {
            res.status(200).json({
				EM: "Bạn đã cập nhật mật khẩu thành công",
				EC: "SUCCESS_CHANGE_PASSWORD",
			});
        })
        .catch(err => {
            console.log(">>> change password",err);
        })
	};
}

module.exports = new LoginController();
