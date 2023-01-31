const db = require('../models/index');
const CRUDService = require('../services/CRUDService')
const jsonwebtoken = require('jsonwebtoken')
class RegisterController {
    register = async (req, res, next) => {
       try{
        const formData = req.body;
        console.log(formData);
        // console.log(new Date()+7)
        const user = await CRUDService.createNewUser(formData)

        const jsontoken = jsonwebtoken.sign({user: user}, process.env.SECRET_KEY, { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
        res.json({token: jsontoken});
       } 
       catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
    }
 }

module.exports = new RegisterController