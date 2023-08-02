const db = require('../models/index');
const { Op } = require("sequelize");
const io = require('../index').io;
// const {createNewCenterService} = require('../services/CRUDService')
class TopicController {
    getAllTopics = (req, res) => {
        db.topics.findAll({
            order: [
                ['updatedAt', 'DESC']
                // tạo gần nhất thì xếp đầu
            ],
        })
            .then((topics) => {
                console.log(">>> get all topics success: " , topics)
                res.status(200).send(topics)
            })
            .catch((err) => {
                console.log(">>> get all topics failed: " , err)
            })
    }

    getSpecificTopic =  (req, res) => {
        console.log("get specific topics: " , req.params)
        const topicId = req.params.id;
        db.topics.findOne({
            where : {
                id : topicId
            }
        })
        .then((topic) => {
            console.log("get specific topics success: " , topic)
            res.status(200).send(topic)
        })
        .catch((err) => {
            console.log("get specific topics failed: " , err)
        })
    }

    createNewTopic = (req, res) => {
        console.log(">>> get topic data", req.body);
        const topicData = req.body
        db.topics.create(topicData)
            .then((createdTopic) => {
                console.log(">>> create new topic data", createdTopic)
                res.status(200).send({
                    EM: 'Tạo chủ đề thành công, hãy kiểm tra lại kết quả nhé',
                    EC: 'SUCCESS_CREATE_NEW_TOPIC',
                    DT : createdTopic
                })
            })
            .catch(err => {
                console.log(">>> ERROR create new topic data ", err)
            })
    }

    editTopic = (req, res) => {
        console.log(">>> edit topic", req.body, req.params)
        const topicData = req.body;
        const adr = req.params.id
        db.topics.update(
            {
                ...topicData
            },
            {
                where : {
                    id : adr
                }
            }
        )
        .then(() => {
            console.log(">>> update topic success")
            res.status(200).send({
                EM: 'Cập nhật quỹ thành công!',
                EC: 'SUCCESS_EDIT_TOPIC',
            })
        })
        .catch(err => {
            console.log(">>> ERROR update",err)
        })
    }

    deleteTopic = (req, res) => {
        console.log("deleteTopic",req.params)
        const adr = req.params.id
        db.topics.destroy({
            where : {
                id : adr
            }
        })
        .then(() => {
            res.status(200).send({
                EM: 'Xác nhận xóa quỹ thành công!',
                EC: 'SUCCESS_DELETE_TOPIC',
            })
        })
        .catch((err) => {
            console.log("deleteTopic error", err)
        })
    }
}


module.exports = new TopicController