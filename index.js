const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder

const helloRouteHandler = ({method, headers, query, body}, cb) => {
  cb(200, {
    message: 'The End of The NPM culture.'
  });
};

const notFoundHandler = (dontcare, cb) => {
  cb(400);
};

const routes = {
  'hello':  helloRouteHandler,
};

const server = http.createServer((req, res) => {
  console.log('Hey, someone sent a request to you :)');

  const method = req.method.toLowerCase();
  const parsedUrl = url.parse(req.url);
  const query = parsedUrl.query;
  const headers = req.headers;
  const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');
  
  const utf8Decoder = new StringDecoder('utf-8');
  let body = '';
  req.on('data', (chunk) => {
    body += utf8Decoder.write(chunk);
  });
  req.on('end', () => {
    body += utf8Decoder.end();
    const handler = routes[path] || notFoundHandler;

    handler({
      method,
      headers,
      query,
      body,
    }, (statusCode, payload) => {
      statusCode = typeof statusCode === 'number' ? statusCode : 200;
      payload = typeof payload === 'object' ? payload : {};

      res.writeHead(statusCode);
      res.end(JSON.stringify(payload));
    });

  });
}).listen(3000, () => {
  console.log(`Server is listening on port ${server.address().port}`);
});
