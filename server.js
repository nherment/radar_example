var fs = require('fs'),
    url = require('url'),
    http = require('http'),
    Radar = require('radar').server;

var server = http.createServer(function(req, res) {
    var pathname = url.parse(req.url).pathname;

    if(/^\/(css\/(bootstrap.min|chat).css)$/.test(pathname)) {
        res.setHeader('content-type', 'text/css');
        res.end(fs.readFileSync('./public'+pathname));
    } else if(/^\/(js\/radar_client.js|js\/bootstrap.min.js)$/.test(pathname)) {
        res.setHeader('content-type', 'text/javascript');
        res.end(fs.readFileSync('./public'+pathname));
    } else if(pathname == '/') {
        res.setHeader('content-type', 'text/html');
        res.end(fs.readFileSync('./public/index.html'));
    } else {
        console.log('404', req.url);
        res.statusCode = 404;
        res.end();
    }
});

var Type = require('radar').core.Type;

Type.register('chatMessage', {
    expr: new RegExp('^message:/.+/chat/.+$'),
    type: 'message',
    policy: { cache: true, maxCount: 300 }
});

Type.register('usernames', {
    expr: new RegExp('^status:/.+/username/.+$'),
    type: 'status',
    policy: { cache: true, maxAgeSeconds: 60 }
});

// attach Radar server to the http server
Radar.attach(server, {
    redis_host: 'localhost',
    redis_port: 6379
});

var port = process.env.PORT || 8000;

server.listen(port);
console.log('Server listening on localhost:'+port);