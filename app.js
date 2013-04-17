
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , post = require('./routes/post')
  , rss = require('./routes/rss')
  , http = require('http')
  , path = require('path')
  , config = require('./config.js')
  , evernote = require('./evernote.js');
global.config = config;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/post/:postname', post.post);
app.get('/flushcache/:guid', function(req, res) {
	if(req.params.guid == config.flushCacheGUID) {
		blogContent = [];
		evernote.getAllPublicNotes(function() {
			routes.index(req, res);
		});
	}
	else {
		res.send("Update failed");
	}
})
app.get('/rss.xml', rss.feed)

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  //Application has just started, so prefil the cache
  evernote.getAllPublicNotes(function(){
    console.log('Preloaded blog posts')
  });
});

//Extras

//Method to give us the month name, from http://www.hunlock.com/blogs/Javascript_Dates-The_Complete_Reference#quickIDX8
Date.prototype.getMonthName = function() {
   return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][this.getMonth()]; 
}

