var fs = require("fs")
var path = require("path")



var lib = {}
lib.baseDir = path.join(__dirname,"/../.data/")
lib.create = function(pathName,fileName,data,callback){
    var fileDirectory = `${lib.baseDir}${pathName}/${fileName}.json`
    fs.open(fileDirectory,"wx",function(err,fileDescriptor){

        if(!err){
            var dataInString = JSON.stringify(data)

            fs.write(fileDescriptor,dataInString,function(err){
                if(!err){
                    fs.close(fileDescriptor,function(err){
                        if(!err){
                        callback(false)
                        }else{
                        callback("Error Closing File")
                        }
                    })
                }else{
                    callback("Error Writing File")
                }
            })
        }else{
            callback("User Exists")
        }
    })
}

lib.get = function(pathName,fileName,callback){
    var fileDirectory = `${lib.baseDir}${pathName}/${fileName}.json` 
    fs.readFile(fileDirectory,"utf8",function(err,data){
        if(!err){
        callback(false,data)
        }else{
        callback(true,err)
        }
    })
}






module.exports = lib