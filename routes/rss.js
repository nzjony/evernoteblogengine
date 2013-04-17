var RSS = require('rss');

exports.feed = function(req, res) {
  feed = new RSS({
  	title: config.blogTitle,
  	description: config.blogDescription,
  	feed_url: config.blogUrl + '/rss.xml',
  	site_url: config.blogUrl,
  	author: config.blogAuthor
  });
  for(var i in blogContent) {
  	var post = blogContent[i];
  	feed.item({
  		title: post.title,
  		description: post.content,
  		url: config.blogUrl + '/post/' + post.htmlsafetitle,
  		author: config.blogAuthor,
  		date: post.created
  	});
  }
  res.send(feed.xml());
}