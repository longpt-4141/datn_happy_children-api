const db = require("../models/index");
// const CRUDService = require("./CRUDService");
const {checkCenterEmailExist, checkPhoneNumberExist, createNewUser} = require("./CRUDService")
const checkEmailExist = async (userEmail) => {
	let user = await db.users.findOne({
		where: { email: userEmail },
	});
	if (user) {
		return true;
	}
	return false;
};

const registerNewUser = async (
	rawUserData,
	center_email,
	center_phone_number
) => {
	let isEmailExist = await checkCenterEmailExist(
		center_email
	).catch((err) => console.log("Loi check email", err));
	let isPhoneNumberExist = await checkPhoneNumberExist(
		center_phone_number
	).catch((err) => console.log("Loi checkphone", err));
	if (isEmailExist === true) {
		return {
			EM: "Email đã tồn tại, vui lòng thử email khác!",
			EC: "ERR_CENTER_EMAIL_EXISTED",
		};
	} else if (isPhoneNumberExist === true) {
		return {
			EM: "Số điện thoại đã tồn tại, vui lòng kiểm tra lại!",
			EC: "ERR_CENTER_PHONE_EXISTED",
		};
	} else {
		let data = await createNewUser(rawUserData);
		return {
			EM: data.EM,
			EC: data.EC,
			DT: data.DT,
		};
	}
};

module.exports = {
	registerNewUser,
	checkEmailExist,
};
