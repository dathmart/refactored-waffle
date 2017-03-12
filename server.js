var http = require('http'),
  fs = require('fs');

var server = http.createServer(function (req, res) {
  //console.log('req', req.path);
  fs.readFile('./index.html', function (err, html) {
    if (err) {
      throw err;
    }
    res.writeHeader(200, {
      "Content-Type": "text/html",
      "Content-Length": html.length
    });
    res.write(html);
    res.end();
  });
});

server.listen(8000);