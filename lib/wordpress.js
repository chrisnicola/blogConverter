var wordpress = exports,
		normal = require('normal-template/lib/normal-template'),
		fs = require('fs'),
		src = fs.readFileSync(__dirname + '/../public/wordpress.xml'),
		template = normal.compile(src.toString(), {filters: {
			slug: function(val) {
				var sections = val.split('/');
				return sections[sections.length -1].replace('.aspx', '')
					.replace(/\s+/g, '-');
			}
		}});

wordpress.writeBlog = function(blog, callback) {
	callback(template(blog));
}
