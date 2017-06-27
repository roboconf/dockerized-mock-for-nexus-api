'user strict';
  
var restify = require('restify');
var fs = require('fs');


/**
 * Computes the hash (SHA1) of a file.
 * <p>
 * By default, local Maven repositories do not contain
 * hashes as we do not activate the profiles. So, we compute them on the fly.
 * </p>
 * 
 * @param filePath
 * @param res
 * @param next
 * @returns nothing
 */
function computeSha1(filePath, res, next) {

  var crypto = require('crypto')
    hash = crypto.createHash('sha1'),
    stream = fs.createReadStream(filePath);

  stream.on('data', function (data) {
    hash.update(data, 'utf8')
  });

  stream.on('end', function () {
    var result = hash.digest('hex');
    res.end(result);
    next();
  });
}


/**
 * The function that handles the response for the "redirect" operation.
 * @param req
 * @param res
 * @param next
 * @returns nothing
 */
function respond(req, res, next) {

  var fileName = req.params.a +
  '-' + req.params.v +
  '.' + req.params.p;

  var filePath = '/home/maven/repository/' +
    req.params.g.replace('.','/') +
    '/' + req.params.a +
    '/' + req.params.v +
    '/' + fileName;

  fs.exists(filePath, function(exists){
    if (filePath.indexOf('.sha1', filePath.length - 5) !== -1) {
      filePath = filePath.slice(0,-5);
      computeSha1(filePath,res, next);
    }

    else if (! exists) {
      res.writeHead(400, {'Content-Type': 'text/plain'});
      res.end('ERROR File ' + filePath + ' does NOT Exists');
      next();
    }

    else {
      res.writeHead(200, {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition' : 'attachment; filename=' + fileName});
      fs.createReadStream(filePath).pipe(res);
      next();
    }
  });
}


// Server setup

const server = restify.createServer({
  name: 'mock-for-nexus-api',
  version: '1.0.0'
});

server.use(restify.plugins.queryParser());
server.get('/redirect', respond);

server.listen(9090, function() {
  console.log('%s listening at %s', server.name, server.url);
});
