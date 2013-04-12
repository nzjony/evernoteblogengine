var evernote = require('../evernote.js');

exports.index = function(req, res){
	res.render('index', { title: 'Hello', items: blogContent.sort(function(a, b) { 
		return b.created - a.created;
	})});
};