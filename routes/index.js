var express = require('express');
var router = express.Router();
var readFiles = require('../utils/readFiles');
var fs = require('fs');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


var globalCache = {
  fileList:[],
  ts: -1
}; // 缓存及时间戳

/**
 * 文件监听 句柄
 * @type {fs.Watcher}
 */
var fsWatcher = null;
router.use(function (req, res, next) {
  if(!fsWatcher) {
      /**
       * 首次进行监听文件
       */
      fsWatcher = fs.watch(process.env.DATA_DIR, {
          recursive:true
      },function (etype, fileName) {
          // 文件变动后更新缓存
          globalCache.fileList = readFiles(process.env.DATA_DIR);
          globalCache.ts = Date.now();
      });
  }
  next();
});

/**
 * 读取目录
 */
router.get('/readdir', function (req, res, err) {
  if(req.query.ts){
    var ts = req.query.ts;
    // 时间戳版本 相同 则不更新
    if(parseInt(ts) === globalCache.ts) {
      return res.send({
          refresh: false
      })
    }
  }
  // 缓存缺失情况下 更新缓存
  if(globalCache.ts === -1) {
      var fileList = readFiles(process.env.DATA_DIR);
      globalCache.fileList = fileList;
      globalCache.ts = Date.now();
  }
  res.send({
      refresh: true,
      fileList: globalCache.fileList,
      ts: globalCache.ts
  });
});
module.exports = router;
