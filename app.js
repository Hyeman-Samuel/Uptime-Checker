var http = require("http")
var https =  require("https")
 var url = require("url")
 var stringDecoder = require("string_decoder").StringDecoder
var fs = require("fs")
var handler = require("./lib/handlers")
var httpsOptions = {
   "key":fs.readFileSync("./https/key.pem"),
   "cert":fs.readFileSync("./https/cert.pem")
}


var httpsServer = https.createServer(function(req,res){
         unifiedServer(req,res)
})

httpsServer.listen(4000,function(){
   console.log("listening on https port ")
})



var httpServer = http.createServer(function(req,res){
         unifiedServer(req,res)
})

httpServer.listen(3000,function(){
    console.log("listening on http")
})








var router = {
   "/ping":handler.ping,
   "/users":handler.users,
   "/token":handler.token
}

function unifiedServer(req,res){
   var parsedUrl = url.parse(req.url,true)

   var path = parsedUrl.pathname
   var method = req.method.toLowerCase()
   var queryStringObject = parsedUrl.query
   var headersObject = req.headers
   var chosenHandler = typeof(router[path]) != "undefined" ? router[path] : handler.notFound
   var decoder = new stringDecoder("utf-8")
   var buffer = ''
     req.on("data",function(data){
        buffer += decoder.write(data)
     })

     req.on("end",function(data){
        buffer += decoder.end()
        var requestPayload ={
           "method":method,
           "headers":headersObject,
           "path":path,
            "payload":buffer,
            "query":queryStringObject
        }

        chosenHandler(requestPayload,function(statusCode,responsePayload){

            statusCode = typeof(statusCode) == "number" ? statusCode : 200
            responsePayload = typeof(responsePayload) == "object" ? responsePayload : {}
            res.setHeader('content-type','application/json')
            var responsePayloadInString = JSON.stringify(responsePayload)
            
            res.writeHead(statusCode)
            res.end(responsePayloadInString)
            })

     }) 
}