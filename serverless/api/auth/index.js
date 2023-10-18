const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const isAuthenticated = (req,res,next) =>{
    const token = req.headers.autorization
    if (!token){
        return res.sendStatus(403)
    }
    jwt.verify(token,'mi-secreto',(err,decoded)=>{
        const {_id} = decoded
        Users.findOne({_id}).exec()
            .then(user => {
                req.user = user
                next()
            })
    })

}

const hasRole = role => (req,res,next) =>{// rol para uno
    if(req.user.role = role){
        return next()
    }
    res.sendStatus(403)
}
const hasRoles = roles => (req,res,next) =>{// rol para varios
    if(roles.indexOf(req.user.role)> -1){
        return next()
    }
    res.sendStatus(403)
}

module.exports ={
    isAuthenticated,
    hasRole,
    hasRoles,
}



// handler se encarga de manejar los mid -> const handler = 
