require.paths.unshift(__dirname + '/../vendor');
var dsl = require('nodeunit-dsl'),
		test = dsl.test, run = dsl.run,
		before = dsl.before, after = dsl.after,
		sys = require('sys'),
		fs = require('fs'),
		bmlReader = require('../lib/blogmlreader.js');
		
if (module.id === '.') { run(__filename); }

test('Can read from blogml file', function(t) {
	t.expect(1);
	fs.readFile(__dirname + '/data/BlogML.xml', function (err, data) {
		bmlReader.read(data, function(jsObj){
			t.equal(jsObj.title.text,'lucisferre');
			t.done();
		});
	});
});
