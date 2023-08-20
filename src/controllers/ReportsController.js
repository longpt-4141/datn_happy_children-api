const db = require("../models/index");
const { Op } = require("sequelize");
const { getTimeCondition } = require("../services/filterDonorData");
const io = require("../index").io;
// const {createNewCenterService} = require('../services/CRUDService')
class ReportsController {
	getAllReports = (req, res) => {
		const currentRole = req.role;
		const currentCenter = req.centerId;
		console.log(req.role, req.centerId);
		// let attributes = ['id', 'centerId', 'description', 'total_money', 'status','createdAt' ,['bar.last_modified', 'changed']];
		if (currentRole === 1) {
			db.reports
				.findAll({
					include: [
						{
							model: db.requests,
							include: [
								{
									model: db.centers,
									attributes: ["name"],
								},
							],
							attributes: ["total_money", "id", "description"],
						},
					],
					order: [["status", "ASC"]],
					attributes: {
						exclude: ["payment_file", "payment_file_url"],
					},
				})
				.then((reports) => {
					res.send(reports);
					console.log("get requests ok");
				});
		} else if (currentRole === 2) {
			console.log("vao day roi ne");
			db.reports
				.findAll({
					include: [
						{
							model: db.requests,
							where: {
								centerId: currentCenter,
							},
							attributes: [
								"total_money",
								"id",
								"description",
							] /**** b) ****/ /**** a) #1 ****/,
							// attributes: ['name', 'avatar']
						},
						{
							model: db.receipts /**** b) #2 ****/,
						},
					],
					order: [
						// ['updatedAt', 'DESC'],
						["status", "ASC"],
						["updatedAt", "DESC"],
						// tạo gần nhất thì xếp đầu
					],
					attributes: {
						exclude: ["payment_file", "payment_file_url"],
					},
				})
				.then((reports) => {
					console.log(reports);
					res.send(reports);
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	getAllReportsForGuest = async (req, res) => {
        const offset = parseInt(req.query.page);
        const time = req.query.time;
        const searchText = req.query.username

        const condition = {

            status: 1,
            updatedAt: !time || time === 'undefined' ?  {
                [Op.not]: null,
            } : getTimeCondition(time),
        }

        const centerNameCondition = {
            name : searchText ? {
                [Op.like]: `%${searchText}%`,
            }
            :
            {
                [Op.not]: null,
            }
        }

        const totalPayMoney = await db.reports.sum('total_pay_money', {
            where : condition
        })

		db.reports
			.findAndCountAll({
                offset: offset,
                limit: 10,
				where: condition,
				include: [
					{
						model: db.requests,
						include: [
							{
								model: db.centers,
								attributes: ["name", "id"],
                                where : centerNameCondition

							},
						],
						attributes: ["total_money", "id", "description", "centerId"],
					},
					{
						model: db.receipts,
					},
				],
                order: [
                    // ['updatedAt', 'DESC'],
                    ["updatedAt", "DESC"],
                    // tạo gần nhất thì xếp đầu
                ],
			})
			.then((reports) => {
				res.send(
                    {
                        ...reports,
                        totalPayMoney
                    }
                );
				console.log("get requests ok");
			})
			.catch((err) => {
				console.log("get report failed", err);
			});
	};

	getSpecificReport = (req, res) => {
		const adr = req.params.id;
		let attributes = {
			exclude: [],
		};
		console.log(adr);
		db.reports
			.findOne({
				where: {
					id: adr,
				},
				include: [
					{
						model: db.requests,
					},
					{
						model: db.receipts,
					},
				],
			})
			.then((report) => {
				res.send(report);
				console.log("get specific reports ok");
			})
			.catch((err) => {
				console.log("get specific reports", err);
			});
	};

	createNewReport = (req, res) => {
		console.log(req.body);
		const reportData = req.body.reportData;
		const centerId = req.body.reportData.centerId;
        console.log({centerId});
		const requestId = req.body.requestId;
		let receiptData = req.body.reportData.receiptData;

		db.reports
			.findOne({
				where: {
					requestId: requestId,
					[Op.or]: [
						{
							status: 0, // đang chờ
						},
						{
							status: 1, // đã đồng ý
						},
					],
				},
			})
			.then((report) => {
				if (report) {
					console.log(">>>>>>> trung roii", false);
					res.status(200).send({
						EM: "Yêu cầu này hiện đã có báo cáo đang chờ hoặc đã được xác nhận, vui lòng kiểm tra lại",
						EC: "ERR_REPORT_MUST_UNIQUE",
					});
				} else {
					db.reports
						.create({
							requestId: requestId,
							total_pay_money: reportData.total_pay_money,
							payment_file_url: reportData.payment_file_url,
							expire_at : reportData.expire_at === "" ? null : reportData.expire_at
						})
						.then((report) => {
							console.log("report ID", report.id);
							const reportId = report.id;
							receiptData = receiptData.map((item) => ({
								...item,
								reportId: reportId,
							}));
							db.receipts
								.bulkCreate(receiptData)
								.then((response) => {
									console.log(report);
									console.log("thanhf congg ");
									// tao noti cho admin
									db.admin_notifications
										.create({
											type: "report/new",
											data: JSON.stringify(report),
											centerId: centerId,
										})
										.then((noti) => {
											_io.emit("notification", noti);
											res.status(200).send({
												EM: "Tạo báo cáo thành công, Hãy kiếm tra báo cáo vừa tạo nhé",
												EC: "SUCCESS_CREATE_NEW_REPORT",
											});
										})
										.catch((err) => {
											console.log(err);
										});
								})
								.catch((err) => {
									console.log("tạo hóa đơn", err);
									res.status(200).send({
										EM: "Tạo báo cáo thất bại, hãy kiểm tra lại phần hóa đơn nhé",
										EC: "ERR_CREATE_NEW_RECEIPT",
									});
								});
							console.log(receiptData);
						})
						.catch((err) => {
							console.log("report create", err);
							res.status(200).send({
								EM: "Tạo báo cáo thất bại, hãy kiểm tra lại các phần file của báo cáo nhé",
								EC: "ERR_CREATE_NEW_REPORT",
							});
						});
				}
			});
	};

	editReport = (req, res) => {
		console.log(req.body);
		console.log(req.params);
		const adr = req.params.id;
		const reportData = req.body.reportData;
		db.reports
			.destroy({
				where: {
					id: adr,
				},
				include: {
					model: db.receipts,
				},
			})
			.then(() => {
				db.reports
					.create({
						requestId: reportData.requestId,
						total_pay_money: reportData.total_pay_money,
						payment_file_url: reportData.payment_file_url,
					})
					.then((report) => {
						console.log("report ID", report.id);
						const reportId = report.id;
						let receiptData = reportData.receiptData.map(
							(item) => ({
								...item,
								reportId: reportId,
							})
						);
						db.receipts
							.bulkCreate(receiptData)
							.then((response) => {
								console.log("data receipt", response);
								console.log("thanhf congg ");
								res.status(200).send({
									EM: "Chỉnh sửa báo cáo thành công, hãy kiểm tra lại một lần nữa nha",
									EC: "SUCCESS_EDIT_REPORT",
									DT: report,
								});
							})
							.catch((err) => {
								console.log("tạo mới hóa đơn", err);
								res.status(200).send({
									EM: "Chỉnh sửa báo cáo thất bại, hãy kiểm tra lại phần hóa đơn nhé",
									EC: "ERR_CREATE_NEW_RECEIPT",
								});
							});
						console.log(receiptData);
					})
					.catch((err) => {
						console.log("report create", err);
						res.status(200).send({
							EM: "Chỉnh sửa báo cáo thất bại, hãy kiểm tra lại phần file của báo cáo nhé",
							EC: "ERR_CREATE_NEW_REPORT",
						});
					});
			})
			.catch((err) => {
				console.log("delete luc edit", err);
			});
	};

	acceptOrRejectReport = (req, res) => {
		console.log(req.body);
		console.log("confirm money", req.params);
		const adr = req.params.id;
		const actionData = req.body.actionData;
        const centerId = req.body.centerId
		if (
			actionData.status === "rejected" &&
			actionData.note_reject !== null
		) {
			db.reports
				.update(
					{
						note_reject: actionData.note_reject,
						status: 2,
					},
					{
						where: { id: adr },
					}
				)
				.then(() => {
					db.reports
						.findOne({
							where: {
								id: adr,
							},
							attributes: ["id","status", "note_reject", "updatedAt"],
						})
						.then((report) => {
							console.log(report);

                            db.center_notifications
                            .create({
                                type: "report/rejected",
                                data: JSON.stringify(report),
                                centerId: centerId,
                            })
                            .then((noti) => {
                                console.log(noti);
                                _io.emit("center notification", noti);
                                return res.status(200).send({
                                    EC: "SUCCESS_REJECT_REPORT",
                                    EM: "Bạn đã từ chối báo cáo thành công, hãy kiểm tra lại xem sao nhé",
                                    DT: report,
                                });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
						})
						.catch((err) =>
							console.log("lay yeu cau sau tu choi", err)
						);
				})
				.catch((err) => console.log("loi tu choi", err));
		} else if (
			actionData.status === "accepted" &&
			actionData.note_reject === null
		) {
			db.reports
				.update(
					{
						status: 1,
					},
					{
						where: { id: adr },
					}
				)
				.then(() => {
					db.reports
						.findOne({
							where: {
								id: adr,
							},
							attributes: ["id","status", "updatedAt"],
						})
						.then((report) => {
							console.log(report);
                            db.center_notifications
								.create({
									type: "report/accepted",
									data: JSON.stringify(report),
									centerId: centerId,
								})
								.then((noti) => {
									console.log(noti);
									_io.emit("center notification", noti);
                                    return res.status(200).send({
                                        EC: "SUCCESS_ACCEPT_REPORT",
                                        EM: "Bạn đã duyệt báo cáo thành công, hãy kiểm tra lại xem sao nhé",
                                        DT: report,
                                    });
								})
								.catch(function (err) {
									console.log(err);
								});
						})
						.catch((err) =>
							console.log("lay yeu cau sau xet duyet", err)
						);
				})
				.catch((err) => console.log("loi xet duyet", err));
		}
	};

	deleteReport = (req, res) => {
		console.log("deleteID", req.params);
		const adr = req.params.id;
		db.reports
			.destroy({
				where: {
					id: adr,
				},
			})
			.then(() => {
				res.status(200).json({
					EM: "Bạn đã xóa thành công, vui lòng tải lại trang để kiểm tra", //err message
					EC: "DELETE_REPORT_SUCCESS", //err code
				});
			})
			.catch((err) => console.log(">>>> xoa loi roiii", err));
	};
}

module.exports = new ReportsController();
