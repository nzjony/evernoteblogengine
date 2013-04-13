var thrift = require('thrift'), 
    customConnections = require('evernode/lib/evernode/CustomConnections'),
    UserStore = require('evernode/lib/evernote-thrift/gen-nodejs/UserStore'),
    NoteTypes = require('evernode/lib/evernote-thrift/gen-nodejs/NoteStore_types'),
    NoteStore = require('evernode/lib/evernote-thrift/gen-nodejs/NoteStore'),
    http = require('http'),
    enml = require('enml-js'),
    config = require('./config.js');

var evernoteServer = "www.evernote.com";
var userConnection = customConnections.createHTTPSConnection(evernoteServer, 443, '/edam/user');
var userClient = thrift.createClient(UserStore, userConnection);

//Helper method to build the noteClient for us
function buildNoteClientForUser(user) {
	var noteConnection = customConnections.createHTTPSConnection(evernoteServer, 443, '/edam/note/' + user.shardId);
	return thrift.createClient(NoteStore, noteConnection);
}

//Global container for our posts
blogContent = [];

exports.getAllPublicNotes = function(callback) {
	userClient.getPublicUserInfo(config.evernoteUsername, function(err, response) {
		var noteClient = buildNoteClientForUser(response);
		var webApiUrlPrefix = response.webApiUrlPrefix;	
		//Pull out my public notebook
		noteClient.getPublicNotebook(response.userId, config.evernotePublicNotebookName, function(err, response) {			
			//Setup a filter to get the notes from the public notebook
			var noteFilter = new NoteTypes.NoteFilter();
			noteFilter.notebookGuid = response.guid;
			
			var resultSpec = new NotesMetadataResultSpec();
			var listPublicNotes = noteClient.findNotesMetadata("", noteFilter, 0, 10, resultSpec, function(err, response) {
				if(err) {
					console.error("Error: " + err);
				}
				else {
					console.log("Found " + response.totalNotes + " notes");
				}
				
				var totalNotes = response.totalNotes;
				var notesProcessed = 0;	
				for(var i = 0; i < totalNotes; i++) {
					var currentNote = response.notes[i];
					var note = noteClient.getNote("", currentNote.guid, true, false, false, false, function(err, response) {
						if(err) {
							console.log("Error: " + err);
							return;
						}
						notesProcessed++;
						var resources = {};
						for(var resIndex in response.resources) {
							var resource = response.resources[resIndex];
							resources[resource.data.bodyHash] = webApiUrlPrefix + 'res/' + resource.guid;
						}
						
						var content = enml.HTMLOfENML(response.content, resources);
						var date = new Date(response.created);
						blogContent.push({
							title: response.title,
							content: content,
							created: response.created,
							date: date.getMonthName() + " " + date.getDate() + ", " + date.getFullYear(),
							htmlsafetitle: response.title.replace(/ /g, "-")
						});

						//Maybe there is a better way of doing this?
						if(notesProcessed == totalNotes) {
							console.log("finished");
							callback();
						}
					});
				}
			})
		})
	})
};