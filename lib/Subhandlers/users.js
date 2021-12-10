var lib = require("../data");
var crypto = require('crypto');
var users ={ 
    get: function(data,responseManager){
        responseManager(200,{"message":"get"})
},
    post :function(data,responseManager){
        if(data.payload.email != "" && data.payload.password != ""){
            var payloadAsJson = JSON.parse(data.payload);
            var email = payloadAsJson.email;
            var password = payloadAsJson.password;
            var hash = crypto.createHmac('sha256',"secretHere").update(password).digest('hex');
                    if(password.length > 7){
                        lib.create("users",email,{email:email.toLowerCase(),password:hash},function(res){
                            if(!res){
                                responseManager(200,{"message":"user created"})
                                return
                            }else{
                                responseManager(500,{"message":"Internal error: "+res})
                                return
                            }
                        })
                    }else{
                        responseManager(400,{"message":"password not long enough"})
                        return
                    }
                
                      
        }else{
            responseManager(400,{"message":"invalid login details"})
            return
        }
        
},
    put : function(data,responseManager){
        responseManager(200,{"message":"put"})
},
    delete :function(data,responseManager){
        responseManager(200,{"message":"delete"})
}
} 


module.exports = users