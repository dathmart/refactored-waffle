var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {
<<<<<<< HEAD

=======
  console.log('req.url', req.url);
>>>>>>> 71a17cfa59506a370f63e44cf3980b0a9e2d20f6
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

<<<<<<< HEAD
    http.get({
      host: "www.spitcast.com",
      path: "/api/spot/all"
    }, (response) => {
      var body = '';
      response.on('data', (d) => {
        body += d;
      });
      response.on('end', () => {
        // console.log(body);
        // const parsed = JSON.parse(body);
        // res.write(JSON.stringify(parsed));
        res.write(body);
        res.end();
      });
    });

    return;
    //
=======
    const data = [
      { "name": "Captain Ginyu", "age": 32 },
      { "name": "Lieutenant DickandBalls", "age": 42 },
      { "name": "Sweet Dee", "age": 35 }
    ];
>>>>>>> 71a17cfa59506a370f63e44cf3980b0a9e2d20f6
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
<<<<<<< HEAD
    res.end();
  }
  else {
    res.writeHeader(404);
    res.end();
  }
=======
    res.end();
  }
  else {
    res.writeHeader(404);
    res.end();
  }
>>>>>>> 71a17cfa59506a370f63e44cf3980b0a9e2d20f6
});

server.listen(8000);

// Create a web server that loads all spots from the Spitcast API
//  and writes to browser as html table