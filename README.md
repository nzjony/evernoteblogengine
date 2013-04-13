# Evernote blog engine.

I was inspired to be able to write and edit blog posts using Evernote. This is an application written in node.js which pulls out public notes and renders them. As this works with publicly available notes, you don't need to worry about any authentication worries.

## Basic workflow

1. Write a note in Evernote.
2. Put it in the public folder that the engine is connected to.
3. Sync Evernote.
4. Go to http://yoururl.com/flushcach/guid, this refreshes the interal cache of blog posts (they are stored in memory).
5. See your post online.
6. Realise you made a mistake.
7. Follow steps 3-5

## Install & Run

1. Install node on a server.
2. git clone https://github.com/nzjony/evernoteblogengine.git
3. go to directory
4. npm install
5. su 
6. export PORT=80
7. npm install forever
8. forever start app.js
9. flush the notes

## Configuration of config.js

1. 'flushCacheGUID', create a GUID, this is used to flush the internal cache.
2. 'googleAnalyticsId', find your Google Analytics 'TrackingID' and put it here.
3. 'evernoteUsername', your evernote username.
4. 'evernotePublicNotebookName', the name of the public folder. To create one, simply go to Evernote, create a new folder, and share it.
5. 'blogTitle', what ever you want the title of your page to be.

## Uses
- express
- jade
- enml-js: https://github.com/berryboy/enml-js
- evernode from everest-js library: https://github.com/berryboy/everest-js
- node-thrift