const moment = require('moment');
const db = require('../models/index');
const { where } = require('sequelize');
class NotificationsController {

    getAllNotifications = (req, res, next) => {
        console.log('>>>> get role for notification', req.body)
        const currentRole = req.body.roleId;
        const offset  = req.body.offset
        if (currentRole === 1) {
            db.admin_notifications.findAndCountAll({
                offset: offset, 
                limit: 10,
                include : {
                    model : db.centers,
                    attributes : ['name']
                },
                order: [   
                    ['createdAt', 'DESC']
                ],
                // raw: true
            },
            )
            .then((notifications) => {
                res.send(notifications)
            })
        } else if (currentRole === 2) {
            db.center_notifications.findAndCountAll({
                offset: offset, 
                limit: 10,
                // include : {
                //     model : db.centers,
                //     attributes : ['name']
                // },
                order: [
                    ['createdAt', 'DESC']
                ],
            },
            )
            .then((notifications) => {
                console.log(notifications)
                res.send(notifications)
            })
        }
    }

    readNotification = (req, res) => {
        const adr = req.params.id;
        console.log(req.body)
        const currentTime = moment(new Date()).format('YYYY-MM-DD HH:mm');
        const currentRole = req.body.currentRole
        if (currentRole === 1) {
            db.admin_notifications.update({
                read_at : currentTime
            },
           {
            where : {
                id : adr
            }
           }
            )
            .then(() => {
                return db.admin_notifications.findOne({
                    where : { 
                        id : adr
                    },
                    include : {
                        model : db.centers,
                        attributes : ['name']
                    },
                })
            })
            .then((notification) => {
                
                console.log(notification)
                res.send(notification)
            })
            .catch((error) => {
                console.log('update read noti', error)
            })
        } else if (currentRole === 2) {
            db.center_notifications.update({
                read_at : currentTime
            },
           {
            where : {
                id : adr
            }
           }
            )
            .then(() => {
                return db.center_notifications.findOne({
                    where : { 
                        id : adr
                    },
                })
            })
            .then((notification) => {
                console.log({notification})
                res.send(notification)
            })
            .catch((error) => {
                console.log('update read noti', error)
            })
        }
    }
 }

module.exports = new NotificationsController