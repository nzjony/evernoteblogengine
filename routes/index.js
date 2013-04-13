var evernote = require('../evernote.js'),
	config = require('../config.js');

exports.index = function(req, res){
	res.render('index', { title: 'Hello',
							gaaccountid: config.googleAnalyticsId,
							items: blogContent.sort(function(a, b) { 
								return b.created - a.created;
							})
						});
};