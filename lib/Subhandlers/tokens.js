var lib = require("../data");
var crypto = require('crypto');


var token = { 
    get: function(data,responseManager){
        responseManager(200,{"message":"get"})
},
    post :function(data,responseManager){
        if(data.payload.email != "" && data.payload.password != ""){
            var payloadAsJson = JSON.parse(data.payload);
            var email = payloadAsJson.email;
            var password = payloadAsJson.password;
            var hash = crypto.createHmac('sha256',"secretHere").update(password).digest('hex');
                        lib.get("users",email,function(status,data){
                            if(!status){
                                const user = JSON.parse(data)
                                console.log(user.password)
                                if(hash == user.password){
                                    const token = createToken()
                                    const tokenDurationInMinutes=20
                                    const tokenObj={
                                        email:user.email,
                                        token:token,
                                        expiringDate:Date.now()+(1000*60*tokenDurationInMinutes) 
                                    }
                                    lib.create("tokens",token,tokenObj,function(status,data){
                                        if(!status){
                                            responseManager(200,{"message":"Token returned","data":tokenObj})
                                        }else{
                                            responseManager(500,{"message":"Internal server error"})
                                        }
                                        
                                    })
                                }else{
                                    responseManager(401,{"message":"Invalid login"})
                                }
                                return
                            }else{
                                responseManager(500,{"message":"Internal error: "+res})
                                return
                            }
                        })
                
        }else{
            responseManager(400,{"message":"invalid login details"})
            return
        }
        
},
    delete :function(data,responseManager){
        responseManager(200,{"message":"delete"})
}
} 


function createToken(){
    const max=9999999999;
    const min=1000000000; 
        return Math.floor(
          Math.random() * (max - min + 1) + min
        )
      
}
module.exports = token