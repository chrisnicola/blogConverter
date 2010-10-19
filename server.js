require.paths.unshift(__dirname + '/vendor');
var sys = require('sys'),
    formidable = require('formidable'),
    http = require('http'),
    nstatic = require('node-static/lib/node-static'),
    url = require('url'),
    utl = require('util'),
    convertor = require('./lib/convertor');

function upload_file(req, res) {
    var form = new formidable.IncomingForm()
        , files = []
        , fields = [];
    
    form.uploadDir = '/tmp';
    form.on('field', function(field, value){
        //p([field, value]);
        fields.push([field, value]);
    });
    form.on('file', function (field, file) {
        //p([field, file]);
        files.push([fields, file]);
    });
    form.on('end', function(){
        sys.log('Done');
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('testing');
        res.end(sys.inspect({fields: fields, files: files}));

    });
    form.parse(req); 
    return;
}

var staticFiles = new nstatic.Server('./public', { cache: false });

var server = http.createServer(function(req,res) {
    var location = url.parse(req.url, true);
    sys.log(sys.inspect(location));
    switch (location.pathname) {
        case '/upload':
            upload_file(req, res);
            break;
        default:
            staticFiles.serve(req, res);
    }
});

server.listen(81);
sys.log('Started...');


