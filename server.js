var http = require('http'),
  fs = require('fs');

var server = http.createServer(function (req, res) {
  console.log('req.url', req.url);
  if (req.url == '/' || req.url == '/index.html') {
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
  }
  else if (req.url == "/data" || req.url.startsWith('/data?')) {
    res.writeHeader(200, {
      "Content-Type": "application/json",
    });

    const data = [
      { "name": "Captain Ginyu", "age": 32 },
      { "name": "Lieutenant DickandBalls", "age": 42 },
      { "name": "Sweet Dee", "age": 35 }
    ];
    const parts = req.url.split("?");
    console.log('parts', parts);
    if (parts.length > 1) {
      const foo = parts[1].split("=");
      console.log(foo);

      const search = foo[1];
      const filtered = data.filter(function (datum) {
        const upperName = datum.name.toUpperCase();
        return upperName.includes(search.toUpperCase());
      });

      const json = JSON.stringify(filtered);
      res.write(json);
    } else {
      res.write(JSON.stringify(data));
    }
    res.end();
  }
  else {
    res.writeHeader(404);
    res.end();
  }
});

server.listen(8000);