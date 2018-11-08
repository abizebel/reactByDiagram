var fs = require('fs');
var path = require("path");
var fsPromises = require('fs').promises;
var zip = require("node-native-zip");

class File {
    constructor (){}

    /**
     * Zip files
     * 
     * @param {String} path 
     * @param {String} dest if not defined default dest is folder place
     */
    createZip (dir, dest,cb){
        var archive = new zip();
        var folderContents = fs.readdirSync(dir);
        var files = folderContents.map(function(file){
            return ({
                name : file,
                path : `./${dir}/${file}`
            })
        })
        
        archive.addFiles(files, function (err) {
            if (err) return console.log("err while adding files", err); 
            var buff = archive.toBuffer();
            var directions = dir.split('/');
            var currentDir= (directions.length >1) ? directions[directions.length-1] : directions[0];
            if (dest != undefined){
                var zipName = `./${dest}/${currentDir}.zip`;
            }
            else {
                var zipName = `./${currentDir}.zip`;
            }
            
            fs.writeFile(zipName, buff, function () {
                cb()
            });
        });
    }

    /**
     * Create folder
     * 
     * @param {String} name 
     */
    createFolder (dir){
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        return this;
    }

    /**
     * Remove folder
     * 
     * @param {String} dir 
     */
    removeFolder (dir) {
        if (fs.existsSync(dir)) {
            
            function traverse(dir){
                var list = fs.readdirSync(dir);
                for(var i = 0; i < list.length; i++) {
                    var filename = path.join(dir, list[i]);
                    var stat = fs.statSync(filename);
                    if(filename == "." || filename == "..") {
                        // pass these files
                    } else if(stat.isDirectory()) {
                        // rmdir recursively
                        traverse(filename)
                        fsPromises.rmdir(filename);
                    } else {
                        // rm fiilename
                        fs.unlinkSync(filename);
                    }
                }
                fs.rmdirSync(dir);
            }
            traverse(dir)
            
        }
        return this;
    }

    /**
     * Create file
     * 
     * @param {String} name 
     * @param {String} content 
     */
    createFile (name, content){
        if (!fs.existsSync(name)) {
            fs.appendFile(name, content, function (err) {
                if (err) throw err;
            });
        }   
        return this;
    }

    /**
     * Remove file
     * 
     * @param {String} name 
     */
    removeFile (name){
        if (fs.existsSync(name)) {
            fs.unlinkSync(name);
        }   
        return this;
    }
}


const fileManager = new File();
exports.fileManager = fileManager;