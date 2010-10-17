require.paths.unshift(__dirname + '/../vendor');
console.log(console.log(require.paths));
var sys = require('sys'),
		sax = require('sax-js/lib/sax'),
		xml2js = require('node-xml2js/lib/xml2js'),		
		fs = require('fs');
var depth = 0;
var parser = new xml2js.Parser();

parser.addListener('end', function (result) {
	console.log(sys.inspect(result));
});

fs.readFile(__dirname + '/BlogML.xml', function(err, data){
	parser.parseString(data);
});
