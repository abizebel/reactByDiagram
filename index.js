/*******************************************************************************************
 * @ Name : reactByDiagram
 * @ Author : Abbas Hosseini
 * @ Description : A simple library that convert diagram to react classes
 * @ Version : 1.0.0
 * @ Last update : Thursday - 2018 08 November
 ******************************************************************************************/
var contentManager = require('./modules/contentManager');
var {fileManager} = require('./modules/fileManager');
var bodyParser = require('body-parser');
var express = require('express');
var opn = require('opn');

var sourceDir = 'component';
//Create app
var app = express();
//Create router
var router = express.Router();
//Using JSON for ajax
app.use(bodyParser.json());
//Create static directory
app.use(express.static('public'));
  
/**
 * Save api
 */
app.post("/save", function(req, res){
    fileManager.removeFolder(sourceDir).createFolder(sourceDir);
    req.body.forEach(function(node, i){
        var fileName = `./${sourceDir}/${node.name}.js`;
        var content = contentManager.create(node)
        fileManager.createFile(fileName, content)
    })
    
    fileManager.createZip(sourceDir, 'public',function(){
        setTimeout(() => {
            return res.send({message : 'successfull'});
        }, 2000);
        
    }) 
});
 
/**
 * Listen to port 3000
 */
app.listen(3000, function () {
    opn('http://localhost:3000/')
})