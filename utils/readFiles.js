const fs = require('fs');

/**
 * 递归读取文件目录 及文件大小
 * @param path
 * @param fileList
 * @returns {Array}
 */
let readFiles = function (path, fileList = []) {
    var files = fs.readdirSync(path);
    files.forEach(function (file) {
        var fullPath = path +"/"+file;
        var fStat = fs.statSync(fullPath);
        if(fStat.isDirectory()) {
            // 二级目录 文件夹
            readFiles(fullPath, fileList)
        } else {
            var o = {};
            o.size = fStat.size;
            o.name = fStat.name;
            o.path = fullPath;
            fileList.push(o);
        }
    });
    return fileList;
};

module.exports = readFiles;