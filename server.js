// Create a web server that loads all spots from the Spitcast API
//  and writes to browser as html table

var http = require('http');
var fs = require('fs');

var server = http.createServer(function (req, res) {

  const foo = (fileName) => {
    const fileType = ~fileName.indexOf('.js')
      ? 'javascript'
      : fileName.substring(fileName.indexOf('.') + 1);

    fs.readFile('./' + fileName, function (err, text) {
      if (err) {
        throw err;
      }
      res.writeHeader(200, {
        "Content-Type": "text/" + fileType,
        "Content-Length": text.length
      });
      res.write(text);
      res.end();
    });
  }

  if (req.url == '/' || req.url == '/index.html') {
    foo('index.html');
  }
  else if (req.url == '/mondoSurf.js') {
    foo('mondoSurf.js');
  }

  else if (req.url == "/data" || req.url.startsWith('/data?')) {
    res.writeHeader(200, {
      "Content-Type": "application/json",
    });

    http.get({
      host: "api.spitcast.com",
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