require.paths.unshift(__dirname + '/../vendor');
console.log(console.log(require.paths));
var sys = require('sys'),
		sax = require('sax-js/lib/sax'),
		xml2js = require('node-xml2js/lib/xml2js'),		
		fs = require('fs');
var depth = 0;
var parser = new sax.parser(true);
var xml2js = new xml2js.Parser();

parser.onerror = function (e) {
	console.log(parser.error.message);
	console.log("Line: " + parser.line);
	console.log("Column: " + parser.column);
	console.log(sys.inspect(parser.error.stack));
	parser.resume();
};

parser.onopentag = function (attr) {
	var tabs = ''; 
	for(var i = 0; i < depth; i++) {
		tabs += '\t';
	}
	console.log(tabs + attr.name + ' : ' + parser.line);
	depth++;
};

parser.onclosetag = function (name) {
	depth--;
	var tabs = ''; 
	for(var i = 0; i < depth; i++) {
		tabs += '\t';
	}
	console.log(tabs + '/' + name + ' : ' + parser.line);
};


fs.readFile(__dirname + '/BlogML.xml', function(err, data){
	parser.write(data.toString()).close();
});
