const db = require('../models/index');
const { Op } = require("sequelize");
var slug = require('slug')
// const {createNewCenterService} = require('../services/CRUDService')
class NewsController {

    getAllTopicAndFunds = (req, res) => {
        db.topics.findAll({
            where: {
                isSuggest: 0
            }
        })
        .then((topics) => {
            console.log(topics)
            db.funds.findAll()
                .then((funds) => {
                    console.log(funds)
                    res.send({
                        topics : topics,
                        funds : funds
                    })
                })
                .catch((err) => {
                    console.log('get funds', err)
                })
        })
        .catch((err) => {
            console.log('get topics', err)
        })
    }

    createNewArticle = (req, res) => {
        console.log(req.body)
        const articleRawData = req.body.articleData;
        if(typeof(articleRawData.topicId) === 'object') {
            db.topics.create({
                name : articleRawData.topicId.name,
                isSuggest : 1
            })
            .then((topic) => {
                console.log('topic just added', topic)
                db.news.create({
                    ...articleRawData,
                    topicId : topic.id,
                    slug: slug(articleRawData.title),
                    fundId : articleRawData.fundId === 'none' ? null : articleRawData.fundId
                })
                .then(() => {
                    res.status(200).send({
                        EM: 'Tạo bài viết thành công, hãy kiểm tra lại kết quả nhé',
                        EC: 'SUCCESS_CREATE_NEW_ARTICLE'
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log('create topic', err)
            })
        } 
    else {
        db.news.create({
            ...articleRawData,
            slug: slug(articleRawData.title),
            fundId : articleRawData.fundId === 'none' ? null : articleRawData.fundId
        })
        .then(() => {
            res.status(200).send({
                EM: 'Tạo bài viết thành công, hãy kiểm tra lại kết quả nhé',
                EC: 'SUCCESS_CREATE_NEW_ARTICLE'
            })
        }
        )
        .catch((err) => {
            console.log(err)
        })
    }
}

updateArticle = (req, res) => {
    console.log(req.body)
    const articleRawData = req.body.editedData;
    const adr = req.params.id
    if(typeof(articleRawData.topicId) === 'object') {
        db.topics.update({
            name : articleRawData.topicId.name,
            isSuggest : 1
        },
        {where : {
            id : articleRawData.topic.id
        }}
        )
        .then((topic) => {
            console.log('topic just added', topic)
            db.news.update({
                ...articleRawData,
                topicId : topic.id,
                slug: slug(articleRawData.title),
                fundId : articleRawData.fundId === 'none' ? null : articleRawData.fundId
            },
            {
                where : {
                    id : adr
                }
            }
            )
            .then(() => {
                res.status(200).send({
                    EM: 'Chỉnh sửa bài viết thành công, hãy kiểm tra lại kết quả nhé',
                    EC: 'SUCCESS_EDIT_ARTICLE'
                })
            })
            .catch((err) => {
                console.log(err)
            })
        })
        .catch((err) => {
            console.log('create topic', err)
        })
    } 
    else {
        db.news.update({
            ...articleRawData,
            slug: slug(articleRawData.title),
            fundId : articleRawData.fundId === 'none' ? null : articleRawData.fundId
        }, {
            where : {
                id : adr
            }
        })
        .then(() => {
            res.status(200).send({
                EM: 'Chỉnh sửa bài viết thành công, hãy kiểm tra lại kết quả nhé',
                EC: 'SUCCESS_EDIT_ARTICLE'
            })
        }
        )
        .catch((err) => {
            console.log(err)
        })
    }
}

    getAllArticles = (req, res) => {
        console.log(req.query)
        const paramsValue = req.query;
        let condition = Object.keys(paramsValue).length > 0 ? {
            [Op.or]: [
                {
                    title: { [Op.like]: `%${paramsValue.param}%` }
                }
            ]
        } : null;
        db.news.findAll({
            where : condition,
            include: [
                {
                    model : db.topics,
                },
                {
                    model : db.funds
                }
            ],
            order: [
                // ['updatedAt', 'DESC'],
                ['status', 'ASC'],
                ['updatedAt', 'DESC']
                // tạo gần nhất thì xếp đầu
            ],
        })
        .then((articles) => {
            // console.log(articles)
            res.send(articles)
        })
        .catch((err) => {
            console.log(err)
        })
    }

    getSpecificArticle = (req, res) => {
        console.log(req.params)
        const adr = req.params.id
        db.news.findOne({
            where : {id: adr},
            include : [
                {
                    model : db.topics,
                },
                {
                    model: db.funds
                }
            ]
        },
        )
        .then((article) => {
            res.send(article)
        })
        .catch((err) => {
            console.log('getSpecificArticle', err)
        })
    }

    confirmArticle = (req, res) => {
        console.log('>>> bodt', req.body)
        console.log('>>> bodtdsasd', req.params)
        const topicId = req.body.topicId;
        const adr = req.params.id;
        db.news.update({
            status : 1
        },
        {
            where : {
                id : adr
            }
        })
        .then(() => {
            db.topics.update({
                isSuggest : 0
            },
            {
                where : {
                    id : topicId
                }
            })
            .then(() => {
                res.status(200).send({
                    EM: 'Duyệt bài viết thành công, hãy kiểm tra lại kết quả nhé',
                    EC: 'SUCCESS_CONFIRM_ARTICLE'
                })
            })
            .catch(err => {
                console.log('confirm topic suggest', err)
            })
        })
        .catch(err => {
            console.log('confirm article', err)
        })
    }

    deleteArticle = (req, res) => {
        console.log('>>> bodt', req.body)
        console.log('>>> bodtdsasd', req.params)
        const adr = req.params.id;
        db.news.findOne({
            where: {id: adr},
            include : {
                model : db.topics
            }
        })
        .then((article) => {
            if(article) {
                console.log({article});
                if(article.topic.isSuggest === 1) {
                    db.topics.destroy({where : {id : article.topicId}})
                    .then(() => {
                        db.news.destroy({where : {id : adr}})
                        .then(() => {
                            res.status(200).send({
                                EM: 'Xóa bài viết thành công, hãy kiểm tra lại kết quả nhé',
                                EC: 'SUCCESS_DELETE_ARTICLE'
                            })
                        })
                    })
                }
                else {
                    db.news.destroy({where : {id : adr}})
                        .then(() => {
                            res.status(200).send({
                                EM: 'Xóa bài viết thành công, hãy kiểm tra lại kết quả nhé',
                                EC: 'SUCCESS_DELETE_ARTICLE'
                            })
                        })
                }
            }
        })
    }
}


module.exports = new NewsController