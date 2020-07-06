const express = require('express');
const path = require('path');

const app = express();
const server = require('./server/dist/server');
app.use(express.static(__dirname + '/dist'));
app.use('/api', server);
app.use(app.router);

app.get('/test', function(req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify({message: 'test123'}));
})

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(process.env.PORT || 8080);
