let userSubhandlers = require('./Subhandlers/users')
let tokenSubhandlers = require('./Subhandlers/tokens')
let checkSubhandlers = require('./Subhandlers/checks')
let _data = require('./data')
let handler = {}
let subHandler = {
    users :userSubhandlers,
    token:tokenSubhandlers,
    checks:checkSubhandlers
}

handler.ping = function(data,responseManager){
   _data.get("test","responses",function(err,data){
      if(err){
         responseManager(400,{"message":err})
      }else{
         responseManager(200,{"message":data})
      }
   })
   
}


handler.users = function(data,responseManager){
    let allowedMethods = ["post","get","put","delete"]
    if(allowedMethods.indexOf(data.method)>-1){
        subHandler.users[data.method](data,responseManager)
    }else{
        responseManager(405,{"message":"method not found"})
    }
}


handler.token = function(data,responseManager){
    let allowedMethods = ["post","get","delete"]
    if(allowedMethods.indexOf(data.method)>-1){
        subHandler.token[data.method](data,responseManager)
    }else{
        responseManager(405,{"message":"method not found"})
    }
}


handler.checks = function(data,responseManager){
    let allowedMethods = ["post"]
    if(allowedMethods.indexOf(data.method)>-1){
        subHandler.checks[data.method](data,responseManager)
    }else{
        responseManager(405,{"message":"method not found"})
    }
}




handler.notFound = function(data,responseManager){
   responseManager(404) 
}


module.exports = handler;