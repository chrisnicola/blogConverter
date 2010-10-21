var sys = require('sys'),
		fs = require('fs'),
		bmlReader = require('./blogmlreader'),
		wordpress = require('./wordpress');	

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
			if (tagList[tags[j].attr.ref]) { return; }
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
	tagList = {};
	for (var i=0; i < categories.length; i++) {
		catalog[categories[i].attr.id] = categories[i].title.text;
	}
	var posts = blog.posts.post;
	for (var j = 0; j < posts.length; j++) {
		posts[j].attr.id = posts.length - j;
		posts[j].content.text = posts[j].content.text.replace('[more]','<!--more-->');
		fixPostCats(catalog, posts[j]);
		addTags(tagList, posts[j]);
		fixPostComments(posts[j]);
	}
	blog.tags = [];
	for (tag in tagList) {
		blog.tags.push({name: tag});
	}
	return blog;
};

exports.convert = function (data, callback) {
	bmlReader.read(data, function(jsObj){
		jsObj = fixBlogData(jsObj);
		wordpress.writeBlog(jsObj, function(output){
			callback(output);
		});
	});
};

