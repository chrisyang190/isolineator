var app = require('express')();
var express = require('express');
var server = require('http').Server(app);
var bodyParser = require('body-parser');
var fs = require('fs');
var record = require('node-record-lpcm16');
var request = require('request');
var multer = require('multer');
var db = require('../mongo-db/config.js');
var inputs = require('../mongo-db/inputs.js');
var Speech = require('../Server/speechToText.js');
const {Translater} = require('./TextTranslateApi.js');


var io = require ('socket.io')(server);

io.on('connection', (socket) => {
 console.log('io connected');
});

io.on('disconnect', (socket) => {
 console.log('io is disconnected');
});


app.use(express.static(__dirname + '/../angular-client'));
app.use(express.static(__dirname + '/../node_modules'));



// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({
 extended: true
}));


var storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/');
 },
 filename: function (req, file, cb) {
   var date = new Date().toISOString();
   cb(null, file.fieldname + '-' + date + '.wav');
 }
});

var upload = multer({ storage: storage });

var port = process.env.PORT || 5000;

app.post('/log', function(req, res) {
 console.log('req.body.query', req.body.query);
 res.status(201).end();
});

app.post('/record', upload.single('recording'), function(req, res) {

  console.log('post handled: request file', req.file);

  // Speech.streamFile(`./${req.file.path}`, (data)=>{
  //   if (data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
  //     console.log('data.results', data.results);
  //     console.log('data.results[0].transcript', data.results[0].transcript);
  //     res.status(201).send(data.results[0].transcript);
  //   }
  // });
  // // res.status(201).end();
});

app.post('/stopStream', function (req, res) {
 record.stop();
 io.on('remove', function() {
   io.disconnect();
   console.log('socket should be disconnected');
 });
 res.status(201).end();
});

// Creates a file first, THEN transcribes the audio from the file
// RETURNS the transcribed text string.
// first audio create wave file, then transcribes
app.post('/testCreate', (req, res) => {
 record.start({
   sampleRate: 44100,
   threshold: 0.5,
   verbose: true
 })
 .pipe(Speech.createAndStream('./Server/audio/test.wav', (data) => {
   if(data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
     res.status(201).end(data.results[0].transcript);
   }
 }));
});


// Creates a direct data stream from the user's microphone into the Speech-to-text API
// RETURNS the transcribed text string when the user is done talking
app.post('/testStream', function(req, res) {
  
  record.start({
    sampleRate: 44100,
    threshold: 0,
    verbose: true
  })
  .pipe(Speech.liveStreamAudio((data) => {

    if (data.results.length > 0) {
      io.emit('transcription', data);
    }

    if (data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
      if (Array.isArray(data.results)) {
        console.log('transcribed data from teststream (count = 0)', data.results[0].transcript);
        res.status(201).end(data.results[0].transcript);
      } else {
        console.log('transcribed data from teststream (count > 0): ', data.results);
        res.status(201).end(data.results[0].transcript);
      }
    }

  }));
});


// Transcribes a local audio file that already exisits
// RETURN the transcribed text string when done
app.post('/testFile', function(req, res) {
  Speech.streamFile('./Server/audio/test.wav',(data)=>{
    console.log(data.results);
    if(data.endpointerType === 'ENDPOINTER_EVENT_UNSPECIFIED') {
      res.status(201).send(data.results[0].transcript);
    }
  });
});


app.post('/txtTranslate', function(req, res) {
  console.log(Translater(req.body.textTranslate, 'es'));
})




server.listen(port, function () {
 console.log('server listening to', port);
});