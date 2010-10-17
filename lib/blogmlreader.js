var reader = exports,
		xml2js = require('node-xml2js/lib/xml2js');

exports.read = function (data, callback) {
	var parser = new xml2js.Parser();
	parser.addListener('end', function(result) {
		callback(result);
	});
	parser.parseString(data);
};
