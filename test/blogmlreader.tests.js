require.paths.unshift(__dirname + '/../vendor');
var dsl = require('nodeunit-dsl'),
		test = dsl.test, run = dsl.run,
		before = dsl.before, after = dsl.after,
		sys = require('sys'),
		fs = require('fs'),
		bmlReader = require('../lib/blogmlreader'),
		wordpress = require('../lib/wordpress');	

if (module.id === '.') { run(__filename); }

var fixPostCats = function(catalog, post) {
	if (post.categories) { 
		var postCats = post.categories.category;
		for (var k = 0; k < postCats.length; k++) {
			postCats[k].attr.ref = catalog[postCats[k].attr.ref];
		}
	}
};

var addTags = function(tagList, post) {
	if (post.tags) {
		var tags = post.tags.tag;
		for(var j=0; j < tags.length; j++) {
			tagList[tags[j].attr.ref] = {};
			tagList[tags[j].attr.ref].name = tags[j].attr.ref;
		}
	}
};

var fixPostComments = function (post) {
	if (post.comments && post.comments.comment){
		var idMap = {};
		var comments = post.comments.comment;
		for (var i = 0; i < comments.length; i++) {
			idMap[comments[i].attr.id] = i + 1;
			comments[i].attr.id = i + 1;
			var parent = idMap[comments[i].attr.parentid]; 
			comments[i].attr.parentid = parent ? parent : 0;
		}
	}
};

var fixBlogData = function(blog) {
	var catalog = {};
	var categories = blog.categories.category;
	blog.tags = {};
	for (var i=0; i < categories.length; i++) {
		catalog[categories[i].attr.id] = categories[i].title.text;
	}
	var posts = blog.posts.post;
	for (var j = 0; j < posts.length; j++) {
		posts[j].attr.id = posts.length - j;
		fixPostCats(catalog, posts[j]);
		addTags(blog.tags, posts[j]);
		fixPostComments(posts[j]);
	}
	return blog;
};



test('Can read from blogml file', function(t) {
	fs.readFile(__dirname + '/data/BlogML.xml', function (err, data) {
		bmlReader.read(data, function(jsObj){
			jsObj = fixBlogData(jsObj);
			wordpress.writeBlog(jsObj, function(output){
				console.log(output);
				t.done();
			});
		});
	});
});

