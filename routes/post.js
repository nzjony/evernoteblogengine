var config = require('../config.js');

exports.post = function(req, res) {
	var post = blogContent.filter(function (post) {
		return post.htmlsafetitle == req.params.postname;
	});
	if(post.length == 0) {
		res.end();
	} else {
		//post is an array with one object, so pull it out, this may break
		//if I ever have two posts with the same name. Could potentially add
		//the date to it... think about it for now.
		post = post[0];
		//Title could be put in a config file... todo
		res.render('post', {title: 'Jonathan Stichbury\'s Adventures', 
							gaaccountid: config.googleAnalyticsId,
							item: post
						});
	}	
};