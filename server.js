require.paths.unshift(__dirname + '/vendor');
var sys = require('sys'),
    multipart = require('multipart'),
    http = require('http'),
    nstatic = require('node-static'),
    url = require('url'),
    converter = require('./lib/converter');

function parse_multipart(req) {
    var parser = multipart.parser();
    sys.log(sys.inspect(req.headers));
    // Make parser use parsed request headers
    parser.headers = req.headers;

    // Add listeners to request, transfering data to parser

    req.addListener("data", function(chunk) {
        parser.write(chunk);
    });

    req.addListener("end", function() {
        parser.close();
    });

    return parser;
}

/*
 * Handle file upload
 */
function upload_file(req, res) {
    // Request body is binary
    req.setEncoding('binary');
    // Handle request as multipart
    var stream = parse_multipart(req);

    var data = '';

    // Set handler for a request part received
    stream.onPartBegin = function(part) {
        sys.debug("Started part, name = " + part.name + ", filename = " + part.filename);
    };

    // Set handler for a request part body chunk received
    stream.onData = function(chunk) {
        data += chunk;
    };

    // Set handler for request completed
    stream.onEnd = function() {
        res.writeHead('200', {'Content-Type': 'text/plain'});
        converter.convert(data, function(output){
            res.write(output);
            res.end();
        });
    };
}

var staticFiles = new nstatic.Server('./public/', { cache: 3600 });

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

server.listen(80);
sys.log('Started...');


