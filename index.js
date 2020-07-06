const express = require('express');
const path = require('path');

const app = express();
const server = require('./server-dist/server.js');
app.use(express.static(__dirname + '/dist'));
app.use('/api', server);

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(process.env.PORT || 8080);
