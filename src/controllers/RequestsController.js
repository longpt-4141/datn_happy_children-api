const db = require("../models/index");
const { Op } = require("sequelize");
const io = require("../index").io;
// const {createNewCenterService} = require('../services/CRUDService')
class RequestsController {
	getAllRequests = (req, res) => {
		const currentRole = req.role;
		console.log(req.role, req.centerId);
		// let attributes = ['id', 'centerId', 'description', 'total_money', 'status','createdAt' ,['bar.last_modified', 'changed']];
		if (currentRole === 1) {
			db.requests
				.findAll({
					include: [
						{
							model: db.centers,
						},
						{
							model: db.reports,
							attributes: ["status"],
							require: false,
						},
					],
					order: [
						// ['updatedAt', 'DESC'],
						["status", "ASC"],
						["updatedAt", "DESC"],
						// tạo gần nhất thì xếp đầu
					],
					attributes: {
						exclude: ["estimated_budget_file"],
					},
				})
				.then((requests) => {
					res.send(requests);
					console.log("get requests ok");
				});
		} else if (currentRole === 2) {
			console.log("vao day roi ne");
			db.requests
				.findAll({
					where: {
						centerId: req.centerId,
					},
					include: [
						{
							model: db.centers,
						},
						{
							model: db.reports,
							attributes: ["status", "id"],
							require: false,
						},
					],
					order: [
						// ['updatedAt', 'DESC'],
						["status", "ASC"],
						["updatedAt", "DESC"],
						// tạo gần nhất thì xếp đầu
					],
					attributes: {
						exclude: ["estimated_budget_file"],
					},
				})
				.then((requests) => {
					res.send(requests);
					console.log("get requests ok");
				});
		}
	};

	getSpecificRequest = (req, res) => {
		const adr = req.params.id;
		let attributes = {
			exclude: [],
		};
		console.log(adr);
		db.requests
			.findOne({
				where: {
					id: adr,
				},
				include: {
					model: db.centers,
				},
			})
			.then((request) => {
				res.send(request);
				console.log("get requests ok", request);
			});
	};

	createNewRequest = (req, res) => {
		console.log(req.body.centerData);
		const requestData = req.body.centerData;
		db.requests
			.create({
				centerId: requestData.centerId,
				type_request: requestData.type_request,
				description: requestData.description,
				total_money: requestData.total_money,
				estimated_budget_url: requestData.estimated_budget_url,
			})
			.then((request) => {
				console.log(">>> new Request", request);
				db.admin_notifications
					.create({
						type: "request/new",
						data: JSON.stringify(request),
						centerId: request.centerId,
					})
					.then((noti) => {
						_io.emit("notification", noti);
						res.status(200).send({
							EM: "Tạo yêu cầu thành công, Hãy kiếm tra request vừa tạo nhé",
							EC: "SUCCESS_CREATE_NEW_REQUEST",
						});
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log("error", err);
				res.status(500).send({
					EM: "Tạo yêu cầu thất bại, vui lòng chờ trong giây lát và thử lại",
					EC: "ERR_CREATE_REQUEST_FAIL",
				});
			});
	};

	editRequest = (req, res) => {
		console.log(req.body);
		console.log(req.params);
		const adr = req.params.id;
		const agreeNoteData = req.body.requestStatus;
		const centerId = req.body.centerId;
		if (agreeNoteData && agreeNoteData.status === 1) {
			db.requests
				.update(
					{
						status: agreeNoteData.status,
						note_agree: agreeNoteData.text,
						money_transfer_confirm: 0,
					},
					{
						where: {
							id: adr,
						},
					}
				)
				.then(() => {
					db.requests
						.findOne({
							where: {
								id: adr,
							},
							attributes: [
								"id",
								"status",
								"note_agree",
								"updatedAt",
							],
						})
						.then((request) => {
							db.center_notifications
								.create({
									type: "request/accepted",
									data: JSON.stringify(request),
									centerId: centerId,
								})
								.then((noti) => {
									console.log(request);
									_io.emit("center notification", noti);
									return res.status(200).send({
										EC: "SUCCESS_UPDATE_STATUS",
										EM: "Bạn đã xác nhận yêu cầu thành công, hãy kiểm tra lại xem sao nhé",
										DT: request,
									});
								})
								.catch(function (err) {
									console.log(err);
								});
						})
						.catch((err) => {
							console.log(">>> loi tim request moi tao", err);
						});
				})
				.catch((err) => {
					console.log(">>> loi sua request", err);
				});
		} else if (agreeNoteData && agreeNoteData.status === 2) {
			db.requests
				.update(
					{
						status: agreeNoteData.status,
						note_reject: agreeNoteData.text,
						money_transfer_confirm: -1,
					},
					{
						where: {
							id: adr,
						},
					}
				)
				.then(() => {
					db.requests
						.findOne({
							where: {
								id: adr,
							},
							attributes: [
								"id",
								"status",
								"note_reject",
								"updatedAt",
							],
						})
						.then((request) => {
							db.center_notifications
								.create({
									type: "request/rejected",
									data: JSON.stringify(request),
									centerId: centerId,
								})
								.then((noti) => {
									console.log(request);
									_io.emit("center notification", noti);
									return res.status(200).send({
										EC: "SUCCESS_UPDATE_STATUS",
										EM: "Bạn đã từ chối yêu cầu thành công, hãy kiểm tra lại xem sao nhé",
										DT: request,
									});
								});
						});
				});
		}
	};

	editMoneyTransferConfirmation = (req, res) => {
		console.log(req.body);
		console.log("confirm money", req.params);
		const adr = req.params.id;
		const centerId = req.body.centerId;
		const currentStatus = req.body.requestStatus.status;
		if (currentStatus === 1) {
			db.requests
				.update(
					{
						money_transfer_confirm: 1,
					},
					{
						where: {
							id: adr,
						},
					}
				)
				.then(() => {
					db.requests
						.findOne({
							where: {
								id: adr,
							},
							attributes: [
								"id",
								"money_transfer_confirm",
								"updatedAt",
								"total_money",
							],
						})
						.then((request) => {
							console.log(request);

							db.admin_notifications
								.create({
									type: "request/moneyConfirmed",
									data: JSON.stringify(request),
									centerId: centerId,
								})
								.then((noti) => {
									_io.emit("notification", noti);
									return res.status(200).send({
										EC: "SUCCESS_UPDATE_MONEY_CONFIRM",
										EM: "Bạn đã xác nhận chuyển tiền thành công, hãy kiểm tra lại xem sao nhé",
										DT: request,
									});
								})
								.catch((err) => {
									console.log(err);
								});
						});
				});
		}
	};

	deleteRequest = (req, res) => {
		console.log("deleteID", req.params);
		const adr = req.params.id;
		db.requests
			.destroy({
				where: {
					id: adr,
				},
			})
			.then(() => {
				res.status(200).json({
					EM: "Bạn đã xóa thành công, vui lòng tải lại trang để kiểm tra", //err message
					EC: "DELETE_REQUEST_SUCCESS", //err code
				});
			})
			.catch((err) => console.log(">>>> xoa loi roiii", err));
	};
}

module.exports = new RequestsController();
