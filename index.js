const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('/test', function(req, res) {
  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify({message: 'test123'}));
})

app.get('/*', function(req,res) {
  res.sendFile(path.join(__dirname+'/dist/index.html'));
});

app.listen(process.env.PORT || 8080);
