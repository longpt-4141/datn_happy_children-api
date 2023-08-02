const db = require("../models/index");
const { Op, where } = require("sequelize");
const { getMonthDateRange } = require("../utils/getStartEndDate");
const {getTimeCondition} = require("../services/filterDonorData")
const {
	getChartDataPerMonth,
	getFundChartDataPerMonth,
} = require("../services/getChartDataService");
// const io = require('../index').io;
// const {createNewCenterService} = require('../services/CRUDService')
class TransactionController {
	sendTransaction = (req, res) => {
		console.log(req.body);
		let transaction = req.body;
		db.transactions
			.create(transaction)
			.then(() => {
				console.log("add transaction successfully");
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_CREATE_NEW_TRANSACTION",
				});
			})
			.catch((err) => {
				console.log("add transaction failed", err);
			});
	};

	getAllNormalTransactions = (req, res) => {
		// console.log(req.body)
		db.transactions
			.findAll({
				where: {
					fundId: null,
				},
				order: [
					// ['updatedAt', 'DESC'],
					["status", "ASC"],
					["updatedAt", "DESC"],
					// tạo gần nhất thì xếp đầu
				],
			})
			.then((transactions) => {
				console.log(">>> get normal transaction success");
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_GET_NORMAL_TRANSACTION",
					DT: transactions,
				});
			})
			.catch((err) => {
				console.log(">>> get normal transaction failed", err);
			});
	};

	getAllFundTransactions = (req, res) => {
		// console.log(req.body)
		db.transactions
			.findAll({
				where: {
					fundId: {
						[Op.not]: null,
					},
				},
				order: [
					// ['updatedAt', 'DESC'],
					["status", "ASC"],
					["updatedAt", "DESC"],
					// tạo gần nhất thì xếp đầu
				],
				include: [
					{
						model: db.funds,
						// attributes: ['name', 'id','description']    /**** b) ****/       /**** a) #1 ****/
						// attributes: ['name', 'avatar']
					},
				],
			})
			.then((transactions) => {
				console.log(">>> get fund transaction success", transactions);
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_GET_NORMAL_TRANSACTION",
					DT: transactions,
				});
			})
			.catch((err) => {
				console.log(">>> get fund transaction failed", err);
			});
	};

	getAllTransactionsForGuest = async (req, res) => {
		console.log(">>> query", req.query);
		const offset = parseInt(req.query.page);
        const time = req.query.time;
        const searchText = req.query.username

        const condition = {
            status: 1,
            fundId: null,
            createdAt: !time || time === 'undefined' ?  {
                [Op.not]: null,
            } : getTimeCondition(time),
            username : searchText ? {
                [Op.like]: `%${searchText}%`,
            }
            :
            {
                [Op.not]: null, 
            }
        }

        const totalMoney = await db.transactions.sum('exact_amount', {
            where : condition
        })

		//normal transaction
		db.transactions
			.findAndCountAll({
				offset: offset,
				limit: 10,
				where: condition ,
				order: [
					// ['updatedAt', 'DESC'],
					["updatedAt", "DESC"],
					// tạo gần nhất thì xếp đầu
				],
			})
			.then((transactions) => {
				console.log(">>> get normal transaction success");
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_GET_NORMAL_TRANSACTION",
					DT: {
                        ...transactions,
                        total_money : totalMoney
                    },
				});
			})
			.catch((err) => {
				console.log(">>> get normal transaction failed", err);
			});
	};

	getAllFundTransactionsForGuest = async (req, res) => {
		console.log(">>> query", req.query);
		const offset = parseInt(req.query.page);
        const time = req.query.time;
        const searchText = req.query.username
		//fund transaction
        const condition = {
            status: 1,
            fundId: {
                [Op.not]: null,
            },
            createdAt: !time || time === 'undefined' ?  {
                [Op.not]: null,
            } : getTimeCondition(time),
            username : searchText ? {
                [Op.like]: `%${searchText}%`,
            }
            :
            {
                [Op.not]: null, 
            }
        }

        const totalMoney = await db.transactions.sum('exact_amount', {
            where : condition
        })

		db.transactions
			.findAndCountAll({
				offset: offset,
				limit: 10,
				where: condition,

				order: [
					// ['updatedAt', 'DESC'],
					["updatedAt", "DESC"],
					// tạo gần nhất thì xếp đầu
				],
				include: [
					{
						model: db.funds,
						// attributes: ['name', 'id','description']    /**** b) ****/       /**** a) #1 ****/
						// attributes: ['name', 'avatar']
					},
				],
			})
			.then((transactions) => {
				console.log(">>> get normal transaction success");
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_GET_NORMAL_TRANSACTION",
                    DT: {
                        ...transactions,
                        total_money : totalMoney
                    },
				});
			})
			.catch((err) => {
				console.log(">>> get normal transaction failed", err);
			});
	};

	confirmDonation = (req, res) => {
		console.log("confirm", req.body);
		const confirm_data = req.body;
		db.transactions
			.update(
				{
					status: 1,
					exact_amount: confirm_data.exact_amount,
				},
				{
					where: {
						id: confirm_data.transactionID,
					},
				}
			)
			.then(() => {
				console.log(
					">>> edit transaction success",
					confirm_data.transactionID
				);
				db.transactions
					.findOne({
						where: {
							id: confirm_data.transactionID,
						},
					})
					.then((transaction) => {
						if (confirm_data.type === "donate/fund") {
							db.funds.findOne(
								{ where: { id: transaction.fundId } }
							).then((fund) => {
                                db.funds.update(
                                    {
                                        received_amount : fund.received_amount === null ? parseInt(transaction.exact_amount) : fund.received_amount + parseInt(transaction.exact_amount) 
                                    },
                                    { where: { id: transaction.fundId } }
                                )
                                .then(() => {
                                    res.status(200).send({
                                        EM: "Xác nhận giao dịch thành công!",
                                        EC: "SUCCESS_CONFIRM_TRANSACTION",
                                        DT: transaction,
                                        type: confirm_data.type,
                                    });
                                })
                            })
                            
						}
                        else {
                            res.status(200).send({
                                EM: "Xác nhận giao dịch thành công!",
                                EC: "SUCCESS_CONFIRM_TRANSACTION",
                                DT: transaction,
                                type: confirm_data.type,
                            });
                        }
					})
					.catch((err) => {
						console.log(">>> get after edit failed", err);
					});
			})
			.catch((err) => {
				console.log(">>> edit failed", err);
			});
	};

	rejectDonation = (req, res) => {
		console.log("reject", req.body);
		const reject_data = req.body;
		db.transactions
			.update(
				{
					status: 2,
					note_reject: reject_data.note_reject,
				},
				{
					where: {
						id: reject_data.transactionID,
					},
				}
			)
			.then(() => {
				console.log(
					">>> edit transaction success",
					reject_data.transactionID
				);
				db.transactions
					.findOne({
						where: {
							id: reject_data.transactionID,
						},
					})
					.then((transaction) => {
						res.status(200).send({
							EM: "Xác nhận từ chối giao dịch thành công!",
							EC: "SUCCESS_REJECT_TRANSACTION",
							DT: transaction,
							type: reject_data.type,
						});
					})
					.catch((err) => {
						console.log(">>> get after edit failed", err);
					});
			})
			.catch((err) => {
				console.log(">>> edit failed", err);
			});
	};

	getChartData = async (req, res) => {
		console.log(req.query);
		const condition = req.query.per;
		const normalChartData = await getChartDataPerMonth();
		const fundChartData = await getFundChartDataPerMonth();
		console.log(">>>", {
			normalChartData: normalChartData,
			fundChartData: fundChartData,
		});
		res.status(200).send({
			normalChartData: normalChartData,
			fundChartData: fundChartData,
		});
	};

	getAllFunds = async (req, res) => {
		db.funds
			.findAll()
			.then((fund) => {
				res.status(200).send(fund);
			})
			.catch((err) => {
				console.log(">>> get all funds failed", err);
			});
	};

	/* Item donation */
	makeItemDonation = (req, res) => {
		console.log(req.body);
		const itemsData = req.body;
		db.item_transactions
			.create(itemsData)
			.then((transaction) => {
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_CREATE_NEW_TRANSACTION",
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};
	/* Items  transaction */
	getAllItemTransactionsForAdmin = (req, res) => {
		db.item_transactions
			.findAll({
				order: [
					// ['updatedAt', 'DESC'],
					["status", "ASC"],
					["updatedAt", "DESC"],
					// tạo gần nhất thì xếp đầu
				],
				include: [
					{
						model: db.funds,
						// attributes: ['name', 'id','description']    /**** b) ****/       /**** a) #1 ****/
						// attributes: ['name', 'avatar']
					},
				],
			})
			.then((transactions) => {
				console.log(">>> get fund transaction success", transactions);
				res.status(200).send({
					EM: "Giao dịch thành công, cảm ơn tấm lòng của bạn. Bạn hãy kiểm tra mail để xác nhận nhé!",
					EC: "SUCCESS_GET_NORMAL_TRANSACTION",
					DT: transactions,
				});
			})
			.catch((err) => {
				console.log(">>> get fund transaction failed", err);
			});
	};

	confirmItemDonation = (req, res) => {
		console.log("confirm", req.body);
		const confirm_data = req.body;
		db.item_transactions
			.update(
				{
					status: 1,
				},
				{
					where: {
						id: confirm_data.transactionID,
					},
				}
			)
			.then(() => {
				console.log(
					">>> edit transaction success",
					confirm_data.transactionID
				);
				db.item_transactions
					.findOne({
						where: {
							id: confirm_data.transactionID,
						},
					})
					.then((transaction) => {
						res.status(200).send({
							EM: "Xác nhận giao dịch thành công!",
							EC: "SUCCESS_CONFIRM_TRANSACTION",
							DT: transaction,
						});
					})
					.catch((err) => {
						console.log(
							">>> get item_donate after edit failed",
							err
						);
					});
			})
			.catch((err) => {
				console.log(">>> edit item donate failed", err);
			});
	};

	rejectItemDonation = (req, res) => {
		console.log("reject", req.body);
		const reject_data = req.body;
		db.item_transactions
			.update(
				{
					status: 2,
					note_reject: reject_data.note_reject,
				},
				{
					where: {
						id: reject_data.transactionID,
					},
				}
			)
			.then(() => {
				console.log(
					">>> edit transaction success",
					reject_data.transactionID
				);
				db.item_transactions
					.findOne({
						where: {
							id: reject_data.transactionID,
						},
					})
					.then((transaction) => {
						res.status(200).send({
							EM: "Xác nhận giao dịch thành công!",
							EC: "SUCCESS_REJECT_TRANSACTION",
							DT: transaction,
						});
					})
					.catch((err) => {
						console.log(
							">>> get item_donate after edit failed",
							err
						);
					});
			})
			.catch((err) => {
				console.log(">>> edit item donate failed", err);
			});
	};

	/* money */
	getAllNormalMoney = async (req, res) => {
		const normalReceivedMoney = await db.transactions.sum("exact_amount", {
			where: {
				fundId: {
					[Op.eq]: null,
				},
				status: {
					[Op.eq]: 1,
				},
			},
		});

		const normalSpendMoney = await db.requests.sum("total_money", {
			where: {
				money_transfer_confirm: {
					[Op.eq]: 1,
				},
			},
		});

        if (!normalReceivedMoney) {
            normalReceivedMoney = 0;
        } else if (!normalSpendMoney) {
            normalSpendMoney = 0;
        }
        const normalMoney = normalReceivedMoney - normalSpendMoney;
        res.status(200).json(normalMoney);
	};

    	/* received money */
	getAllReportNormalMoney = async (req, res) => {
		let normalReceivedMoney = await db.transactions.sum("exact_amount", {
			where: {
				fundId: {
					[Op.eq]: null,
				},
				status: {
					[Op.eq]: 1,
				},
			},
		});

		let normalSpendMoney = await db.requests.sum("total_money", {
			where: {
				money_transfer_confirm: {
					[Op.eq]: 1,
				},
			},
		});
        if (!normalReceivedMoney || !normalSpendMoney) {
            normalReceivedMoney = 0;
            normalSpendMoney = 0;
        }
        const normalMoney = normalReceivedMoney - normalSpendMoney;
        res.status(200).json(normalMoney);
	};
}

module.exports = new TransactionController();
